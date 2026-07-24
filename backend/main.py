"""ResumeMatch FastAPI backend.

Run: uvicorn backend.main:app --reload --port 8000
One endpoint (/api/analyze) resolves any input source to text, then runs the
existing engine. Free by default (mock=True); live needs ANTHROPIC_API_KEY.
"""

from __future__ import annotations

import os
from typing import Optional

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from backend import auth, billing, credits, cv_export, extract, history, mailer, report
from resumematch import validation
from resumematch.analyzer import analyze, generate_tailored_cv

app = FastAPI(title="ResumeMatch API", version="0.2.0")

# Allowed browser origins:
#   * localhost / 127.0.0.1 on any port          -> local dev
#   * any *.vercel.app subdomain                 -> the deployed frontend and
#                                                   its per-branch preview URLs
#   * anything listed in FRONTEND_ORIGINS (csv)  -> the custom domain, once bought
# Set FRONTEND_ORIGINS on the host, e.g. "https://resumematch.app,https://www.resumematch.app".
_ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get("FRONTEND_ORIGINS", "").split(",") if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_origin_regex=r"https://([a-z0-9-]+\.)*vercel\.app|http://(localhost|127\.0\.0\.1):\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)


def _has_key() -> bool:
    return bool(os.environ.get("ANTHROPIC_API_KEY"))


def _resolve(kind: str, text: Optional[str], url: Optional[str],
             file: Optional[UploadFile], mock: bool) -> str:
    """Turn one input (by kind) into plain text."""
    if kind == "text":
        return (text or "").strip()
    if kind == "url":
        if not url:
            raise HTTPException(422, "No URL provided.")
        try:
            return extract.extract_url(url)
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(422, f"Couldn't fetch that URL: {exc}")
    if kind in ("file", "image"):
        if file is None:
            raise HTTPException(422, "No file provided.")
        data = file.file.read()
        name = (file.filename or "").lower()
        if name.endswith(".pdf"):
            return extract.extract_pdf(data)
        if name.endswith(".docx"):
            return extract.extract_docx(data)
        return extract.extract_image(data, file.content_type or "image/png", mock)
    raise HTTPException(422, f"Unknown input kind: {kind}")


class ReportRequest(BaseModel):
    analysis: dict


class TailoredCVRequest(BaseModel):
    cv_text: str
    job_text: str
    mock: bool = True
    gaps: list[str] = []


class CVExportRequest(BaseModel):
    markdown: str
    format: str = "pdf"


class EmailRequest(BaseModel):
    email: str
    analysis: dict


class CheckoutRequest(BaseModel):
    pack: str


@app.get("/api/health")
def health() -> dict:
    return {
        "ok": True,
        "has_key": _has_key(),
        "email_provider": bool(os.environ.get("RESEND_API_KEY") or os.environ.get("SMTP_HOST")),
        "accounts": auth.is_configured(),
    }


@app.get("/api/credits")
def read_credits(user_id: str = Depends(auth.require_user)) -> dict:
    """The signed-in user's balance. The server is the source of truth."""
    return credits.get_balance(user_id)


@app.get("/api/scans")
def list_scans(user_id: str = Depends(auth.require_user)) -> list:
    """The signed-in user's scan history (summaries only)."""
    return history.list_scans(user_id)


@app.get("/api/scans/{scan_id}")
def get_scan(scan_id: str, user_id: str = Depends(auth.require_user)) -> dict:
    """Full stored analysis for one past scan, so it can be reviewed."""
    return history.get_scan(user_id, scan_id)


@app.delete("/api/scans/{scan_id}")
def remove_scan(scan_id: str, user_id: str = Depends(auth.require_user)) -> dict:
    history.delete_scan(user_id, scan_id)
    return {"deleted": True}


@app.delete("/api/account")
def delete_account(claims: dict = Depends(auth.require_claims)) -> dict:
    """Permanently delete the account and all data attached to it."""
    history.delete_account(claims["sub"], claims.get("email"))
    return {"deleted": True}


@app.post("/api/checkout")
def checkout(req: CheckoutRequest, user_id: str = Depends(auth.require_user)) -> dict:
    """Buy a credit pack.

    Payment is still simulated (see backend/billing.py), but the grant now
    lands in the database against a real account rather than in localStorage.
    """
    try:
        session = billing.create_session(req.pack)
    except KeyError:
        raise HTTPException(404, f"Unknown pack: {req.pack}")
    session["balance"] = credits.grant(user_id, session["grants"])
    return session


# NOTE: sync `def` so FastAPI runs these in a worker thread — sync Playwright
# cannot run inside the event loop.
@app.post("/api/report/pdf")
def report_pdf(req: ReportRequest) -> Response:
    if not req.analysis.get("score"):
        raise HTTPException(422, "Missing analysis payload.")
    try:
        pdf = report.render_pdf(req.analysis)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(500, f"Could not build the PDF: {exc}")
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="resumematch-report.pdf"'},
    )


