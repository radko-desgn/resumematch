"""Render static visuals used on the landing page.

Same Playwright/Chromium pipeline as the PDF report and social cards: HTML is
the design tool, Chromium is the renderer. These are pre-rendered rather than
built as live components because they're illustrative product shots — they must
look identical whether or not the backend is running, and they carry no
interactive behaviour.

    python -m backend.site_visuals    # -> frontend/public/visuals/*.png
"""

from __future__ import annotations

import math
from pathlib import Path

OUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "visuals"

R = 88
CIRC = 2 * math.pi * R
TRACK = CIRC * 0.75

FONTS = (
    '<link href="https://fonts.googleapis.com/css2?'
    'family=Montserrat:wght@600;700&family=Inter:wght@400;500;600&'
    'family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">'
)

BASE_CSS = """
  * { box-sizing: border-box; margin: 0; }
  body { background: transparent; font-family: Inter, system-ui, sans-serif;
         color: #0A0A0A; padding: 40px; }

  /* app window chrome */
  .win { border-radius: 18px; overflow: hidden; background: #fff;
         border: 1px solid rgba(0,0,0,.10);
         box-shadow: 0 40px 90px rgba(0,0,0,.45), 0 8px 20px rgba(0,0,0,.18); }
  .bar { display: flex; align-items: center; gap: 8px;
         padding: 13px 18px; background: #F4F4F5; border-bottom: 1px solid #E6E6E8; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .r { background: #FF5F57 } .y { background: #FEBC2E } .g { background: #28C840 }
  .addr { margin-left: 12px; font-size: 12px; color: #8A8A90;
          font-family: 'JetBrains Mono', monospace; }
  .body { padding: 26px 28px 28px; }

  h3 { font-family: Montserrat, sans-serif; font-size: 15px; margin-bottom: 12px; }
  .card { border: 1px solid #E6E6E8; border-radius: 13px; padding: 16px 18px; }
  .muted { color: #6B6B72; }
"""


def _dial_svg(pct: int) -> str:
    off = TRACK * (1 - pct / 100)
    return f"""
<svg viewBox="0 0 200 200" width="150" height="150">
  <g transform="rotate(-135 100 100)">
    <circle cx="100" cy="100" r="{R}" fill="none" stroke="#E6E6E8" stroke-width="10"
            stroke-linecap="round" stroke-dasharray="{TRACK:.1f} {CIRC:.1f}"/>
    <circle cx="100" cy="100" r="{R}" fill="none" stroke="#0A0A0A" stroke-width="10"
            stroke-linecap="round" stroke-dasharray="{TRACK:.1f} {CIRC:.1f}"
            stroke-dashoffset="{off:.1f}"/>
  </g>
  <text x="100" y="108" text-anchor="middle" font-family="Montserrat, sans-serif"
        font-size="52" font-weight="700" letter-spacing="-2" fill="#0A0A0A">{pct}<tspan
        font-size="25" fill="#A6A6AC">%</tspan></text>
  <text x="100" y="133" text-anchor="middle" font-family="Inter, sans-serif"
        font-size="9" font-weight="600" letter-spacing="2.2" fill="#6B6B72">MATCH</text>
</svg>"""


def _pill(text: str, tone: str) -> str:
    colors = {"met": "#12935C", "partial": "#B5860B", "missing": "#D64545"}
    bgs = {"met": "rgba(18,147,92,.10)", "partial": "rgba(181,134,11,.10)", "missing": "rgba(214,69,69,.10)"}
    return (
        f'<span style="font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;'
        f'color:{colors[tone]};background:{bgs[tone]}">{text}</span>'
    )


