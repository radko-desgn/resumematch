"""Launch carousel — LOUD "RELEASED" + free-scan push (4 slides).

Deliberately NOT the coming-soon template: green launch bookends (cover + CTA),
a left-aligned poster layout, "RELEASED" as the hero word, and a hard push on the
free scan. Custom-rendered with the same brand fonts, logo, and colours.

    python -m backend.post_release
"""

from __future__ import annotations

from pathlib import Path

from backend.coming_soon import FONTS, _logo
from backend.post_coming_soon_v2 import RESULT_CARD

W, H = 1080, 1350
GREEN = "#12935C"
OUT = Path(__file__).parent.parent / "docs" / "social" / "instagram" / "release"

CSS = f"""
* {{ box-sizing:border-box; margin:0; }}
body {{ width:{W}px; height:{H}px; overflow:hidden; position:relative;
        font-family:Inter,system-ui,sans-serif; }}
.wrap {{ position:absolute; inset:0; display:flex; flex-direction:column;
         padding:88px 84px 92px; }}
.logo {{ height:44px; width:auto; }}
.mid {{ flex:1; display:flex; flex-direction:column; justify-content:center;
        align-items:flex-start; text-align:left; }}
.eyebrow {{ font-size:24px; font-weight:700; letter-spacing:5px; text-transform:uppercase; }}
h1 {{ font-family:Montserrat,sans-serif; font-weight:800; letter-spacing:-.02em; line-height:1.02; }}
.sub {{ font-size:33px; line-height:1.45; max-width:24ch; }}
.chip {{ border-radius:14px; padding:.02em .18em; box-decoration-break:clone;
         -webkit-box-decoration-break:clone; }}
.pill {{ display:inline-block; font-family:Montserrat,sans-serif; font-weight:800;
         border-radius:999px; }}
"""


def doc(bg: str, inner: str) -> str:
    return (f'<!doctype html><html><head><meta charset="utf-8">{FONTS}'
            f'<style>{CSS}</style></head><body style="background:{bg}">'
            f'{inner}</body></html>')


# 1 — GREEN cover, giant RELEASED
S1 = doc(GREEN, f"""
<div class="wrap" style="color:#0A0A0A">
  <img class="logo" src="{_logo()}">
  <div class="mid">
    <div class="eyebrow" style="color:rgba(0,0,0,.55)">The wait is over</div>
    <h1 style="font-size:90px;margin-top:22px">It's</h1>
    <h1 style="font-size:150px;line-height:.95;margin-top:4px">RELEASED.</h1>
    <div class="sub" style="color:rgba(0,0,0,.72);margin-top:34px;font-weight:600">
      The CV-to-job scanner is live.</div>
  </div>
</div>""")

# 2 — FREE scan push (black)
S2 = doc("#0A0A0A", f"""
<div class="wrap" style="color:#fff">
  <img class="logo" src="{_logo()}">
  <div class="mid">
    <div class="eyebrow" style="color:rgba(255,255,255,.5)">No account. No catch.</div>
    <h1 style="font-size:100px;margin-top:22px">Your first<br>scan is
      <span class="chip" style="background:{GREEN};color:#fff">free</span>.</h1>
    <div class="sub" style="color:rgba(255,255,255,.75);margin-top:34px">
      Paste your CV and a job post. See your fit in ~15 seconds.</div>
  </div>
</div>""")

# 3 — proof (black), reuse the labelled demo result
S3 = doc("#0A0A0A", f"""
<div class="wrap" style="color:#fff">
  <img class="logo" src="{_logo()}">
  <div class="mid">
    <div class="eyebrow" style="color:rgba(255,255,255,.5)">What you get</div>
    <h1 style="font-size:64px;margin-top:16px">Met, partial,
      <span class="chip" style="background:#fff;color:#0A0A0A">missing</span>.</h1>
    {RESULT_CARD}
  </div>
</div>""")

# 4 — GREEN CTA bookend, free scan
S4 = doc(GREEN, f"""
<div class="wrap" style="color:#0A0A0A">
  <img class="logo" src="{_logo()}">
  <div class="mid">
    <div class="eyebrow" style="color:rgba(0,0,0,.55)">It's live &middot; free to try</div>
    <h1 style="font-size:120px;margin-top:20px">Scan your<br>CV free.</h1>
    <div class="pill" style="background:#0A0A0A;color:#fff;font-size:40px;padding:24px 46px;margin-top:42px">
      resumematch.pro &rarr;</div>
    <div class="sub" style="color:rgba(0,0,0,.6);margin-top:26px;font-size:28px">@resumematch.pro</div>
  </div>
</div>""")

SLIDES = [S1, S2, S3, S4]


def render() -> None:
    from PIL import Image
    from playwright.sync_api import sync_playwright

    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        for i, html in enumerate(SLIDES, start=1):
            page.set_content(html, wait_until="networkidle")
            page.wait_for_timeout(400)
            tmp = OUT / f"_release-{i:02d}.png"
            path = OUT / f"release-{i:02d}.png"
            page.screenshot(path=str(tmp))
            Image.open(tmp).resize((W, H), Image.LANCZOS).save(path)
            tmp.unlink(missing_ok=True)
        browser.close()
    print(f"[release] {len(SLIDES)} slides -> {OUT}")


if __name__ == "__main__":
    render()