@app.post("/api/report/email")
def report_email(req: EmailRequest) -> dict:
    if not mailer.valid_email(req.email):
        raise HTTPException(422, "That doesn't look like a valid email address.")
    if not req.analysis.get("score"):
        raise HTTPException(422, "Missing analysis payload.")
    try:
        pdf = report.render_pdf(req.analysis)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(500, f"Could not build the PDF: {exc}")
    return mailer.send_report(req.email.strip(), pdf, req.analysis)


@app.post("/api/analyze")
async def analyze_endpoint(
    cv_kind: str = Form(...),
    job_kind: str = Form(...),
    mock: bool = Form(True),
    full: bool = Form(True),
    email: Optional[str] = Form(None),
    marketing_consent: bool = Form(False),
    cv_text: Optional[str] = Form(None),
    job_text: Optional[str] = Form(None),
    job_url: Optional[str] = Form(None),
    cv_file: Optional[UploadFile] = File(None),
    job_file: Optional[UploadFile] = File(None),
    user_id: Optional[str] = Depends(auth.optional_user),
) -> dict:
    cv = _resolve(cv_kind, cv_text, None, cv_file, mock)
    job = _resolve(job_kind, job_text, job_url, job_file, mock)
    if not cv.strip() or not job.strip():
        raise HTTPException(422, "Could not extract text from the CV and/or job inputs.")

    # Refuse to score nonsense. Without this, anything over the length minimum
    # produced a confident percentage -- and in demo mode that number is canned,
    # so gibberish scored 74%. A match score that survives garbage input teaches
    # users the score is meaningless.
    for text, kind in ((cv, "cv"), (job, "job")):
        verdict = validation.check(text, kind)
        if not verdict.ok:
            raise HTTPException(422, verdict.reason)

    # Free quick check: no account needed, but an email address is, and each
    # address gets a limited number. Signed-in users are already identified, so
    # they are not asked again.
    free_quota: Optional[dict] = None
    if not full and not user_id:
        addr = (email or "").strip()
        if not mailer.valid_email(addr):
            raise HTTPException(422, "Enter a valid email address to run your free scan.")
        free_quota = credits.claim_free_scan(addr, marketing_consent)
        if not free_quota["allowed"]:
            raise HTTPException(
                429,
                "You've already used the free scan for this email. "
                "Create an account to keep going.",
            )

    # The free quick check stays open to anonymous visitors. The deep analysis
    # costs a credit, so it needs an account -- and the charge happens here, on
    # the server, not in the browser. Inputs are validated first so a rejected
    # request never costs anything.
    if full:
        if not user_id:
            raise HTTPException(401, "Sign in to run the deep analysis.")
        if not credits.spend_scan(user_id):
            raise HTTPException(402, "You're out of scan credits.")

    try:
        result = analyze(cv, job, mock=mock, with_rewrites=full)
    except ValueError as exc:  # e.g. missing API key on a live run
        if full and user_id:
            credits.grant(user_id, {"scans": 1})  # refund: we charged, it failed
        raise HTTPException(400, str(exc))
    except Exception:
        if full and user_id:
            credits.grant(user_id, {"scans": 1})
        raise
    # Echo the resolved text lengths so the UI can show what was parsed.
    payload = result.model_dump()
    payload["_meta"] = {"cv_chars": len(cv), "job_chars": len(job), "mock": mock, "full": full}
    if free_quota is not None:
        payload["_meta"]["free_scans_left"] = free_quota["scans_left"]
    payload["_source"] = {"cv": cv, "job": job}
    return payload


@app.post("/api/tailored-cv")
def tailored_cv(req: TailoredCVRequest, user_id: str = Depends(auth.require_user)) -> dict:
    """Generate an ATS-friendly CV rewritten for this specific job (paid tier)."""
    if not req.cv_text.strip() or not req.job_text.strip():
        raise HTTPException(422, "Both the CV and the job description are required.")
    if not credits.spend_cv(user_id):
        raise HTTPException(402, "You're out of tailored-CV credits.")
    try:
        result = generate_tailored_cv(req.cv_text, req.job_text, mock=req.mock, gaps=req.gaps)
    except ValueError as exc:
        credits.grant(user_id, {"cvs": 1})  # refund
        raise HTTPException(400, str(exc))
    except Exception:
        credits.grant(user_id, {"cvs": 1})
        raise
    return result.model_dump()


@app.post("/api/tailored-cv/export")
def tailored_cv_export(req: CVExportRequest) -> Response:
    if not req.markdown.strip():
        raise HTTPException(422, "Nothing to export.")
    fmt = req.format.lower()
    try:
        if fmt == "pdf":
            data, media = cv_export.cv_to_pdf(req.markdown), "application/pdf"
        elif fmt == "docx":
            data = cv_export.cv_to_docx(req.markdown)
            media = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        else:
            raise HTTPException(422, "format must be 'pdf' or 'docx'.")
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(500, f"Could not build the {fmt.upper()}: {exc}")
    return Response(
        content=data,
        media_type=media,
        headers={"Content-Disposition": f'attachment; filename="tailored-cv.{fmt}"'},
    )
