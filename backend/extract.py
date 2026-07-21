"""Input adapters: turn any CV/job source into plain text.

Free/local: text, PDF, DOCX, URL. Paid: image OCR via Claude vision (stubbed in
mock mode so the wizard is fully demoable without a key or cost).
"""

from __future__ import annotations

import base64
import io

_MOCK_OCR = (
    "[mock OCR] In a live run, Claude vision reads the uploaded screenshot and "
    "returns its text here. Set ANTHROPIC_API_KEY and turn off mock mode to use it."
)


def extract_pdf(data: bytes) -> str:
    from pypdf import PdfReader

    reader = PdfReader(io.BytesIO(data))
    return "\n".join((page.extract_text() or "") for page in reader.pages).strip()


def extract_docx(data: bytes) -> str:
    import docx

    document = docx.Document(io.BytesIO(data))
    return "\n".join(p.text for p in document.paragraphs).strip()


_BROWSER_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0 Safari/537.36"
)

# Ordered best-effort selectors for the job description body.
_JOB_SELECTORS = [
    ".show-more-less-html__markup",      # LinkedIn
    ".description__text",                # LinkedIn
    "[data-testid*='jobDescription']",
    "[class*='job-description']",
    "#job-description",
    "section.description",
    "div[class*='posting']",             # Lever
    "div#content",                       # Greenhouse
    "article",
    "main",
]

_WALL_HINTS = ("sign in", "join now", "create a password", "verify you are human", "enable javascript")


def _jsonld_job(soup) -> str:
    """schema.org JobPosting is the cleanest source when a site publishes it."""
    import json

    from bs4 import BeautifulSoup

    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "{}")
        except Exception:
            continue
        for obj in data if isinstance(data, list) else [data]:
            if isinstance(obj, dict) and obj.get("@type") == "JobPosting":
                parts = [obj.get("title", ""), (obj.get("hiringOrganization") or {}).get("name", "")
                         if isinstance(obj.get("hiringOrganization"), dict) else "",
                         BeautifulSoup(obj.get("description", ""), "html.parser").get_text(" ", strip=True)]
                text = "\n".join(p for p in parts if p).strip()
                if len(text) > 200:
                    return text
    return ""


def _selector_job(soup) -> str:
    for sel in _JOB_SELECTORS:
        for node in soup.select(sel):
            text = " ".join(node.get_text(" ", strip=True).split())
            if len(text) > 400:  # long enough to plausibly be the description
                return text
    return ""


def extract_url(url: str) -> str:
    """Fetch a job posting URL and return the description text.

    Strategy: schema.org JobPosting -> known description containers -> whole page.
    Raises ValueError when the page yields no usable job text (login/consent wall,
    JS-only page), so the caller can tell the user to paste the text instead.
    """
    import httpx
    from bs4 import BeautifulSoup

    resp = httpx.get(url, follow_redirects=True, timeout=20, headers={"User-Agent": _BROWSER_UA})
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    text = _jsonld_job(soup) or _selector_job(soup)

    if not text:  # fall back to the whole page, minus chrome
        for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "svg", "form"]):
            tag.decompose()
        text = "\n".join(ln.strip() for ln in soup.get_text("\n").splitlines() if ln.strip())

    if len(text) < 250:
        head = text[:400].lower()
        why = "the page looks like a sign-in/consent wall" if any(w in head for w in _WALL_HINTS) else "the page had no readable job text"
        raise ValueError(
            f"Couldn't read a job description from that link — {why}. "
            "Open the posting, copy the description, and use the 'Paste text' tab instead."
        )
    return text


def extract_image(data: bytes, media_type: str = "image/png", mock: bool = False) -> str:
    """OCR an image via Claude vision. Returns a canned stub in mock mode."""
    if mock:
        return _MOCK_OCR
    from resumematch.config import MODEL
    from resumematch.llm import client

    b64 = base64.standard_b64encode(data).decode()
    resp = client().messages.create(
        model=MODEL,
        max_tokens=2000,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": b64}},
                    {"type": "text", "text": "Extract all text from this document/screenshot verbatim as plain text."},
                ],
            }
        ],
    )
    return "".join(b.text for b in resp.content if b.type == "text").strip()
