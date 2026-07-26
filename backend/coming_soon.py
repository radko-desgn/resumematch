"""Render the 3-slide 'Coming Soon' Instagram carousel.

Same Playwright/Chromium pipeline as social_cards.py: HTML is the design tool,
Chromium the renderer. The trick for a *seamless* carousel is to lay the whole
thing out as ONE wide 3240x1350 canvas — background texture, the connecting
hand-drawn line, the ghosted arcs all cross slide boundaries — then slice it
into three 1080x1350 posts. Swiped in order, they read as one image.

Brand: the monochrome identity (bg #0A0A0A, white type, one whisper of the
`met` green). Montserrat/Inter for structure; Caveat for the hand-drawn key
lines the brief asked for.

    python -m backend.coming_soon      # -> docs/social/coming-soon-1..3.png
"""

from __future__ import annotations

import base64
from pathlib import Path

ASSETS = Path(__file__).parent / "assets"
OUT_DIR = Path(__file__).parent.parent / "docs" / "social"

SLIDE_W, H = 1080, 1350
W = SLIDE_W * 3  # one continuous canvas
MET = "#12935C"


def _logo() -> str:
    p = ASSETS / "logo-white.png"
    return "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode() if p.exists() else ""


FONTS = (
    '<link href="https://fonts.googleapis.com/css2?'
    "family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&"
    'family=Caveat:wght@600;700&display=swap" rel="stylesheet">'
)

CSS = f"""
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ background: #0A0A0A; }}
  .canvas {{ position: relative; width: {W}px; height: {H}px; overflow: hidden;
             background: #0A0A0A; color: #fff; font-family: Inter, sans-serif; }}

  /* --- shared background, spans all three slides for continuity --- */
  .bg {{ position: absolute; inset: 0; }}
  /* faint dot grid for depth */
  .bg .dots {{ position: absolute; inset: 0; opacity: .5;
    background-image: radial-gradient(rgba(255,255,255,.05) 1.5px, transparent 1.6px);
    background-size: 46px 46px; }}
  .bg svg {{ position: absolute; inset: 0; width: {W}px; height: {H}px; }}
  /* ghosted oversized numerals behind each beat */
  .ghost {{ position: absolute; font-family: Montserrat, sans-serif; font-weight: 800;
            font-size: 760px; line-height: 1; color: rgba(255,255,255,.035);
            top: 46%; transform: translateY(-50%); user-select: none; }}

  /* --- slides --- */
  .slides {{ position: absolute; inset: 0; display: flex; }}
  .slide {{ position: relative; width: {SLIDE_W}px; height: {H}px;
            padding: 92px 84px 104px; display: flex; flex-direction: column; }}
  /* hairline seam guide so each post is balanced (not visible as a border) */
  .slide + .slide {{ box-shadow: inset 1px 0 0 rgba(255,255,255,.05); }}

  .logo {{ height: 40px; width: auto; }}

  .eyebrow {{ margin-top: 74px; font-size: 23px; font-weight: 600; letter-spacing: 6px;
              text-transform: uppercase; color: rgba(255,255,255,.42);
              display: flex; align-items: center; gap: 16px; }}
  .eyebrow .rule {{ width: 40px; height: 1px; background: rgba(255,255,255,.3); }}

  h1 {{ font-family: Caveat, cursive; font-weight: 700; letter-spacing: 0;
        margin-top: 26px; }}
  h1 .plain {{ font-family: Montserrat, sans-serif; font-weight: 800;
               letter-spacing: -.02em; display: block; }}

  .lede {{ margin-top: 30px; font-size: 33px; line-height: 1.5;
           color: rgba(255,255,255,.66); max-width: 15ch; }}

  .spacer {{ flex: 1; }}

  /* per-beat progress rail, bottom-left, advancing 1->3 */
  .rail {{ display: flex; gap: 10px; align-items: center; }}
  .rail i {{ width: 40px; height: 5px; border-radius: 99px; background: rgba(255,255,255,.22); }}
  .rail i.on {{ background: #fff; }}
  .foot {{ display: flex; align-items: center; justify-content: space-between; }}
  .foot .swipe {{ font-size: 24px; color: rgba(255,255,255,.4); }}

  /* solution dial motif */
  .dial-wrap {{ margin-top: 40px; display: flex; align-items: center; gap: 26px; }}
  .dnum {{ font-family: Montserrat, sans-serif; font-weight: 800; font-size: 62px; }}
  .dnum span {{ font-size: 30px; color: rgba(255,255,255,.5); }}
  .dcap {{ font-size: 22px; letter-spacing: 3px; text-transform: uppercase;
           color: rgba(255,255,255,.5); }}

  /* CTA (slide 3) */
  .cta {{ margin-top: 34px; display: inline-flex; align-items: center; gap: 14px;
          align-self: flex-start; background: #fff; color: #0A0A0A;
          font-weight: 700; font-size: 28px; padding: 20px 34px; border-radius: 999px; }}
  .bib {{ margin-top: 22px; font-size: 25px; color: rgba(255,255,255,.55); }}
"""


