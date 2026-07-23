"""Render the Instagram intro carousel (3 slides, 1080x1350).

The three slides answer, in order: what it is → what you get → why it helps.

Visual continuity is deliberate, so the set reads as one story when swiped:
  * the score dial sits in the same position on every slide and progressively
    fills (28% → 62% → 78%), paying off with the real number on slide 3;
  * a progress rail at the bottom advances 1/3 → 2/3 → 3/3;
  * identical grid, logo placement, and type scale throughout.

Rendered from HTML through headless Chromium — same approach as the PDF report
and OG card, so type is pixel-perfect and the set is reproducible.

    python -m backend.social_cards      # -> docs/social/ig-1..3.png
"""

from __future__ import annotations

import base64
import math
from pathlib import Path

ASSETS = Path(__file__).parent / "assets"
OUT_DIR = Path(__file__).parent.parent / "docs" / "social"

W, H = 1080, 1350
R = 300
CIRC = 2 * math.pi * R
TRACK = CIRC * 0.75  # three-quarter dial, as in the app


def _logo() -> str:
    p = ASSETS / "logo-white.png"
    return "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode() if p.exists() else ""


def _dial(pct: float, show_number: bool) -> str:
    """The shared motif. Same geometry every slide; only the fill changes."""
    off = TRACK * (1 - pct / 100)
    number = (
        f"""<text x="400" y="424" text-anchor="middle" font-family="Montserrat, sans-serif"
              font-size="150" font-weight="700" letter-spacing="-6" fill="#fff">{int(pct)}<tspan
              font-size="66" fill="rgba(255,255,255,.45)">%</tspan></text>
            <text x="400" y="482" text-anchor="middle" font-family="Inter, sans-serif"
              font-size="24" font-weight="600" letter-spacing="7" fill="rgba(255,255,255,.5)">MATCH</text>"""
        if show_number
        else ""
    )
    return f"""
<svg class="dial" viewBox="0 0 800 800">
  <g transform="rotate(-135 400 400)">
    <circle cx="400" cy="400" r="{R}" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="26"
            stroke-linecap="round" stroke-dasharray="{TRACK:.1f} {CIRC:.1f}"/>
    <circle cx="400" cy="400" r="{R}" fill="none" stroke="#fff" stroke-width="26"
            stroke-linecap="round" stroke-dasharray="{TRACK:.1f} {CIRC:.1f}" stroke-dashoffset="{off:.1f}"/>
  </g>
  {number}
</svg>"""


CSS = f"""
  * {{ box-sizing: border-box; margin: 0; }}
  body {{ width: {W}px; height: {H}px; background: #0A0A0A; color: #fff;
         font-family: Inter, system-ui, sans-serif; overflow: hidden;
         position: relative; padding: 84px 76px 96px;
         display: flex; flex-direction: column; }}

  .logo {{ height: 42px; width: auto; align-self: flex-start; display: block; }}

  /* The connecting motif — same size and corner on every slide, so the fill
     level is the only thing that changes as you swipe. Kept clear of the text
     column (which stops at 620px) so nothing overlaps. */
  .dial {{ position: absolute; width: 330px; height: 330px;
           right: 70px; bottom: 128px; opacity: 1; }}
  .dial.ghost {{ opacity: .38; }}

  /* text column — never collides with the dial */
  .content {{ max-width: 620px; }}

  .eyebrow {{ margin-top: 64px; font-size: 22px; font-weight: 600;
              letter-spacing: 6px; text-transform: uppercase;
              color: rgba(255,255,255,.45); display: flex; align-items: center; gap: 18px; }}
  .eyebrow .rule {{ width: 46px; height: 1px; background: rgba(255,255,255,.28); }}

  h1 {{ font-family: Montserrat, sans-serif; font-weight: 700; letter-spacing: -.03em;
        margin-top: 30px; }}

  .lede {{ margin-top: 30px; font-size: 32px; line-height: 1.5;
           color: rgba(255,255,255,.62); }}

  ul {{ list-style: none; margin-top: 48px; display: flex; flex-direction: column; gap: 28px; }}
  li {{ display: flex; gap: 22px; align-items: flex-start; }}
  li .n {{ font-family: Montserrat, sans-serif; font-weight: 700; font-size: 22px;
           color: rgba(255,255,255,.35); padding-top: 7px; min-width: 36px; }}
  li .t {{ font-size: 30px; line-height: 1.36; }}
  li .t b {{ font-weight: 600; }}
  li .t span {{ display: block; font-size: 24px; color: rgba(255,255,255,.5); margin-top: 7px; }}

  .spacer {{ flex: 1; }}

  .foot {{ display: flex; align-items: center; justify-content: space-between; }}
  .cta {{ font-size: 27px; color: rgba(255,255,255,.85); }}
  .cta b {{ font-weight: 600; color: #fff; }}

  /* progress rail — advances across the set */
  .rail {{ display: flex; gap: 10px; }}
  .rail i {{ width: 46px; height: 5px; border-radius: 99px; background: rgba(255,255,255,.22); }}
  .rail i.on {{ background: #fff; }}
"""


