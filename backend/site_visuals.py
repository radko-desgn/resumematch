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


def _dial_svg(pct: int, size: int = 150) -> str:
    off = TRACK * (1 - pct / 100)
    return f"""
<svg viewBox="0 0 200 200" width="{size}" height="{size}">
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
# Real content rather than placeholder bars, so the panels actually explain the
# product. Rendered twice — side-by-side for wide screens, stacked for mobile,
# where three columns would shrink the type past readability.

TRANSFORM_CSS = """
  .flow { display: flex; align-items: stretch; gap: 20px; }
  .flow.stack { flex-direction: column; align-items: center; gap: 14px; }

  .doc { width: 300px; background: #fff; border: 1px solid rgba(0,0,0,.10);
         border-radius: 14px; padding: 18px 18px 20px;
         box-shadow: 0 24px 50px rgba(0,0,0,.30); }
  .flow.stack .doc { width: 460px; }

  .doc .h { font-family: Montserrat, sans-serif; font-size: 14px; }
  .doc .tag { font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase;
              color: #8A8A90; margin: 3px 0 14px; }

  .who { font-size: 11.5px; font-weight: 600; }
  .who span { display: block; font-weight: 400; color: #8A8A90; font-size: 10px; margin-top: 2px; }
  .rule { height: 1px; background: #EDEDEF; margin: 11px 0; }

  .b { display: flex; gap: 7px; font-size: 10.5px; line-height: 1.45;
       color: #3F3F46; margin-bottom: 8px; }
  .b::before { content: "—"; color: #C9C9CE; }
  mark { background: rgba(10,10,10,.08); color: #0A0A0A; font-weight: 600;
         padding: 0 3px; border-radius: 3px; }

  .req { display: flex; align-items: center; gap: 7px; font-size: 10.5px;
         color: #3F3F46; margin-bottom: 9px; }
  .must { font-size: 8px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
          border: 1px solid rgba(10,10,10,.22); border-radius: 4px; padding: 1px 5px; color: #0A0A0A; }
  .nice { font-size: 8px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
          border: 1px solid #E6E6E8; border-radius: 4px; padding: 1px 5px; color: #8A8A90; }

  .arrow { font-size: 26px; color: rgba(10,10,10,.28); align-self: center; }

  .chips { display: flex; gap: 6px; justify-content: center; margin-top: 4px; }
  .chip { border: 1px solid rgba(10,10,10,.18); background: rgba(10,10,10,.04);
          border-radius: 99px; padding: 3px 9px; font-size: 9px; }
  .chip b { color: #6B6B72; text-transform: uppercase; letter-spacing: .06em; }
  .chip i { font-style: normal; font-family: Montserrat, sans-serif; font-weight: 700; margin-left: 4px; }
  .mini { margin-top: 12px; }
  .mini .row { display: flex; align-items: center; gap: 7px; font-size: 10px;
               color: #3F3F46; margin-bottom: 7px; }
"""

CV_PANEL = """
<div class="doc">
  <div class="h">Your CV</div><div class="tag">what you have</div>
  <div class="who">Jordan Rivera<span>Backend / Platform Engineer</span></div>
  <div class="rule"></div>
  <div class="b"><span><mark>4 years</mark> building and operating <mark>Python</mark> web services at scale.</span></div>
  <div class="b"><span>Shipped a <mark>FastAPI</mark> service handling 3M requests/day.</span></div>
  <div class="b"><span>Migrated reporting to <mark>PostgreSQL</mark>, 4x faster queries.</span></div>
  <div class="b"><span>Automated deploys with GitHub Actions and <mark>Docker</mark>.</span></div>
  <div class="b"><span>Side project: RSS summariser using an open-source LLM.</span></div>
</div>"""

JOB_PANEL = """
<div class="doc">
  <div class="h">Job post</div><div class="tag">what they want</div>
  <div class="who">AI Engineer<span>Applied LLM Platform · Remote</span></div>
  <div class="rule"></div>
  <div class="req"><span class="must">must</span> 3+ years Python</div>
  <div class="req"><span class="must">must</span> Production APIs</div>
  <div class="req"><span class="must">must</span> PostgreSQL</div>
  <div class="req"><span class="must">must</span> Docker &amp; CI/CD</div>
  <div class="req"><span class="nice">nice</span> RAG / embeddings</div>
  <div class="req"><span class="nice">nice</span> Kubernetes</div>
</div>"""


def _match_panel(dial: int) -> str:
    return f"""
<div class="doc" style="display:flex;flex-direction:column;align-items:center;">
  <div style="align-self:flex-start"><div class="h">Your match</div>
    <div class="tag">evidence-backed</div></div>
  {_dial_svg(78, dial)}
  <div class="chips">
    <span class="chip"><b>Must-haves</b><i>4/4</i></span>
    <span class="chip"><b>Overall</b><i>6/8</i></span>
  </div>
  <div class="mini" style="align-self:stretch">
    <div class="row">{_pill("met", "met")} 3+ years Python</div>
    <div class="row">{_pill("met", "met")} Production APIs</div>
    <div class="row">{_pill("partial", "partial")} RAG / embeddings</div>
    <div class="row">{_pill("missing", "missing")} Kubernetes</div>
  </div>
</div>"""


# The stacked shot is rendered near the width it will actually be displayed at
# (~350 CSS px inside the section's padding), so the type lands close to 1:1
# instead of being scaled down to illegibility. Everything is sized up to suit.
STACK_CSS = """
  body { padding: 20px 24px 26px; }
  .flow.stack .doc { width: 100%; padding: 20px 20px 22px; }
  .flow.stack { gap: 10px; }
  .doc .h { font-size: 19px; }
  .doc .tag { font-size: 10.5px; margin: 4px 0 16px; }
  .who { font-size: 15px; }
  .who span { font-size: 13px; margin-top: 3px; }
  .rule { margin: 14px 0; }
  .b { font-size: 13.5px; line-height: 1.5; margin-bottom: 11px; gap: 9px; }
  .req { font-size: 13.5px; margin-bottom: 12px; gap: 9px; }
  .must, .nice { font-size: 10px; padding: 2px 6px; }
  .chip { font-size: 11.5px; padding: 4px 11px; }
  .chips { gap: 8px; margin-top: 8px; }
  .mini { margin-top: 16px; }
  .mini .row { font-size: 13px; margin-bottom: 10px; gap: 9px; }
  .mini .row span { font-size: 12px !important; padding: 4px 9px !important; }
  .arrow { font-size: 30px; }
"""


def _transform(stacked: bool) -> str:
    arrow = "↓" if stacked else "→"
    extra = STACK_CSS if stacked else ""
    return f"""<!doctype html><html><head><meta charset="utf-8">{FONTS}
<style>{BASE_CSS}{TRANSFORM_CSS}{extra}</style></head><body>
<div class="flow{' stack' if stacked else ''}">
  {CV_PANEL}
  <div class="arrow">{arrow}</div>
  {JOB_PANEL}
  <div class="arrow">{arrow}</div>
  {_match_panel(190 if stacked else 150)}
</div>
</body></html>"""


TRANSFORM_SHOT = _transform(stacked=False)
TRANSFORM_STACKED = _transform(stacked=True)


# width, height. The height is only a floor: shots are taken full_page, so a
# deliberately short viewport lets the PNG crop tight to the content instead of
# baking in trailing whitespace.
VISUALS = {
    "result-preview.png": (RESULT_SHOT, 1020, 200),
    "transform.png": (TRANSFORM_SHOT, 1080, 200),
    "transform-stacked.png": (TRANSFORM_STACKED, 398, 200),
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
