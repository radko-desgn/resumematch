"""'You're not underqualified' carousel — job-search pain -> evidence -> launch.

Produced through the ig-* marketing skills (strategist -> hooks -> carousel ->
from-result -> caption -> reviewer -> guardian -> boost, humanized) and rendered
with the shared brand system (backend/carousel.py). Pillar: job-search pain +
product proof. CTA: Follow for launch (site is pre-launch).

    python -m backend.post_prove_it
"""

from __future__ import annotations

from backend.carousel import render_carousel

HEAD = "font-size:84px"  # same scale as the other 6-slide sets


def h(html: str) -> str:
    return f'<span style="{HEAD}">{html}</span>'


CTA = '<div class="cta">Follow for launch</div><div class="bib">@resumematch.pro</div>'


SLIDES = [
    {"eyebrow": "Reality check",
     "headline_html": h('You\'re not <span class="hl">underqualified</span>.'),
     "lede": "Your CV just doesn't prove it.", "lede_class": "wide"},
    {"eyebrow": "The pattern",
     "headline_html": h('Capable, but not <span class="hl">convincing</span>.'),
     "lede": "You can do the job. Your CV still has to show it.", "lede_class": "wide"},
    {"eyebrow": "Why",
     "headline_html": h('They match to <span class="hl">evidence</span>.'),
     "lede": "Recruiters and ATS go off what your CV shows, not what you could do.",
     "lede_class": "wide"},
    {"eyebrow": "The fix",
     "headline_html": h('Show the <span class="hl">proof</span>.'),
     "lede": "For every requirement the job lists, point to where you've actually done it.",
     "lede_class": "wide"},
    {"eyebrow": "Meet ResumeMatch",
     "headline_html": h('See what your CV <span class="hl met">proves</span>.'),
     "lede": "It ties each requirement to real evidence in your CV, and flags met, "
             "partial, or missing.", "lede_class": "wide"},
    {"eyebrow": "Before you apply",
     "headline_html": h('Prove it <span class="hl">first</span>.'),
     "lede": "", "extra": CTA},
]


def render_all() -> None:
    res = render_carousel("prove-it-v1", "prove-it", SLIDES)
    print(f"[prove-it-v1] {len(res.paths)} slides; warnings: {res.warnings or 'none'}")


if __name__ == "__main__":
    render_all()
