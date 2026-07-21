"""Email delivery for the match report.

Real sending is used when a provider is configured (RESEND_API_KEY, or SMTP_*).
Otherwise the call succeeds in "simulated" mode so the feature is fully usable
in the free demo without signing up for an email provider.
"""

from __future__ import annotations

import base64
import os
import re
from typing import Any

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$")


def valid_email(addr: str) -> bool:
    return bool(EMAIL_RE.match((addr or "").strip()))


def _body_html(score: int, verdict: str) -> str:
    return f"""
    <div style="font-family:Inter,system-ui,sans-serif;color:#0A0A0A">
      <h2 style="font-family:Montserrat,sans-serif">Your ResumeMatch report</h2>
      <p>Your match score is <strong>{score}/100</strong> — {verdict}.</p>
      <p>The full report is attached as a PDF: executive summary, strengths,
         gaps to address, and suggested CV rewrites.</p>
      <p style="color:#6B6B72;font-size:12px">Evidence-based — nothing fabricated.</p>
    </div>"""


def send_report(to: str, pdf: bytes, analysis: dict[str, Any]) -> dict:
    """Send the report. Returns {sent, simulated, provider, detail}."""
    score = analysis.get("score", {}).get("overall_fit_score", 0)
    verdict = analysis.get("score", {}).get("verdict", "")
    subject = f"Your ResumeMatch report — {score}/100"

    resend_key = os.environ.get("RESEND_API_KEY")
    if resend_key:
        import httpx

        payload = {
            "from": os.environ.get("RESEND_FROM", "ResumeMatch <onboarding@resend.dev>"),
            "to": [to],
            "subject": subject,
            "html": _body_html(score, verdict),
            "attachments": [
                {"filename": "resumematch-report.pdf", "content": base64.b64encode(pdf).decode()}
            ],
        }
        r = httpx.post(
            "https://api.resend.com/emails",
            json=payload,
            headers={"Authorization": f"Bearer {resend_key}"},
            timeout=20,
        )
        if r.status_code >= 300:
            return {"sent": False, "simulated": False, "provider": "resend", "detail": r.text[:200]}
        return {"sent": True, "simulated": False, "provider": "resend", "detail": "Email sent."}

    smtp_host = os.environ.get("SMTP_HOST")
    if smtp_host:
        import smtplib
        from email.message import EmailMessage

        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = os.environ.get("SMTP_FROM", "resumematch@localhost")
        msg["To"] = to
        msg.set_content(f"Your match score is {score}/100 — {verdict}. Report attached.")
        msg.add_alternative(_body_html(score, verdict), subtype="html")
        msg.add_attachment(pdf, maintype="application", subtype="pdf", filename="resumematch-report.pdf")
        with smtplib.SMTP(smtp_host, int(os.environ.get("SMTP_PORT", 587))) as s:
            s.starttls()
            if os.environ.get("SMTP_USER"):
                s.login(os.environ["SMTP_USER"], os.environ.get("SMTP_PASSWORD", ""))
            s.send_message(msg)
        return {"sent": True, "simulated": False, "provider": "smtp", "detail": "Email sent."}

    return {
        "sent": False,
        "simulated": True,
        "provider": None,
        "detail": "Demo mode — no email provider configured. Download the PDF instead.",
    }
