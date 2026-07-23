"""Render the Open Graph social-share card.

Deliberately NOT AI-generated: this is a text-heavy branded card, and rendering
it from HTML through headless Chromium gives pixel-perfect type, the real logo
asset, and a result that is reproducible and editable. Same approach as the PDF
report, so the identity stays consistent everywhere.

    python -m backend.og_image        # -> frontend/public/og.png
"""

from __future__ import annotations

import base64
from pathlib import Path

ASSETS = Path(__file__).parent / "assets"
OUT = Path(__file__).parent.parent / "frontend" / "public" / "og.png"

W, H = 1200, 630


def _logo_data_uri() -> str:
    path = ASSETS / "logo-white.png"
    if not path.exists():
        return ""
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode()


def build_html() -> str:
    return f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * {{ box-sizing: border-box; margin: 0; }}
  body {{ width: {W}px; height: {H}px; background: #0A0A0A; color: #fff;
         font-family: Inter, system-ui, sans-serif; overflow: hidden;
         display: flex; flex-direction: column; justify-content: space-between;
         padding: 64px 72px; position: relative; }}

  /* faint dial motif, echoing the score gauge */
  .dial {{ position: absolute; right: -120px; top: 50%; transform: translateY(-50%);
           width: 620px; height: 620px; opacity: .07; }}

  /* align-self stops the flex column stretching (and distorting) the logo */
  .logo {{ height: 38px; width: auto; display: block; align-self: flex-start; }}

  h1 {{ font-family: Montserrat, sans-serif; font-weight: 700; font-size: 76px;
        line-height: 1.04; letter-spacing: -0.03em; max-width: 15ch; }}
  .sub {{ margin-top: 22px; font-size: 25px; line-height: 1.45;
          color: rgba(255,255,255,.62); max-width: 30ch; }}

  .facts {{ display: flex; gap: 12px; }}
  .pill {{ border: 1px solid rgba(255,255,255,.22); border-radius: 999px;
           padding: 10px 20px; font-size: 19px; color: rgba(255,255,255,.9); }}
</style></head><body>

<svg class="dial" viewBox="0 0 200 200">
  <g transform="rotate(-135 100 100)">
    <circle cx="100" cy="100" r="88" fill="none" stroke="#fff" stroke-width="9"
            stroke-linecap="round" stroke-dasharray="414.7 552.9"/>
  </g>
</svg>

<img class="logo" src="{_logo_data_uri()}" alt="ResumeMatch">

<div>
  <h1>Know if your CV fits, before you apply.</h1>
  <p class="sub">AI match score, an evidence-backed gap analysis, and a tailored ATS CV.</p>
</div>

<div class="facts">
  <span class="pill">Match score</span>
  <span class="pill">Evidence-backed gaps</span>
  <span class="pill">Tailored ATS CV</span>
</div>

</body></html>"""


def render(path: Path = OUT) -> Path:
    from playwright.sync_api import sync_playwright

    path.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        page.set_content(build_html(), wait_until="networkidle")
        page.wait_for_timeout(600)  # let webfonts settle before capture
        page.screenshot(path=str(path))
        browser.close()
    return path


if __name__ == "__main__":
    out = render()
    print(f"wrote {out} ({out.stat().st_size // 1024} KB)")
