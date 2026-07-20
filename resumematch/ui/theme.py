"""ResumeMatch theme — the docs/DESIGN.md tokens as injectable CSS.

`inject()` writes a <style> block into a Streamlit page: Google fonts, CSS custom
properties for every design token, the dark-hero background + glows, the white
results surface, and the reusable component classes (window chrome, chips, status
pills, git-diff, gauge). Accessibility floor: visible :focus-visible outlines and
prefers-reduced-motion handling are built in.
"""

from __future__ import annotations

import streamlit as st

CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --ink: #0B0D12;
  --panel-dark: #141821;
  --paper: #FFFFFF;
  --paper-alt: #F5F6F8;
  --text-dark: #E6E9EF;
  --muted-dark: #8B93A7;
  --text-light: #0B0D12;
  --muted-light: #5A6272;
  --match-a: #3FE0A5;
  --match-b: #35C1F1;
  --violet: #7C6BF5;
  --met: #3FE0A5;
  --partial: #F5B944;
  --missing: #F06B6B;
  --line: #E4E7EC;
  --radius: 16px;
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

/* Base + Streamlit chrome */
html, body, [class*="css"] { font-family: var(--font-body); }
#MainMenu, header[data-testid="stHeader"], footer { display: none; }
.block-container { padding: 44px 24px 72px !important; max-width: 1120px !important;
  margin: 0 auto !important; }
.stApp { background: var(--ink); color: var(--text-dark); }

/* soft gradient glows anchored to the top of the page (the hero region) */
.stApp::before, .stApp::after {
  content: ""; position: fixed; top: -200px; border-radius: 50%;
  filter: blur(100px); opacity: 0.45; z-index: 0; pointer-events: none;
}
.stApp::before { width: 560px; height: 560px; left: -140px;
  background: radial-gradient(circle, var(--match-a), transparent 65%); }
.stApp::after  { width: 480px; height: 480px; right: -140px;
  background: radial-gradient(circle, var(--violet), transparent 65%); }
.block-container { position: relative; z-index: 1; }

/* ---- Hero (dark, on the app background) ---- */
.rm-hero { color: var(--text-dark); margin-bottom: 26px; }

/* ---- Results: a white rounded panel (one HTML block contains its children) ---- */
.rm-results { background: var(--paper); color: var(--text-light);
  border-radius: 22px; padding: 34px clamp(20px, 3vw, 40px); margin-top: 30px;
  box-shadow: 0 24px 60px rgba(0,0,0,.35);
  animation: rmRise .55s cubic-bezier(.2,.7,.2,1) both; }

/* ---- Motion ---- */
@keyframes rmRise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
@keyframes rmFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes rmDrift { from { transform: translate(0,0); } to { transform: translate(40px, 26px); } }
.stApp::before { animation: rmDrift 14s ease-in-out infinite alternate; }
.stApp::after  { animation: rmDrift 18s ease-in-out infinite alternate-reverse; }
.rm-req { animation: rmRise .5s cubic-bezier(.2,.7,.2,1) both; }
.rm-reqs .rm-req:nth-child(2) { animation-delay: .05s; }
.rm-reqs .rm-req:nth-child(3) { animation-delay: .10s; }
.rm-reqs .rm-req:nth-child(4) { animation-delay: .15s; }
.rm-reqs .rm-req:nth-child(n+5) { animation-delay: .20s; }
.rm-window { animation: rmFade .6s ease .1s both; }
.rm-gauge .rm-value-arc { animation: rmArc 1.1s cubic-bezier(.2,.7,.2,1) both; }
@keyframes rmArc { from { stroke-dashoffset: var(--rm-arc-len); } to { stroke-dashoffset: var(--rm-arc-off); } }

/* ---- Hero typography ---- */
.rm-eyebrow { font-family: var(--font-mono); font-size: 13px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--match-b); margin-bottom: 14px; }
.rm-h1 { font-family: var(--font-display); font-weight: 700; line-height: 1.02;
  letter-spacing: -0.02em; font-size: clamp(38px, 6vw, 68px); margin: 0 0 14px; }
.rm-sub { color: var(--muted-dark); font-size: clamp(15px, 1.4vw, 18px);
  max-width: 46ch; margin: 0 0 8px; }

/* ---- Window chrome (shared) ---- */
.rm-window { border: 1px solid rgba(255,255,255,.08); border-radius: var(--radius);
  background: var(--panel-dark); overflow: hidden; }
