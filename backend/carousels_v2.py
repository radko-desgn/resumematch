"""Rebuild the three big-prompt carousels via the new marketing system.

Concepts (from the campaign brief), produced with the ig-carousel rules
(one idea per slide, a chipped key word, education/ethics/proof pillars,
no invented proof, CTA = follow-for-launch) and rendered with the shared
brand system through backend/carousel.py.

Each renders to its own v2 folder:
    docs/social/instagram/<slug>-v2/<slug>-NN.png

    python -m backend.carousels_v2
"""

from __future__ import annotations

from backend.carousel import render_carousel

HEAD = "font-size:84px"  # consistent scale across these 6-slide sets


def h(html: str) -> str:
    return f'<span style="{HEAD}">{html}</span>'


CTA = '<div class="cta">Follow for launch</div><div class="bib">@resumematch.pro</div>'


# 1 — Your CV may be good, and still wrong for the job (pillar: education)
CV_GOOD = [
    {"eyebrow": "Reality check",
     "headline_html": h('A good CV can still be <span class="hl">wrong</span>.'),
     "lede": "For this specific job, at least.", "lede_class": "wide"},
    {"eyebrow": "Why",
     "headline_html": h('Good isn\'t the same as <span class="hl">fit</span>.'),
     "lede": "A strong CV isn't automatically a strong match for every role.", "lede_class": "wide"},
    {"eyebrow": "Example",
     "headline_html": h('Every role wants <span class="hl">different</span> things.'),
     "lede": "One prioritises SQL and reporting. The next, stakeholder management.", "lede_class": "wide"},
    {"eyebrow": "What we do",
     "headline_html": h('We check the <span class="hl met">evidence</span>.'),
     "lede": "ResumeMatch maps each job requirement to real evidence in your CV.", "lede_class": "wide"},
    {"eyebrow": "You see",
     "headline_html": h('Met, partial, or <span class="hl">missing</span>.'),
     "lede": "Before you apply, not after the rejection.", "lede_class": "wide"},
    {"eyebrow": "Before you apply",
     "headline_html": h('Know the <span class="hl">gap</span> first.'),
     "lede": "", "extra": CTA},
]

# 2 — Tailoring your CV should not mean inventing experience (pillar: ethics)
TAILORING = [
    {"eyebrow": "Honest question",
     "headline_html": h('Tailoring shouldn\'t mean <span class="hl">lying</span>.'),
     "lede": "But most AI resume tools quietly cross that line.", "lede_class": "wide"},
    {"eyebrow": "The problem",
     "headline_html": h('They add what was never <span class="hl">true</span>.'),
     "lede": "Impressive rewrites built on skills and tools you never had.", "lede_class": "wide"},
    {"eyebrow": "Our line",
     "headline_html": h('Only what\'s <span class="hl met">already there</span>.'),
     "lede": "ResumeMatch rephrases what's in your CV. Nothing invented.", "lede_class": "wide"},
    {"eyebrow": "Never",
     "headline_html": h('No invented <span class="hl">anything</span>.'),
     "lede": "No fake tools. No fake metrics. No fake achievements.", "lede_class": "wide"},
    {"eyebrow": "Result",
     "headline_html": h('Sharper. Still <span class="hl met">yours</span>.'),
     "lede": "A stronger CV built from your real experience.", "lede_class": "wide"},
    {"eyebrow": "Before you apply",
     "headline_html": h('Tailor it <span class="hl">honestly</span>.'),
     "lede": "", "extra": CTA},
]

# 3 — A match score is useless without evidence (pillar: product proof)
EVIDENCE = [
    {"eyebrow": "Unpopular truth",
     "headline_html": h('A score alone is <span class="hl">useless</span>.'),
     "lede": "A number can't tell you what to fix.", "lede_class": "wide"},
    {"eyebrow": "Think about it",
     "headline_html": h('"64%" tells you <span class="hl">nothing</span>.'),
     "lede": "Nothing you can actually act on. (Example score.)", "lede_class": "wide"},
    {"eyebrow": "What we do",
     "headline_html": h('Every requirement, its <span class="hl met">evidence</span>.'),
     "lede": "ResumeMatch ties each job requirement to a line in your CV.", "lede_class": "wide"},
    {"eyebrow": "You see",
     "headline_html": h('Met. Partial. <span class="hl">Missing</span>.'),
     "lede": "Clearly, requirement by requirement.", "lede_class": "wide"},
    {"eyebrow": "Now",
     "headline_html": h('The score becomes a <span class="hl met">plan</span>.'),
     "lede": "You know exactly what to improve.", "lede_class": "wide"},
    {"eyebrow": "Before you apply",
     "headline_html": h('Know <span class="hl">why</span>.'),
     "lede": "", "extra": CTA},
]

CAROUSELS = {
    "cv-good-still-wrong": CV_GOOD,
    "tailoring-without-lying": TAILORING,
    "evidence-not-just-a-score": EVIDENCE,
}


def render_all() -> None:
    for slug, slides in CAROUSELS.items():
        res = render_carousel(f"{slug}-v2", slug, slides)
        print(f"[{slug}-v2] {len(res.paths)} slides; warnings: {res.warnings or 'none'}")


if __name__ == "__main__":
    render_all()
