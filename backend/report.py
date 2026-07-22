"""Branded PDF report generation.

Renders the Analysis into an HTML template that mirrors the app's monochrome
editorial design (Montserrat/Inter, black & white, accent only on the gauge),
then prints it to PDF with Chromium via Playwright.
"""

from __future__ import annotations

import base64
import html
import math
from datetime import date
from functools import lru_cache
from pathlib import Path
from typing import Any

_R = 90
_ARC = math.pi * _R
_ASSETS = Path(__file__).parent / "assets"


@lru_cache(maxsize=4)
def _asset_data_uri(name: str) -> str:
    """Inline an image so the PDF renderer needs no file access."""
    path = _ASSETS / name
    if not path.exists():
        return ""
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode()


def _verdict_color(verdict: str) -> str:
    v = (verdict or "").lower()
    if "strong" in v:
        return "#12935C"
    if "weak" in v:
        return "#D64545"
    return "#B5860B"


def _gauge_svg(score: int) -> str:
    score = max(0, min(100, int(score)))
    off = _ARC * (1 - score / 100)
    return f"""
<svg viewBox="0 0 220 132" width="200" height="120">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#10B981"/><stop offset="100%" stop-color="#0EA5B7"/>
  </linearGradient></defs>
  <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="#E6E6E8" stroke-width="16" stroke-linecap="round"/>
  <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="url(#g)" stroke-width="16"
        stroke-linecap="round" stroke-dasharray="{_ARC:.2f}" stroke-dashoffset="{off:.2f}"/>
  <text x="110" y="104" text-anchor="middle" font-family="Montserrat, sans-serif"
        font-size="44" font-weight="700" fill="#0A0A0A">{score}</text>
</svg>"""


def _li(items: list[str], color: str) -> str:
    return "".join(
        f'<li><span class="dot" style="background:{color}"></span>{html.escape(str(i))}</li>' for i in items
    ) or '<li class="muted">None listed.</li>'


