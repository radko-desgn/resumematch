"""Pure HTML render helpers for the ResumeMatch results.

Each function takes part of an `Analysis` and returns an HTML string (no Streamlit
calls inside), so they're trivially testable. All user-derived text is escaped.
Styling classes come from resumematch.ui.theme.
"""

from __future__ import annotations

import html
import math
from typing import Optional, Sequence

from resumematch.schemas import Requirement, RewrittenBullet

# Semicircle geometry for the gauge arc.
_R = 90
_ARC_LEN = math.pi * _R  # length of a semicircle of radius _R


def _verdict_color(verdict: str) -> str:
    v = (verdict or "").lower()
    if "strong" in v:
        return "var(--met)"
    if "weak" in v:
        return "var(--missing)"
    return "var(--partial)"


def score_gauge(
    score: int,
    verdict: Optional[str] = None,
    summary: Optional[str] = None,
) -> str:
    """Semicircular arc gauge with a hero number (the primary, accessible read)."""
    score = max(0, min(100, int(score)))
    offset = _ARC_LEN * (1 - score / 100)
    verdict = verdict or ""
    summary = summary or ""
    return f"""
<div class="rm-gauge">
  <div style="position:relative;width:220px;height:132px;flex:0 0 auto;">
    <svg width="220" height="132" viewBox="0 0 220 132" role="img"
         aria-label="Fit score {score} out of 100">
      <defs>
        <linearGradient id="rmGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--match-a)"/>
          <stop offset="100%" stop-color="var(--match-b)"/>
        </linearGradient>
      </defs>
      <path d="M 20 110 A {_R} {_R} 0 0 1 200 110" fill="none"
            stroke="var(--line)" stroke-width="16" stroke-linecap="round"/>
      <path class="rm-value-arc" d="M 20 110 A {_R} {_R} 0 0 1 200 110" fill="none"
            stroke="url(#rmGrad)" stroke-width="16" stroke-linecap="round"
            stroke-dasharray="{_ARC_LEN:.2f}" stroke-dashoffset="{offset:.2f}"
            style="--rm-arc-len:{_ARC_LEN:.2f};--rm-arc-off:{offset:.2f};"/>
    </svg>
    <div style="position:absolute;left:0;right:0;bottom:8px;text-align:center;">
      <div class="rm-score">{score}</div>
      <div style="font-family:var(--font-mono);font-size:11px;color:var(--muted-light);">/ 100 fit</div>
    </div>
  </div>
  <div>
    <div class="rm-verdict" style="color:{_verdict_color(verdict)}">{html.escape(verdict)}</div>
    <div class="rm-summary">{html.escape(summary)}</div>
  </div>
</div>
"""


def gap_analysis(requirements: Sequence[Requirement]) -> str:
    """One card per requirement: type chip, status pill, text, evidence quote."""
    rows = []
    for r in requirements:
        chip_cls = "must" if r.type == "must-have" else ""
        status_key = {"met": "met", "partially-met": "partial", "missing": "missing"}.get(
            r.status, "partial"
        )
        status_symbol = {"met": "✓", "partial": "≈", "missing": "✗"}[status_key]
        status_word = r.status.replace("-", " ")
        if r.evidence:
            evidence = f'<div class="rm-evidence">“{html.escape(r.evidence)}”</div>'
        else:
            evidence = '<div class="rm-evidence none">no supporting evidence in resume</div>'
        rows.append(
            f"""
<div class="rm-req">
  <div class="rm-req-top">
    <span class="rm-pill {status_key}">{status_symbol} {html.escape(status_word)}</span>
    <span class="rm-chip {chip_cls}">{html.escape(r.type)}</span>
    <span class="rm-req-text">{html.escape(r.requirement)}</span>
  </div>
  {evidence}
</div>"""
        )
    return f'<div class="rm-reqs">{"".join(rows)}</div>'


def diff_rewrites(
    bullets: Sequence[RewrittenBullet],
    tailored_summary: Optional[str] = None,
) -> str:
    """The signature: bullet rewrites rendered as a git diff in an app-window card."""
    ln = 1
    rows = []
    for b in bullets:
        if b.changed:
            rows.append(_diff_row(ln, "del", "-", b.original))
            rows.append(_diff_row(ln + 1, "add", "+", b.rewritten))
            ln += 2
        else:
            rows.append(_diff_row(ln, "ctx", " ", b.original))
            ln += 1
    summary_html = (
        f'<div class="rm-tailored">{html.escape(tailored_summary)}</div>'
        if tailored_summary
        else ""
    )
    return f"""
{summary_html}
<div class="rm-window light">
  <div class="rm-titlebar">
    <span class="rm-dot r"></span><span class="rm-dot y"></span><span class="rm-dot g"></span>
    <span class="rm-file">resume.diff</span>
  </div>
  <div class="rm-diff">{"".join(rows)}</div>
</div>
"""


def _diff_row(line_no: int, kind: str, sign: str, text: str) -> str:
    return (
        f'<div class="rm-row {kind}">'
        f'<div class="rm-ln">{line_no}</div>'
        f'<div class="rm-code"><span class="rm-sign">{sign}</span> {html.escape(text)}</div>'
        f"</div>"
    )
