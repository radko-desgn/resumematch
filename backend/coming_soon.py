"""Render the 3-slide 'Coming Soon' Instagram carousel.

A deliberately DIFFERENT layout from the ig-1..3 social cards: fully centred
composition, a large centred logo, faint concentric rings for depth, and the
key word of each headline set on an inverted highlight chip. Same brand palette
(monochrome #0A0A0A / white) and type (Montserrat/Inter), so it reads as the
same brand without being a copy of the other set.

Copy was drafted with the `social` skill and passed through `humanizer`.

    python -m backend.coming_soon      # -> docs/social/coming-soon-1..3.png
"""

from __future__ import annotations

import base64
from pathlib import Path

ASSETS = Path(__file__).parent / "assets"
OUT_DIR = Path(__file__).parent.parent / "docs" / "social"

W, H = 1080, 1350


def _logo() -> str:
    p = ASSETS / "logo-white.png"
    return "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode() if p.exists() else ""


FONTS = (
    '<link href="https://fonts.googleapis.com/css2?'
    "family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap\" rel=\"stylesheet\">"
)

# Faint concentric rings, centred, for depth without any glow.
RINGS = """
<svg class="rings" viewBox="0 0 1080 1350" preserveAspectRatio="xMidYMid slice">
  <g fill="none" stroke="rgba(255,255,255,.055)" stroke-width="1.5">
    <circle cx="540" cy="700" r="250"/>
    <circle cx="540" cy="700" r="400"/>
    <circle cx="540" cy="700" r="550"/>
    <circle cx="540" cy="700" r="700"/>
  </g>
</svg>"""

CSS = f"""
  * {{ box-sizing: border-box; margin: 0; }}
  body {{ width: {W}px; height: {H}px; background: #0A0A0A; color: #fff;
         font-family: Inter, system-ui, sans-serif; overflow: hidden;
         position: relative; }}
  .rings {{ position: absolute; inset: 0; width: {W}px; height: {H}px; }}
  .dots {{ position: absolute; inset: 0;
           background-image: radial-gradient(rgba(255,255,255,.05) 1.5px, transparent 1.6px);
           background-size: 48px 48px; opacity: .5; }}

  .card {{ position: absolute; inset: 0; display: flex; flex-direction: column;
           align-items: center; text-align: center; padding: 96px 96px 104px; }}

  .logo {{ height: 52px; width: auto; }}

  .mid {{ flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 30px; }}

  .eyebrow {{ font-size: 24px; font-weight: 600; letter-spacing: 7px;
              text-transform: uppercase; color: rgba(255,255,255,.5); }}

  /* generous leading so a highlighted line never collides with the one above */
  h1 {{ font-family: Montserrat, sans-serif; font-weight: 800; letter-spacing: -.02em;
        line-height: 1.32; }}

  /* the "different background for that moment": an inverted highlight chip.
     Modest vertical padding + the roomy line-height keeps it from swallowing
     the line; trailing punctuation stays OUTSIDE the chip. */
  .hl {{ background: #fff; color: #0A0A0A; border-radius: 12px;
         padding: 0.02em 0.22em; box-decoration-break: clone;
         -webkit-box-decoration-break: clone; }}
  .hl.met {{ background: #12935C; color: #fff; }}

  .lede {{ font-size: 32px; line-height: 1.5; color: rgba(255,255,255,.72);
           max-width: 20ch; }}
  /* the solution slide carries the longest explainer: more contrast, a bit
     larger, and a wider measure so it reads in fewer, longer lines */
  .lede.wide {{ font-size: 34px; line-height: 1.55; color: rgba(255,255,255,.82);
                max-width: 27ch; }}
  /* short teaser line that should never wrap */
  .lede.nowrap {{ max-width: none; white-space: nowrap; }}

  .cta {{ margin-top: 8px; background: #fff; color: #0A0A0A; font-weight: 700;
          font-size: 30px; padding: 22px 40px; border-radius: 999px; }}
  .bib {{ margin-top: 20px; font-size: 25px; color: rgba(255,255,255,.5); }}

  .dots-rail {{ display: flex; gap: 12px; }}
  .dots-rail i {{ width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.25); }}
  .dots-rail i.on {{ background: #fff; }}
"""


def _page(index: int, eyebrow: str, headline_html: str, lede: str, extra: str = "",
          lede_class: str = "") -> str:
    dots = "".join(f'<i class="{"on" if k == index else ""}"></i>' for k in (1, 2, 3))
    return f"""<!doctype html><html><head><meta charset="utf-8">{FONTS}
<style>{CSS}</style></head><body>
{RINGS}
<div class="dots"></div>
<div class="card">
  <img class="logo" src="{_logo()}" alt="ResumeMatch">
  <div class="mid">
    <div class="eyebrow">{eyebrow}</div>
    <h1>{headline_html}</h1>
    <p class="lede {lede_class}">{lede}</p>
    {extra}
  </div>
  <div class="dots-rail">{dots}</div>
</div>
</body></html>"""


# One shared headline size across the set (a real type scale), and trailing
# punctuation sits outside the highlight chip.
HEAD = "font-size:90px"

SLIDE_1 = _page(
    1,
    "The problem",
    f'<span style="{HEAD}">You apply.<br>Then <span class="hl">nothing</span>.</span>',
    "You never find out if you were close, or nowhere near.",
)

SLIDE_2 = _page(
    2,
    "The fix",
    f'<span style="{HEAD}">Know if you <span class="hl met">fit</span><br>before you apply.</span>',
    "Paste your CV and the job post. Get a match score, the gaps to fix, and a CV tuned to the role.",
    lede_class="wide",
)

SLIDE_3 = _page(
    3,
    "Coming soon",
    f'<span style="{HEAD}">Stop guessing.<br>Start <span class="hl">matching</span>.</span>',
    "ResumeMatch is almost here.",
    lede_class="nowrap",
    # No waitlist exists yet, so the CTA is a follow — something we can actually
    # deliver on. Swap for "Try it free" pointing at the live site once launched.
    extra='<div class="cta">Follow for launch</div>'
    '<div class="bib">@resumematch</div>',
)

SLIDES = [SLIDE_1, SLIDE_2, SLIDE_3]


def render(out_dir: Path = OUT_DIR) -> list[Path]:
    from PIL import Image
    from playwright.sync_api import sync_playwright

    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        for i, html in enumerate(SLIDES, start=1):
            page.set_content(html, wait_until="networkidle")
            page.wait_for_timeout(600)  # webfonts
            path = out_dir / f"coming-soon-{i}.png"
            tmp = out_dir / f"_cs{i}.png"
            page.screenshot(path=str(tmp))
            Image.open(tmp).resize((W, H), Image.LANCZOS).save(path)  # 2x -> crisp 1080x1350
            tmp.unlink(missing_ok=True)
            written.append(path)
        browser.close()
    return written


if __name__ == "__main__":
    if not _logo():
        raise SystemExit("logo asset missing")
    for p_ in render():
        print(f"wrote {p_} ({p_.stat().st_size // 1024} KB)")
