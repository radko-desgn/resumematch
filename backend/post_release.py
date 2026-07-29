"""Launch carousel — "RELEASED" + free-scan push (4 slides).

On-brand: the shared black/white system (backend/carousel.py), white logo, green
used ONLY as the meaning accent chip (met). Distinct from coming-soon through the
message (it's released, first scan free), not through off-brand colours.

    python -m backend.post_release
"""

from __future__ import annotations

from backend.carousel import render_carousel
from backend.post_coming_soon_v2 import RESULT_CARD


def head(html: str, px: int = 88) -> str:
    return f'<span style="font-size:{px}px">{html}</span>'


CTA = ('<div class="cta">resumematch.pro</div>'
       '<div class="bib">@resumematch.pro</div>')


SLIDES = [
    {"eyebrow": "The wait is over",
     "headline_html": head('It\'s <span class="hl met">released</span>.'),
     "lede": "Your first scan is free.", "lede_class": "wide"},
    {"eyebrow": "No account. No catch.",
     "headline_html": head('Your first scan is <span class="hl met">free</span>.', 70),
     "lede": "Paste your CV and a job post. See your fit in ~15 seconds.",
     "lede_class": "wide"},
    {"eyebrow": "What you get",
     "headline_html": head('Met, partial, <span class="hl">missing</span>.', 56),
     "lede": "Every requirement, checked before you apply.",
     "lede_class": "wide", "extra": RESULT_CARD},
    {"eyebrow": "It's live · free to try",
     "headline_html": head('Scan your CV <span class="hl met">free</span>.'),
     "lede": "", "extra": CTA},
]


def render_all() -> None:
    res = render_carousel("release", "release", SLIDES)
    print(f"[release] {len(res.paths)} slides; warnings: {res.warnings or 'none'}")


if __name__ == "__main__":
    render_all()