def _page(body: str, pct: float, index: int, show_number: bool = False) -> str:
    rail = "".join(f'<i class="{"on" if k <= index else ""}"></i>' for k in (1, 2, 3))
    ghost = "" if show_number else " ghost"
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>
{_dial(pct, show_number).replace('class="dial"', f'class="dial{ghost}"')}
<img class="logo" src="{_logo()}" alt="ResumeMatch">
<div class="content">{body}</div>
<div class="spacer"></div>
<div class="foot"><div class="rail">{rail}</div></div>
</body></html>"""


# ---- slide content -------------------------------------------------------

SLIDE_1 = _page(
    """
<div class="eyebrow"><span class="rule"></span>What it is</div>
<h1 style="font-size:96px; line-height:1.02">Know if your CV fits.</h1>
<p class="lede">Drop in your CV and any job post. Get an honest match score — before you waste an application.</p>
<p class="lede" style="margin-top:44px;font-size:26px;color:rgba(255,255,255,.42)">Swipe →</p>
""",
    pct=28,
    index=1,
)

SLIDE_2 = _page(
    """
<div class="eyebrow"><span class="rule"></span>What you get</div>
<h1 style="font-size:76px; line-height:1.06">Four things, every time.</h1>
<ul>
  <li><span class="n">01</span><span class="t"><b>A match score</b><span>0–100, calibrated — not flattery.</span></span></li>
  <li><span class="n">02</span><span class="t"><b>Evidence-backed gaps</b><span>Every judgment quoted from your CV.</span></span></li>
  <li><span class="n">03</span><span class="t"><b>A tailored ATS CV</b><span>Reordered and reworded. Never invented.</span></span></li>
  <li><span class="n">04</span><span class="t"><b>Any input</b><span>PDF, DOCX, a link, or a screenshot.</span></span></li>
</ul>
""",
    pct=62,
    index=2,
)

SLIDE_3 = _page(
    """
<div class="eyebrow"><span class="rule"></span>Why it helps</div>
<h1 style="font-size:72px; line-height:1.06">Stop guessing.<br>Apply smarter.</h1>
<ul>
  <li><span class="n">→</span><span class="t"><b>Save hours</b><span>No more hand-tailoring every application.</span></span></li>
  <li><span class="n">→</span><span class="t"><b>Beat the screeners</b><span>Mirror the job's real keywords, honestly.</span></span></li>
  <li><span class="n">→</span><span class="t"><b>Know before you apply</b><span>One score tells you if it's worth it.</span></span></li>
</ul>
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
            path = out_dir / f"ig-{i}.png"
            page.screenshot(path=str(path))
            written.append(path)
        browser.close()
    return written


if __name__ == "__main__":
    for p_ in render():
        print(f"wrote {p_} ({p_.stat().st_size // 1024} KB)")