def build_html(analysis: dict[str, Any]) -> str:
    score = analysis["score"]
    rewrite = analysis.get("rewrite", {})
    reqs = score.get("requirements", [])
    must = [r for r in reqs if r.get("type") == "must-have"]
    must_met = [r for r in must if r.get("status") == "met"]
    met = [r for r in reqs if r.get("status") == "met"]

    gaps = list(score.get("critical_gaps", [])) + [
        f"{r['requirement']} ({str(r.get('status','')).replace('-', ' ')})"
        for r in reqs if r.get("status") != "met"
    ]
    recs = list(score.get("quick_wins", []))
    changed = [b for b in rewrite.get("rewritten_bullets", []) if b.get("changed")]

    rewrites_html = "".join(
        f"""<div class="rw">
              <div class="rw-before">− {html.escape(b['original'])}</div>
              <div class="rw-after">+ {html.escape(b['rewritten'])}</div>
            </div>"""
        for b in changed
    ) or '<p class="muted">No rewrites suggested.</p>'

    req_rows = "".join(
        f"""<tr>
              <td>{html.escape(r['requirement'])}</td>
              <td class="nowrap">{html.escape(r.get('type',''))}</td>
              <td class="nowrap" style="color:{'#12935C' if r.get('status')=='met' else '#B5860B' if r.get('status')=='partially-met' else '#D64545'}">
                {html.escape(str(r.get('status','')).replace('-', ' '))}</td>
            </tr>"""
        for r in reqs
    )

    return f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  * {{ box-sizing: border-box; }}
  body {{ font-family: Inter, system-ui, sans-serif; color:#0A0A0A; margin:0; font-size:11px; line-height:1.55; }}
  h1,h2,h3 {{ font-family: Montserrat, sans-serif; letter-spacing:-0.02em; margin:0; }}
  .band {{ background:#0A0A0A; color:#fff; padding:22px 34px; display:flex;
           justify-content:space-between; align-items:center; }}
  .logo {{ height:22px; width:auto; display:block; }}
  .band .meta {{ font-size:10px; color:rgba(255,255,255,.55); }}
  .wrap {{ padding: 26px 34px 0; }}
  .hero {{ display:flex; gap:26px; align-items:center; border:1px solid #E6E6E8;
           border-radius:14px; padding:18px 22px; }}
  .verdict {{ font-family:Montserrat; font-weight:700; font-size:17px; }}
  .summary {{ color:#6B6B72; margin-top:5px; }}
  .chips {{ margin-top:9px; }}
  .chip {{ display:inline-block; border:1px solid #E6E6E8; border-radius:999px;
           padding:3px 9px; font-size:9.5px; margin-right:6px; }}
  h2.sec {{ font-size:13px; margin:22px 0 9px; }}
  .cols {{ display:flex; gap:14px; }}
  .card {{ border:1px solid #E6E6E8; border-radius:12px; padding:13px 15px; flex:1; }}
  .card h3 {{ font-size:11.5px; margin-bottom:7px; }}
  ul {{ list-style:none; padding:0; margin:0; }}
  li {{ position:relative; padding-left:13px; margin-bottom:5px; }}
  .dot {{ position:absolute; left:0; top:6px; width:5px; height:5px; border-radius:50%; }}
  .muted {{ color:#6B6B72; }}
  table {{ width:100%; border-collapse:collapse; font-size:10px; }}
  th, td {{ text-align:left; padding:6px 8px; border-bottom:1px solid #EFEFF1; vertical-align:top; }}
  th {{ color:#6B6B72; font-weight:600; font-size:9px; text-transform:uppercase; letter-spacing:.08em; }}
  .nowrap {{ white-space:nowrap; }}
  .rw {{ border:1px solid #E6E6E8; border-radius:10px; overflow:hidden; margin-bottom:7px; font-family:ui-monospace,monospace; font-size:9.5px; }}
  .rw-before {{ background:#FDECEC; color:#8a1f1f; padding:6px 10px; }}
  .rw-after {{ background:#E9F8F1; color:#0a6b4b; padding:6px 10px; }}
  .foot {{ margin-top:26px; padding:14px 34px; border-top:1px solid #E6E6E8;
           color:#6B6B72; font-size:9px; display:flex; justify-content:space-between; }}
</style></head><body>

<div class="band">
  <img class="logo" src="{_asset_data_uri('logo-white.png')}" alt="ResumeMatch">
  <div class="meta">Match report · {date.today().isoformat()}</div>
</div>

<div class="wrap">
  <div class="hero">
    {_gauge_svg(score.get('overall_fit_score', 0))}
    <div>
      <div class="verdict" style="color:{_verdict_color(score.get('verdict',''))}">{html.escape(score.get('verdict',''))}</div>
      <div class="summary">{html.escape(score.get('summary',''))}</div>
      <div class="chips">
        <span class="chip">Must-haves {len(must_met)}/{len(must)}</span>
        <span class="chip">Requirements {len(met)}/{len(reqs)}</span>
      </div>
    </div>
  </div>

  <h2 class="sec">What's strong &amp; what's missing</h2>
  <div class="cols">
    <div class="card"><h3>Strengths</h3><ul>{_li(score.get('key_strengths', []), '#12935C')}</ul></div>
    <div class="card"><h3>Gaps to address</h3><ul>{_li(gaps, '#D64545')}</ul></div>
  </div>

  <h2 class="sec">Recommendations</h2>
  <div class="card"><ul>{_li(recs, '#0A0A0A')}</ul></div>

  <h2 class="sec">Suggested CV rewrites</h2>
  {rewrites_html}

  <h2 class="sec">Requirement coverage</h2>
  <table>
    <tr><th>Requirement</th><th>Type</th><th>Status</th></tr>
    {req_rows}
  </table>
</div>

<div class="foot">
  <span>Generated by ResumeMatch — evidence-based, nothing fabricated.</span>
  <span>resumematch</span>
</div>
</body></html>"""


def render_pdf(analysis: dict[str, Any]) -> bytes:
    """Print the report HTML to PDF with Chromium (sync API — call from a worker thread)."""
    from playwright.sync_api import sync_playwright

    html_doc = build_html(analysis)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html_doc, wait_until="networkidle")
        pdf = page.pdf(format="A4", print_background=True,
                       margin={"top": "0mm", "bottom": "0mm", "left": "0mm", "right": "0mm"})
        browser.close()
    return pdf
