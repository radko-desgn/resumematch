"""Render the 3-slide 'Coming Soon' Instagram carousel.

Deliberately built on the SAME design system as social_cards.py (the existing
ig-1..3 set): identical CSS, the shared score-dial motif that fills across the
slides (28% -> 62% -> 78%), the eyebrow-with-rule, Montserrat headlines, and the
advancing progress rail. Reusing those pieces is what keeps this set consistent
with the rest of the brand's visuals rather than inventing a new look.

Problem -> solution -> coming-soon/CTA.

    python -m backend.coming_soon      # -> docs/social/coming-soon-1..3.png
"""

from __future__ import annotations

from pathlib import Path

# Reuse the established system verbatim, so the two carousels are visually identical
# in everything but copy.
from backend.social_cards import W, H, _logo, _page

OUT_DIR = Path(__file__).parent.parent / "docs" / "social"


SLIDE_1 = _page(
    """
<div class="eyebrow"><span class="rule"></span>The problem</div>
<h1 style="font-size:82px; line-height:1.06">You're applying blindly.</h1>
<p class="lede">Your CV vanishes into the void — with no idea if it even fits the job.</p>
<p class="lede" style="margin-top:44px;font-size:26px;color:rgba(255,255,255,.42)">Swipe →</p>
""",
    pct=28,
    index=1,
)

SLIDE_2 = _page(
    """
<div class="eyebrow"><span class="rule"></span>The fix</div>
<h1 style="font-size:76px; line-height:1.08">Know your fit,<br>instantly.</h1>
<p class="lede">AI reads your CV and the job post — scores the match, flags the gaps,
and tailors your CV.</p>
<p class="lede" style="margin-top:44px;font-size:26px;color:rgba(255,255,255,.42)">Swipe →</p>
""",
    pct=62,
    index=2,
)

SLIDE_3 = _page(
    """
<div class="eyebrow"><span class="rule"></span>Coming soon</div>
<h1 style="font-size:80px; line-height:1.04">Stop guessing.<br>Start matching.</h1>
<p class="lede">ResumeMatch — know if your CV fits, before you apply.</p>
<p class="cta" style="margin-top:40px"><b>Join the waitlist →</b></p>
<p class="lede" style="margin-top:12px;font-size:24px;color:rgba(255,255,255,.5)">Link in bio · @resumematch</p>
""",
    pct=78,
    index=3,
    show_number=True,
)

SLIDES = [SLIDE_1, SLIDE_2, SLIDE_3]


def render(out_dir: Path = OUT_DIR) -> list[Path]:
    from playwright.sync_api import sync_playwright

    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for i, html in enumerate(SLIDES, start=1):
            page.set_content(html, wait_until="networkidle")
            page.wait_for_timeout(600)  # let webfonts settle
            path = out_dir / f"coming-soon-{i}.png"
            page.screenshot(path=str(path))
            written.append(path)
        browser.close()
    return written


if __name__ == "__main__":
    # touch _logo so a missing asset fails loudly rather than rendering blank
    if not _logo():
        raise SystemExit("logo asset missing")
    for p_ in render():
        print(f"wrote {p_} ({p_.stat().st_size // 1024} KB)")
