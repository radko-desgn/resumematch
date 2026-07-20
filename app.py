"""ResumeMatch — Streamlit UI.

Run: streamlit run app.py
Free by default (mock mode). Add ANTHROPIC_API_KEY for an opt-in live analysis.
"""

from __future__ import annotations

import contextlib
import os
from pathlib import Path

import streamlit as st

from resumematch.analyzer import analyze
from resumematch.ui import components, theme

FIXTURES = Path(__file__).parent / "tests" / "fixtures"


def _sample(name: str) -> str:
    path = FIXTURES / name
    return path.read_text(encoding="utf-8") if path.exists() else ""


def _has_key() -> bool:
    return bool(os.environ.get("ANTHROPIC_API_KEY"))


def _render_results(analysis) -> None:
    """Render the whole results surface as ONE white HTML panel."""
    s = analysis.score
    html = (
        '<div class="rm-results">'
        '<div class="rm-label">fit score</div>'
        + components.score_gauge(s.overall_fit_score, s.verdict, s.summary)
        + '<div class="rm-h2" style="margin-top:36px">Gap analysis</div>'
        '<div class="rm-label">requirements matched against your resume</div>'
        + components.gap_analysis(s.requirements)
        + '<div class="rm-h2" style="margin-top:36px">Your bullets, rewritten</div>'
        '<div class="rm-label">tailored to this job — nothing fabricated</div>'
        + components.diff_rewrites(analysis.rewrite.rewritten_bullets, analysis.rewrite.tailored_summary)
        + "</div>"
    )
    st.markdown(html, unsafe_allow_html=True)


def main() -> None:
    st.set_page_config(page_title="ResumeMatch", page_icon="🎯", layout="wide")
    theme.inject()

    # ---- Hero ----
    st.markdown(
        '<div class="rm-hero">'
        '<div class="rm-eyebrow">version control for your career</div>'
        '<div class="rm-h1">Does your resume<br>fit the job?</div>'
        '<div class="rm-sub">Paste your resume and a job posting. Get a fit score, an '
        'evidence-backed gap analysis, and your bullets rewritten for the role — no fabrication.</div>'
        "</div>",
        unsafe_allow_html=True,
    )

    # After a first analysis, collapse the inputs so the results sit near the top.
    analyzed = st.session_state.get("analysis") is not None
    input_box = (
        st.expander("✏️  Resume & job posting", expanded=False)
        if analyzed
        else contextlib.nullcontext()
    )
    with input_box:
        col1, col2 = st.columns(2)
        with col1:
            resume = st.text_area("RESUME", value=_sample("sample_resume.txt"), height=280, key="resume")
        with col2:
            job = st.text_area("JOB POSTING", value=_sample("sample_job.txt"), height=280, key="job")

    # ---- Mock / live control ----
    if _has_key():
        use_live = st.toggle("Live analysis (~1.5¢ per run)", value=False,
                             help="Off = free mock mode. On = a real Claude analysis.")
        use_mock = not use_live
    else:
        use_mock = True
        st.caption("Free mode — set ANTHROPIC_API_KEY for a live analysis.")

    analyze_clicked = st.button("Analyze  →")

    # ---- Run ----
    if analyze_clicked:
        if not resume.strip() or not job.strip():
            st.warning("Paste both a resume and a job posting first.")
        else:
            try:
                with st.spinner("Analyzing…"):
                    st.session_state["analysis"] = analyze(resume, job, mock=use_mock)
                st.rerun()  # re-run so inputs collapse and results render near the top
            except Exception as exc:  # noqa: BLE001 - surface cleanly, never a raw traceback
                st.error(f"Analysis failed: {exc}")

    analysis = st.session_state.get("analysis")
    if analysis is not None:
        _render_results(analysis)


if __name__ == "__main__":
    main()
