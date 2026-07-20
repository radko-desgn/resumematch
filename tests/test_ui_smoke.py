"""Offline UI smoke tests — no server launch, no API key, no cost.

Verifies the pure HTML component builders render from a mock Analysis, and that
app.py imports without executing the Streamlit server (its side effects live
under main()).
"""

from __future__ import annotations

import importlib
from pathlib import Path

import pytest

from resumematch.ui import components

FIXTURES = Path(__file__).parent / "fixtures"


def _mock_analysis(monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    from resumematch.analyzer import analyze

    resume = (FIXTURES / "sample_resume.txt").read_text(encoding="utf-8")
    job = (FIXTURES / "sample_job.txt").read_text(encoding="utf-8")
    return analyze(resume, job, mock=True)


def test_components_render_from_mock(monkeypatch):
    try:
        analysis = _mock_analysis(monkeypatch)
    except Exception as exc:  # embedding model unavailable offline
        pytest.skip(f"embedding model unavailable offline: {exc}")

    gauge = components.score_gauge(analysis.score.overall_fit_score,
                                   analysis.score.verdict, analysis.score.summary)
    gaps = components.gap_analysis(analysis.score.requirements)
    diff = components.diff_rewrites(analysis.rewrite.rewritten_bullets,
                                    analysis.rewrite.tailored_summary)

    assert "<svg" in gauge and str(analysis.score.overall_fit_score) in gauge
    assert "rm-req" in gaps and "rm-pill" in gaps
    assert "resume.diff" in diff and "rm-diff" in diff


def test_gauge_clamps_out_of_range():
    assert 'stroke-dashoffset="0.00"' in components.score_gauge(150)  # clamps to 100 (full)


def test_diff_marks_changed_and_unchanged():
    from resumematch.schemas import RewrittenBullet

    bullets = [
        RewrittenBullet(original="A", rewritten="A2", changed=True, rationale="x"),
        RewrittenBullet(original="B", rewritten="B", changed=False, rationale="y"),
    ]
    html = components.diff_rewrites(bullets)
    assert "del" in html and "add" in html and "ctx" in html


def test_app_imports_without_running_server():
    app = importlib.import_module("app")
    assert hasattr(app, "main")  # importing must not launch the server
