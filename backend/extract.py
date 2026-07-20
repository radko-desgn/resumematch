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


def extract_url(url: str) -> str:
    import httpx
    from bs4 import BeautifulSoup

    resp = httpx.get(
        url,
        follow_redirects=True,
        timeout=15,
        headers={"User-Agent": "Mozilla/5.0 (ResumeMatch)"},
    )
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "svg"]):
        tag.decompose()
    lines = [ln.strip() for ln in soup.get_text("\n").splitlines() if ln.strip()]
    return "\n".join(lines)


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