.rm-window.light { border-color: var(--line); background: var(--paper); }
.rm-titlebar { display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  border-bottom: 1px solid var(--line); background: var(--paper-alt); }
.rm-dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
.rm-dot.r { background: #FF5F57; } .rm-dot.y { background: #FEBC2E; } .rm-dot.g { background: #28C840; }
.rm-titlebar .rm-file { font-family: var(--font-mono); font-size: 12px;
  color: var(--muted-light); margin-left: 8px; }

/* ---- Results headings ---- */
.rm-h2 { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.01em;
  font-size: clamp(22px, 2.6vw, 30px); margin: 0 0 6px; color: var(--text-light); }
.rm-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--muted-light); margin: 0 0 18px; }

/* ---- Score gauge ---- */
.rm-gauge { display: flex; align-items: center; gap: 28px; flex-wrap: wrap;
  padding: 22px 24px; border: 1px solid var(--line); border-radius: var(--radius);
  background: var(--paper); }
.rm-gauge .rm-score { font-family: var(--font-mono); font-weight: 700;
  font-size: 44px; line-height: 1; color: var(--text-light); }
.rm-gauge .rm-verdict { font-family: var(--font-display); font-weight: 600;
  font-size: 18px; margin-top: 4px; }
.rm-gauge .rm-summary { color: var(--muted-light); font-size: 14px; max-width: 52ch; margin-top: 8px; }

/* ---- Gap analysis ---- */
.rm-reqs { display: flex; flex-direction: column; gap: 10px; }
.rm-req { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px;
  background: var(--paper); }
.rm-req-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.rm-req-text { font-weight: 600; color: var(--text-light); }
.rm-chip { font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em;
  padding: 3px 9px; border-radius: 999px; border: 1px solid var(--line);
  color: var(--muted-light); background: var(--paper-alt); }
.rm-chip.must { color: #253; border-color: rgba(63,224,165,.4); background: rgba(63,224,165,.08); }
.rm-pill { font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  padding: 3px 9px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; }
.rm-pill.met { color: #0a6b4b; background: rgba(63,224,165,.16); }
.rm-pill.partial { color: #7a5600; background: rgba(245,185,68,.20); }
.rm-pill.missing { color: #8a1f1f; background: rgba(240,107,107,.16); }
.rm-evidence { font-family: var(--font-mono); font-size: 12.5px; color: var(--muted-light);
  margin-top: 8px; padding-left: 12px; border-left: 2px solid var(--line); }
.rm-evidence.none { font-style: italic; opacity: .8; }

/* ---- Git-diff rewrites ---- */
.rm-diff { font-family: var(--font-mono); font-size: 13px; }
.rm-diff .rm-row { display: grid; grid-template-columns: 44px 1fr; }
.rm-diff .rm-ln { text-align: right; padding: 2px 12px 2px 0; color: var(--muted-light);
  user-select: none; border-right: 1px solid var(--line); }
.rm-diff .rm-code { padding: 2px 14px; white-space: pre-wrap; word-break: break-word; }
.rm-diff .del .rm-code { background: rgba(240,107,107,.10); color: #8a1f1f; }
.rm-diff .add .rm-code { background: rgba(63,224,165,.12); color: #0a6b4b; }
.rm-diff .ctx .rm-code { color: var(--muted-light); }
.rm-diff .rm-sign { opacity: .7; }
.rm-tailored { color: var(--muted-light); font-size: 14px; margin: 4px 0 16px; max-width: 60ch; }

/* ---- Streamlit widgets on dark hero ---- */
.rm-hero textarea { background: rgba(255,255,255,.04) !important; color: var(--text-dark) !important;
  border: 1px solid rgba(255,255,255,.12) !important; border-radius: 12px !important;
  font-family: var(--font-mono) !important; font-size: 13px !important; }
.rm-hero label, .stTextArea label { color: var(--muted-dark) !important;
  font-family: var(--font-mono) !important; font-size: 12px !important; letter-spacing: .06em; }
.stButton > button { background: linear-gradient(90deg, var(--match-a), var(--match-b)) !important;
  color: #06231a !important; border: 0 !important; border-radius: 10px !important;
  font-family: var(--font-display) !important; font-weight: 600 !important;
  padding: 10px 22px !important; }
.stButton > button:hover { filter: brightness(1.05); }

/* ---- Accessibility floor ---- */
:focus-visible { outline: 2px solid var(--match-b) !important; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
</style>
"""


def inject() -> None:
    """Inject the ResumeMatch theme CSS into the current Streamlit page."""
    st.markdown(CSS, unsafe_allow_html=True)
