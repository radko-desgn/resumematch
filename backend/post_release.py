"""Launch carousel — "It's live" (4 slides), via the ig-* marketing system.

Rendered with the shared brand system (backend/carousel.py). The product is now
live, so the CTA points at the real free check. Slide 3 reuses the labelled demo
result card from the coming-soon set.

    python -m backend.post_release
"""

from __future__ import annotations

from backend.carousel import render_carousel
from backend.post_coming_soon_v2 import RESULT_CARD


def head(html: str, px: int = 88) -> str:
    return f'<span style="font-size:{px}px">{html}</span>'


CTA = ('<div class="cta">Free check · resumematch.pro</div>'
       '<div class="bib">@resumematch.pro</div>')


SLIDES = [
    {"eyebrow": "Now live",
     "headline_html": head('Know if your CV <span class="hl met">fits</span>.'),
     "lede": "Before you apply. Free to try.", "lede_class": "wide"},
    {"eyebrow": "What it does",
     "headline_html": head('Your CV vs the <span class="hl">exact job</span>.'),
     "lede": "Scored from real evidence in your CV. Nothing invented.",
     "lede_class": "wide"},
    {"eyebrow": "See the gaps",
     "headline_html": head('Met, partial, <span class="hl">missing</span>.', 56),
     "lede": "Every requirement, checked before you apply.",
     "lede_class": "wide", "extra": RESULT_CARD},
    {"eyebrow": "It's live",
     "headline_html": head('See your <span class="hl met">match</span>.'),
     "lede": "", "extra": CTA},
]


def render_all() -> None:
    res = render_carousel("release", "release", SLIDES)
    print(f"[release] {len(res.paths)} slides; warnings: {res.warnings or 'none'}")


if __name__ == "__main__":
    render_all()