def _hand_underline(color="rgba(255,255,255,.85)") -> str:
    """A wobbly hand-drawn underline stroke."""
    return (
        f'<svg width="360" height="26" viewBox="0 0 360 26" fill="none" '
        f'style="display:block;margin-top:2px">'
        f'<path d="M6 16 C 70 6, 140 22, 210 12 S 320 8, 354 16" '
        f'stroke="{color}" stroke-width="6" stroke-linecap="round"/></svg>'
    )


def _dial_svg() -> str:
    import math

    r = 78
    circ = 2 * math.pi * r
    track = circ * 0.75
    off = track * (1 - 0.78)
    return f"""
<svg viewBox="0 0 200 200" width="150" height="150">
  <g transform="rotate(-135 100 100)">
    <circle cx="100" cy="100" r="{r}" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="12"
            stroke-linecap="round" stroke-dasharray="{track:.1f} {circ:.1f}"/>
    <circle cx="100" cy="100" r="{r}" fill="none" stroke="{MET}" stroke-width="12"
            stroke-linecap="round" stroke-dasharray="{track:.1f} {circ:.1f}" stroke-dashoffset="{off:.1f}"/>
  </g>
</svg>"""


# The connecting hand-drawn line spans the full canvas: it wanders from the
# problem, through the solution, and arrows into "Coming soon".
CONNECTOR = f"""
<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none">
  <path d="M 210 900 C 520 980, 760 690, 1010 760 S 1500 1020, 1720 720
           S 2260 470, 2560 560 S 2930 660, 3010 470"
        fill="none" stroke="rgba(255,255,255,.22)" stroke-width="3.5"
        stroke-linecap="round" stroke-dasharray="2 16"/>
  <path d="M 2960 452 L 3012 468 L 2984 512" fill="none"
        stroke="rgba(255,255,255,.5)" stroke-width="4"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>"""


def _slide(index: int, eyebrow: str, headline_html: str, lede: str, extra: str = "") -> str:
    rail = "".join(f'<i class="{"on" if k <= index else ""}"></i>' for k in (1, 2, 3))
    swipe = '<span class="swipe">swipe →</span>' if index < 3 else ""
    return f"""
<div class="slide">
  <img class="logo" src="{_logo()}" alt="ResumeMatch">
  <div class="eyebrow"><span class="rule"></span>{eyebrow}</div>
  <h1>{headline_html}</h1>
  <p class="lede">{lede}</p>
  {extra}
  <div class="spacer"></div>
  <div class="foot"><div class="rail">{rail}</div>{swipe}</div>
</div>"""


SLIDE_1 = _slide(
    1,
    "01 · The problem",
    '<span class="plain" style="font-size:96px">You\'re applying</span>'
    '<span style="font-size:150px;line-height:.9">blindly.</span>'
    + _hand_underline(),
    "Your CV vanishes into the void — with no idea if it even fits the job.",
)

SLIDE_2 = _slide(
    2,
    "02 · The fix",
    '<span class="plain" style="font-size:88px">Know your fit,</span>'
    '<span style="font-size:150px;line-height:.9">instantly.</span>'
    + _hand_underline(MET),
    "AI reads your CV and the job post — scores the match, flags the gaps, and tailors your CV.",
    extra=f'<div class="dial-wrap">{_dial_svg()}'
    '<div><div class="dnum">78<span>%</span></div><div class="dcap">match</div></div></div>',
)

SLIDE_3 = _slide(
    3,
    "03 · Almost here",
    '<span style="font-size:190px;line-height:.85">Coming<br>soon.</span>',
    "ResumeMatch — stop guessing, start matching.",
    extra='<div class="cta">Join the waitlist →</div>'
    '<div class="bib">Link in bio · @resumematch</div>',
)


def _page() -> str:
    return f"""<!doctype html><html><head><meta charset="utf-8">{FONTS}
<style>{CSS}</style></head><body>
<div class="canvas">
  <div class="bg">
    <div class="dots"></div>
    <div class="ghost" style="left:120px">?</div>
    <div class="ghost" style="left:1740px">%</div>
    <div class="ghost" style="left:2660px">→</div>
    {CONNECTOR}
  </div>
  <div class="slides">{SLIDE_1}{SLIDE_2}{SLIDE_3}</div>
</div>
</body></html>"""


def render(out_dir: Path = OUT_DIR) -> list[Path]:
    from PIL import Image
    from playwright.sync_api import sync_playwright

    out_dir.mkdir(parents=True, exist_ok=True)
    full = out_dir / "_coming-soon-full.png"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        page.set_content(_page(), wait_until="networkidle")
        page.wait_for_timeout(700)  # let webfonts settle
        page.screenshot(path=str(full))
        browser.close()

    # Slice the 2x canvas (6480x2700) into three 1080x1350 posts.
    img = Image.open(full)
    sw = img.width // 3
    written: list[Path] = []
    for i in range(3):
        crop = img.crop((i * sw, 0, (i + 1) * sw, img.height))
        crop = crop.resize((SLIDE_W, H), Image.LANCZOS)
        path = out_dir / f"coming-soon-{i + 1}.png"
        crop.save(path)
        written.append(path)
    full.unlink(missing_ok=True)
    return written


if __name__ == "__main__":
    for p_ in render():
        print(f"wrote {p_} ({p_.stat().st_size // 1024} KB)")
