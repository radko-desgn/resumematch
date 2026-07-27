"""Improved 4-slide 'Coming Soon' carousel (A/B cover), via the marketing system.

Built through the ig-* skill workflow and rendered with the shared brand system
(backend/carousel.py). Slide 3 shows a fictional, labelled demo result composed
only from the existing brand colours (met #12935C, partial amber, missing
#D64545) — no new visual identity.

Renders two 4-slide sets that differ only in the cover:
  docs/social/instagram/coming-soon-v2/coming-soon-a-01..04.png  (statement cover)
  docs/social/instagram/coming-soon-v2/coming-soon-b-01..04.png  (question cover)

    python -m backend.post_coming_soon_v2
"""

from __future__ import annotations

from backend.carousel import render_carousel

CAMPAIGN = "coming-soon-v2"
CTA = '<div class="cta">Follow for launch</div><div class="bib">@resume.matches</div>'


def head(html: str, px: int = 88) -> str:
    return f'<span style="font-size:{px}px">{html}</span>'


# ---- slide 3 fictional demo result card (brand colours only) --------------
def _row(label: str, status: str, color: str, bg: str) -> str:
    return (
        '<div style="display:flex;align-items:center;justify-content:space-between;'
        'padding:8px 0;font-size:26px;color:#fff">'
        f'<span>{label}</span>'
        f'<span style="font-size:19px;font-weight:700;color:{color};background:{bg};'
        f'padding:3px 12px;border-radius:8px">{status}</span></div>'
    )


MET = ("#12935C", "rgba(18,147,92,.16)")
PARTIAL = ("#C79A3E", "rgba(199,154,62,.16)")
MISSING = ("#D64545", "rgba(214,69,69,.16)")

RESULT_CARD = (
    '<div style="margin-top:26px;width:600px;max-width:100%;text-align:left;'
    'border:1px solid rgba(255,255,255,.14);border-radius:22px;'
    'background:rgba(255,255,255,.03);padding:28px 30px">'
    '<div style="display:flex;align-items:baseline;gap:14px;margin-bottom:18px">'
    '<div style="font-family:Montserrat,sans-serif;font-weight:800;font-size:62px;line-height:1">'
    '68<span style="font-size:28px;color:rgba(255,255,255,.5)">%</span></div>'
    '<div style="font-size:20px;letter-spacing:3px;text-transform:uppercase;'
    'color:rgba(255,255,255,.5)">match &middot; demo</div></div>'
    + _row("SQL", "met", *MET)
    + _row("Data visualisation", "met", *MET)
    + _row("A/B testing", "partial", *PARTIAL)
    + _row("Stakeholder reporting", "partial", *PARTIAL)
    + _row("Looker", "missing", *MISSING)
    + '<div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(255,255,255,.1);'
    'font-size:23px;line-height:1.4;color:rgba(255,255,255,.72)">'
    'Fix: add clearer evidence of A/B testing.</div></div>'
)

# ---- slide 4 compact legend + CTA -----------------------------------------
LEGEND = (
    '<div style="margin-top:24px;display:flex;gap:22px;font-size:22px">'
    f'<span style="color:{MET[0]};font-weight:700">met</span>'
    f'<span style="color:{PARTIAL[0]};font-weight:700">partial</span>'
    f'<span style="color:{MISSING[0]};font-weight:700">missing</span></div>'
    + CTA
)

# ---- shared slides 2-4 ----------------------------------------------------
SLIDE_2 = {
    "eyebrow": "Why",
    "headline_html": head('Good, or <span class="hl">right</span>?'),
    "lede": "One role wants SQL and dashboards. Another wants campaigns and copy. "
            "A good CV still has to prove what this role needs.",
    "lede_class": "wide",
}
SLIDE_3 = {
    "eyebrow": "Meet ResumeMatch",
    "headline_html": head('Check the <span class="hl met">fit</span> first.', 56),
    "lede": "It scores your CV against the specific role, from real evidence.",
    "lede_class": "wide",
    "extra": RESULT_CARD,
}
SLIDE_4 = {
    "eyebrow": "Coming soon",
    "headline_html": head('Know the <span class="hl">gap</span> first.'),
    "lede": "ResumeMatch is coming soon.",
    "extra": LEGEND,
}

COVER_A = {  # statement
    "eyebrow": "Job hunting",
    "headline_html": head('Good CV.<br><span class="hl">Wrong</span> job.', 96),
    "lede": "A strong CV can still be the wrong one for this role.",
    "lede_class": "wide",
}
COVER_B = {  # diagnostic question
    "eyebrow": "Before you apply",
    "headline_html": head('Does your CV <span class="hl">prove</span> it?', 84),
    "lede": "The job asks for specific things. Does your CV show them?",
    "lede_class": "wide",
}

SET_A = [COVER_A, SLIDE_2, SLIDE_3, SLIDE_4]
SET_B = [COVER_B, SLIDE_2, SLIDE_3, SLIDE_4]


def render_all() -> None:
    for slug, slides in (("coming-soon-a", SET_A), ("coming-soon-b", SET_B)):
        res = render_carousel(CAMPAIGN, slug, slides)
        print(f"[{slug}] {len(res.paths)} slides; warnings: {res.warnings or 'none'}")


if __name__ == "__main__":
    render_all()