# ---------------------------------------------------------------- result shot
RESULT_SHOT = f"""<!doctype html><html><head><meta charset="utf-8">{FONTS}
<style>{BASE_CSS}
  .row {{ display: flex; gap: 26px; align-items: center; }}
  .verdict {{ font-family: Montserrat, sans-serif; font-size: 21px; }}
  .chips {{ margin-top: 11px; display: flex; gap: 8px; }}
  .chip {{ border: 1px solid rgba(10,10,10,.20); background: rgba(10,10,10,.04);
           border-radius: 99px; padding: 4px 11px; font-size: 10px; }}
  .chip b {{ text-transform: uppercase; letter-spacing: .07em; color: #6B6B72; }}
  .chip i {{ font-style: normal; font-family: Montserrat, sans-serif;
             font-weight: 700; margin-left: 5px; }}
  .cols {{ display: flex; gap: 14px; margin-top: 18px; }}
  .req {{ display: flex; gap: 9px; align-items: flex-start; margin-bottom: 11px; font-size: 12px; }}
  .quote {{ font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #6B6B72;
            border-left: 2px solid #E6E6E8; padding-left: 8px; margin-top: 4px; }}
</style></head><body>
<div class="win" style="width: 940px;">
  <div class="bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
    <span class="addr">resumematch — your match</span></div>
  <div class="body">
    <div class="card row">
      {_dial_svg(78)}
      <div>
        <div class="verdict">Strong match</div>
        <div class="muted" style="font-size:12.5px;margin-top:6px;max-width:46ch;line-height:1.5">
          Four years of production Python and clear API ownership clear the must-haves.
          The gap is depth on production LLM work.</div>
        <div class="chips">
          <span class="chip"><b>Must-haves</b><i>4/4</i></span>
          <span class="chip"><b>Requirements</b><i>6/8</i></span>
        </div>
      </div>
    </div>

    <div class="cols">
      <div class="card" style="flex:1">
        <h3>Requirement coverage</h3>
        <div class="req">{_pill("met", "met")}<div>3+ years Python
          <div class="quote">"4 years building and operating Python web services at scale."</div></div></div>
        <div class="req">{_pill("met", "met")}<div>Production APIs
          <div class="quote">"FastAPI service handling 3M requests/day."</div></div></div>
        <div class="req">{_pill("partial", "partial")}<div>LLM APIs / embeddings
          <div class="quote">"Side project using an open-source LLM."</div></div></div>
        <div class="req" style="margin-bottom:0">{_pill("missing", "missing")}<div>Kubernetes
          <div class="quote muted">no supporting evidence in CV</div></div></div>
      </div>

      <div class="card" style="flex:1">
        <h3>Suggested rewrite</h3>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10.5px;border:1px solid #E6E6E8;
                    border-radius:9px;overflow:hidden">
          <div style="background:#FDECEC;color:#8a1f1f;padding:8px 10px">
            − Introduced automated deployment with GitHub Actions and Docker.</div>
          <div style="background:#E9F8F1;color:#0a6b4b;padding:8px 10px">
            + Built <b>CI/CD</b> with GitHub Actions and Docker, moving releases weekly → on-demand.</div>
        </div>
        <div class="muted" style="font-size:11px;margin-top:10px;line-height:1.5">
          Mirrors the job's language. Nothing added that the original bullet didn't already earn.</div>
      </div>
    </div>
  </div>
</div>
</body></html>"""


# ------------------------------------------------------------ transformation
TRANSFORM_SHOT = f"""<!doctype html><html><head><meta charset="utf-8">{FONTS}
<style>{BASE_CSS}
  .flow {{ display: flex; align-items: center; gap: 22px; }}
  .doc {{ width: 250px; height: 300px; background: #fff; border: 1px solid rgba(0,0,0,.10);
          border-radius: 13px; padding: 18px; box-shadow: 0 24px 50px rgba(0,0,0,.35); }}
  .doc .h {{ font-family: Montserrat, sans-serif; font-size: 12px; margin-bottom: 4px; }}
  .doc .tag {{ font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase;
               color: #8A8A90; margin-bottom: 12px; }}
  .line {{ height: 6px; border-radius: 99px; background: #ECECEE; margin-bottom: 8px; }}
  .line.dark {{ background: #0A0A0A; }}
  .line.mid {{ background: #C9C9CE; }}
  .arrow {{ font-size: 30px; color: rgba(10,10,10,.28); }}
</style></head><body>
<div class="flow">
  <div class="doc">
    <div class="h">Your CV</div><div class="tag">before</div>
    <div class="line" style="width:82%"></div><div class="line" style="width:64%"></div>
    <div class="line mid" style="width:90%"></div><div class="line" style="width:73%"></div>
    <div class="line" style="width:86%"></div><div class="line mid" style="width:58%"></div>
    <div class="line" style="width:79%"></div><div class="line" style="width:67%"></div>
  </div>

  <div class="arrow">→</div>

  <div class="doc" style="width:250px">
    <div class="h">Job post</div><div class="tag">requirements</div>
    <div class="line dark" style="width:70%"></div><div class="line" style="width:88%"></div>
    <div class="line dark" style="width:62%"></div><div class="line" style="width:80%"></div>
    <div class="line dark" style="width:74%"></div><div class="line" style="width:66%"></div>
  </div>

  <div class="arrow">→</div>

  <div class="doc" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">
    {_dial_svg(78)}
    <div class="tag" style="margin:0">your match</div>
  </div>
</div>
</body></html>"""


VISUALS = {
    "result-preview.png": (RESULT_SHOT, 1020, 700),
    "transform.png": (TRANSFORM_SHOT, 1000, 400),
}


def render(out_dir: Path = OUT_DIR) -> list[Path]:
    from playwright.sync_api import sync_playwright

    out_dir.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, (html, w, h) in VISUALS.items():
            # 2x for retina; omit_background keeps the PNG transparent so the
            # shot sits on whatever section background it's placed over.
            page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
            page.set_content(html, wait_until="networkidle")
            page.wait_for_timeout(600)
            path = out_dir / name
            page.screenshot(path=str(path), omit_background=True, full_page=True)
            page.close()
            written.append(path)
        browser.close()
    return written


if __name__ == "__main__":
    for p_ in render():
        print(f"wrote {p_} ({p_.stat().st_size // 1024} KB)")
