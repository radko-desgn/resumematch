"""Canned results for free/offline mode (no API key, no cost).

Mock mode fakes ONLY the two paid Claude calls (scoring + rewriting) so the full
app — CLI, UI, flow — can be built, tested, and demoed without spending tokens.
Local embedding matching is left real (it's free). Swap to live mode by dropping
the --mock flag once an ANTHROPIC_API_KEY is set.
"""

from __future__ import annotations

from .schemas import Requirement, RewriteResult, RewrittenBullet, ScoreResult

_MOCK_NOTE = "[mock] canned result — set ANTHROPIC_API_KEY and drop --mock for a real analysis."


def mock_score(resume: str, job: str) -> ScoreResult:
    """Return a plausible, fixed ScoreResult (does not analyze the real input)."""
    return ScoreResult(
        overall_fit_score=74,
        verdict="moderate match",
        summary=(
            "Strong Python/backend foundation with production API experience; "
            "lighter on hands-on production LLM/RAG work. " + _MOCK_NOTE
        ),
        requirements=[
            Requirement(
                requirement="3+ years professional Python software engineering",
                type="must-have",
                status="met",
                evidence="4 years building and operating Python web services at scale.",
                note="Resume clearly meets the years-of-Python bar.",
            ),
            Requirement(
                requirement="Build and operate web services / APIs in production",
                type="must-have",
                status="met",
                evidence="Designed and shipped a FastAPI service handling 3M requests/day.",
                note="Direct production API ownership shown.",
            ),
            Requirement(
                requirement="PostgreSQL or comparable relational database",
                type="must-have",
                status="met",
                evidence="Migrated reporting to a service backed by PostgreSQL.",
                note="Hands-on PostgreSQL experience present.",
            ),
            Requirement(
                requirement="LLM APIs / embeddings / vector databases",
                type="nice-to-have",
                status="partially-met",
                evidence="Side project using an open-source LLM and a vector search index.",
                note="Exposure via a side project, not production.",
            ),
            Requirement(
                requirement="Kubernetes experience",
                type="nice-to-have",
                status="missing",
                evidence=None,
                note="No Kubernetes mentioned in the resume.",
            ),
        ],
        key_strengths=[
            "Production Python backend at scale (FastAPI, 3M req/day)",
            "CI/CD and containerization (GitHub Actions, Docker)",
            "Relational DB depth (PostgreSQL migrations, query tuning)",
        ],
        critical_gaps=[
            "No production LLM/RAG or evaluation-harness experience",
        ],
        quick_wins=[
            "Reframe the RSS side project to foreground RAG + vector search",
            "Surface observability work (metrics/latency) to match the role",
        ],
    )


# Honest demo rewrites for the sample resume — no new facts, only surfacing the
# job's own terminology (production, CI/CD, RAG, re-architected) where it applies.
_MOCK_REWRITES: dict[str, tuple[str, list[str]]] = {
    "Developed REST APIs in Python (Flask) backing a B2B analytics dashboard used by 400+ companies.":
        ("Built production Python (Flask) REST APIs backing a B2B analytics dashboard serving 400+ companies.",
         ["production"]),
    "Migrated a monolith's reporting module to a separate service backed by PostgreSQL, improving query times 4x.":
        ("Re-architected a monolith's reporting module into a PostgreSQL-backed service, cutting query times 4x.",
         ["PostgreSQL"]),
    "Introduced automated deployment with GitHub Actions and Docker, taking releases from weekly to on-demand.":
        ("Built CI/CD with GitHub Actions and Docker, moving releases from weekly to on-demand.",
         ["CI/CD"]),
    "Built an event-driven pipeline on RabbitMQ that reconciles carrier updates, reducing manual data-fix tickets by 60%.":
        ("Designed an event-driven RabbitMQ pipeline reconciling carrier updates, cutting manual data-fix tickets 60%.",
         []),
    "Built a small side project that summarizes RSS feeds using an open-source LLM and a vector search index.":
        ("Built a RAG side project summarizing RSS feeds with an open-source LLM over a vector search index.",
         ["RAG"]),
}


def mock_rewrite(bullets: list[str], job: str) -> RewriteResult:
    """Demonstrate the git-diff rewrites on known sample bullets; echo the rest.

    Only surfaces the job's terminology on facts already present — no fabrication.
    """
    rewritten: list[RewrittenBullet] = []
    for b in bullets[:8]:  # keep the demo output readable
        key = b.strip()
        if key in _MOCK_REWRITES:
            new_text, kws = _MOCK_REWRITES[key]
            rewritten.append(
                RewrittenBullet(
                    original=b,
                    rewritten=new_text,
                    changed=True,
                    rationale="[mock] surfaced the job's terminology; no new facts added.",
                    keywords_added=kws,
                )
            )
        else:
            rewritten.append(
                RewrittenBullet(
                    original=b, rewritten=b, changed=False,
                    rationale=_MOCK_NOTE, keywords_added=[],
                )
            )
    return RewriteResult(
        rewritten_bullets=rewritten,
        tailored_summary=(
            "Backend engineer with 4 years of production Python, API ownership, "
            "and CI/CD, plus early LLM + vector-search side work. " + _MOCK_NOTE
        ),
    )
