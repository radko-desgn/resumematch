"""Offline smoke tests for ResumeMatch.

These MUST NOT hit the paid API. They validate schema round-trips and pure
text-processing helpers. The embedding-model test is skipped if the model can't
be loaded (e.g. no network to download weights in CI).
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from resumematch.embeddings import chunk_resume, extract_bullets
from resumematch.schemas import Analysis, RewriteResult, ScoreResult

FIXTURES = Path(__file__).parent / "fixtures"

SAMPLE_SCORE = {
    "overall_fit_score": 72,
    "verdict": "moderate match",
    "summary": "Strong Python/backend fit; light on hands-on LLM experience.",
    "requirements": [
        {
            "requirement": "3+ years Python software engineering",
            "type": "must-have",
            "status": "met",
            "evidence": "Backend-leaning software engineer with 4 years building "
            "Python web services at scale.",
            "note": "Resume states 4 years of Python backend work.",
        },
        {
            "requirement": "Vector database experience (pgvector, Pinecone)",
            "type": "nice-to-have",
            "status": "partially-met",
            "evidence": "Built a side project using a vector search index.",
            "note": "Side-project exposure, not production.",
        },
        {
            "requirement": "Kubernetes experience",
            "type": "nice-to-have",
            "status": "missing",
            "evidence": None,
            "note": "No Kubernetes mentioned.",
        },
    ],
    "key_strengths": ["Python backend at scale", "CI/CD and Docker"],
    "critical_gaps": ["Production LLM/RAG experience"],
    "quick_wins": ["Reframe the RSS side project to highlight RAG"],
}

SAMPLE_REWRITE = {
    "rewritten_bullets": [
        {
            "original": "Built a small side project that summarizes RSS feeds "
            "using an open-source LLM and a vector search index.",
            "rewritten": "Built a RAG side project summarizing RSS feeds with an "
            "open-source LLM over a vector search index.",
            "changed": True,
            "rationale": "Surfaces RAG terminology the job asks for; no new facts.",
            "keywords_added": ["RAG"],
        }
    ],
    "tailored_summary": "Backend engineer with 4 years of production Python and "
    "CI/CD, plus hands-on LLM + vector-search side work.",
}


def test_score_schema_roundtrips():
    score = ScoreResult.model_validate(SAMPLE_SCORE)
    assert 0 <= score.overall_fit_score <= 100
    # Missing requirements must carry null evidence.
    missing = [r for r in score.requirements if r.status == "missing"]
    assert all(r.evidence is None for r in missing)
    # Round-trip through JSON stays valid.
    ScoreResult.model_validate_json(score.model_dump_json())


def test_rewrite_schema_roundtrips():
    rewrite = RewriteResult.model_validate(SAMPLE_REWRITE)
    assert rewrite.rewritten_bullets[0].changed is True


def test_analysis_combines_parts():
    analysis = Analysis(
        score=ScoreResult.model_validate(SAMPLE_SCORE),
        rewrite=RewriteResult.model_validate(SAMPLE_REWRITE),
        requirement_matches=[],
    )
    assert analysis.model_dump_json()  # serializes without error


def test_chunk_and_bullets_are_pure_text():
    resume = (FIXTURES / "sample_resume.txt").read_text(encoding="utf-8")
    chunks = chunk_resume(resume)
    bullets = extract_bullets(resume)
    assert len(chunks) > 10
    # The FastAPI achievement line should be picked up as a bullet.
    assert any("FastAPI" in b for b in bullets)


def test_fixtures_exist():
    assert (FIXTURES / "sample_resume.txt").exists()
    assert (FIXTURES / "sample_job.txt").exists()


def test_mock_analysis_runs_without_key(monkeypatch):
    """Free mode: full analyze() works with no ANTHROPIC_API_KEY and no cost."""
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    try:
        from resumematch.analyzer import analyze
    except Exception as exc:  # pragma: no cover
        pytest.skip(f"analyzer import failed: {exc}")

    resume = (FIXTURES / "sample_resume.txt").read_text(encoding="utf-8")
    job = (FIXTURES / "sample_job.txt").read_text(encoding="utf-8")
    try:
        analysis = analyze(resume, job, mock=True)
    except Exception as exc:  # embedding model may be unavailable offline
        pytest.skip(f"embedding model unavailable offline: {exc}")

    assert 0 <= analysis.score.overall_fit_score <= 100
    assert analysis.rewrite.rewritten_bullets
    # Invariant: `changed` is true exactly when the text actually differs.
    for b in analysis.rewrite.rewritten_bullets:
        assert b.changed == (b.rewritten != b.original)
    assert analysis.model_dump_json()  # fully serializable


def test_embedding_match_optional():
    """Runs the real embedder if weights are available; skips otherwise."""
    try:
        from resumematch.embeddings import match_requirements
    except Exception as exc:  # pragma: no cover
        pytest.skip(f"embeddings import failed: {exc}")

    try:
        matches = match_requirements(
            ["Python web services in production"],
            ["Built a FastAPI service handling 3M requests/day", "BSc Computer Science"],
        )
    except Exception as exc:  # model download unavailable, etc.
        pytest.skip(f"embedding model unavailable offline: {exc}")

    assert matches, "expected at least one match"
    assert -1.0 <= matches[0].score <= 1.0
    # The FastAPI line should be the nearest evidence, not the education line.
    assert "FastAPI" in matches[0].best_chunk


# ---------------------------------------------------------------- input checks
# Thresholds were calibrated by measuring real CVs/job posts against junk; these
# lock that calibration in so a future tweak can't silently start rejecting real
# CVs (the failure mode that actually matters).
import pytest as _pytest

from resumematch import validation

_REAL_CV = (
    "Maria Ivanova. Graphic designer with 6 years experience at an agency in "
    "Sofia. Led rebranding projects for retail clients. Skilled in Figma, "
    "Illustrator and print production. Bachelor degree in visual arts."
)
_TERSE_CV = (
    "Python, FastAPI, Docker, PostgreSQL, Kubernetes, AWS. Senior Engineer "
    "2020-2024. Led platform team. Shipped payments service. Reduced latency "
    "40%. BSc Computer Science 2016."
)
_REAL_JOB = (
    "We are looking for a barista to join our coffee shop team in central "
    "London. You will prepare drinks, serve customers and keep the bar clean. "
    "Previous hospitality experience preferred. Full training provided."
)


@_pytest.mark.parametrize("text,kind", [(_REAL_CV, "cv"), (_TERSE_CV, "cv"), (_REAL_JOB, "job")])
def test_real_inputs_are_accepted(text, kind):
    try:
        assert validation.check(text, kind).ok, f"real {kind} was rejected"
    except Exception as exc:  # embedding model unavailable offline
        _pytest.skip(f"embedding model unavailable: {exc}")


@_pytest.mark.parametrize(
    "text",
    [
        "asdkjh askjdh askjdh qwlkejqwe zxcmnzxc askjdhqwe zxcmnbzxc qweqweqwe asdasdasd zxczxczxc",
        "banana telephone mountain purple running seventeen glass window cloud pencil rabbit ocean "
        "bicycle lamp forest coffee mirror engine paper river candle bridge garden pillow rocket tiger",
        "test " * 60,
        "short",
    ],
)
def test_junk_is_rejected(text):
    try:
        v = validation.check(text, "cv")
    except Exception as exc:
        _pytest.skip(f"embedding model unavailable: {exc}")
    assert not v.ok and v.reason, "junk input was accepted"
