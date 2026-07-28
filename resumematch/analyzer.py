"""Analysis orchestration for ResumeMatch.

Ties together two Claude calls (scoring/gap-analysis, bullet rewriting) plus a
local embedding match. Exactly two API calls are made per analysis.
"""

from __future__ import annotations

from . import prompts
from .embeddings import chunk_resume, extract_bullets, match_requirements
from .llm import structured_call
from .schemas import Analysis, Requirement, RewriteResult, ScoreResult, TailoredCV

# How much each requirement status counts toward coverage.
_STATUS_WEIGHT = {"met": 1.0, "partially-met": 0.5, "missing": 0.0}
# Must-haves dominate; nice-to-haves are a small bonus.
_MUST_WEIGHT = 0.8
_NICE_WEIGHT = 0.2


def _coverage(group: list[Requirement]) -> float | None:
    """Average status weight for a group, or None if the group is empty."""
    if not group:
        return None
    return sum(_STATUS_WEIGHT[r.status] for r in group) / len(group)


def score_from_requirements(requirements: list[Requirement]) -> int:
    """Derive the overall fit score (0-100) from the requirement coverage.

    Computed in code so the headline number can never contradict the
    met/partial/missing breakdown — an LLM left to free-form the percentage
    inflates it (e.g. 78% while meeting 3 of 9 requirements).
    """
    if not requirements:
        return 0
    must = _coverage([r for r in requirements if r.type == "must-have"])
    nice = _coverage([r for r in requirements if r.type == "nice-to-have"])
    if must is None and nice is None:
        return 0
    if must is None:
        pct = nice  # only nice-to-haves listed
    elif nice is None:
        pct = must  # only must-haves listed
    else:
        pct = _MUST_WEIGHT * must + _NICE_WEIGHT * nice
    return max(0, min(100, round(pct * 100)))


def verdict_for(score: int) -> str:
    """Map a score to the three-way verdict, consistent with the number."""
    if score >= 70:
        return "strong match"
    if score >= 45:
        return "moderate match"
    return "weak match"


def analyze(
    resume: str,
    job: str,
    mock: bool = False,
    with_rewrites: bool = True,
) -> Analysis:
    """Run the analysis on a resume + job posting (both plain text).

    `mock=True` replaces the paid Claude calls with canned results (no key, no
    cost); the local embedding match still runs for real.

    `with_rewrites=False` runs ONLY the scoring call and skips the bullet-rewrite
    call — used for the free tier, roughly halving the cost per analysis.
    """
    bullets = extract_bullets(resume)
    empty_rewrite = RewriteResult(rewritten_bullets=[], tailored_summary="")

    if mock:
        # Free/offline mode: fake only the paid calls.
        from . import mocks

        score: ScoreResult = mocks.mock_score(resume, job)
        rewrite: RewriteResult = mocks.mock_rewrite(bullets, job) if with_rewrites else empty_rewrite
    else:
        # 1) Scoring + gap analysis (Claude call #1)
        score = structured_call(
            system=prompts.SCORING_SYSTEM,
            user=prompts.build_scoring_user(resume, job),
            schema=ScoreResult,
        )
        # 3) Bullet rewriting (Claude call #2) — paid tier only
        rewrite = (
            structured_call(
                system=prompts.REWRITE_SYSTEM,
                user=prompts.build_rewrite_user(bullets, job),
                schema=RewriteResult,
            )
            if with_rewrites
            else empty_rewrite
        )

    # Derive the headline score + verdict from the per-requirement coverage, so
    # they always agree with the met/partial/missing breakdown the user sees.
    score.overall_fit_score = score_from_requirements(score.requirements)
    score.verdict = verdict_for(score.overall_fit_score)  # type: ignore[assignment]

    # 2) Local embedding match: requirements -> nearest resume evidence (no API)
    requirement_texts = [r.requirement for r in score.requirements]
    requirement_matches = match_requirements(requirement_texts, chunk_resume(resume))

    return Analysis(
        score=score,
        rewrite=rewrite,
        requirement_matches=requirement_matches,
    )


def generate_tailored_cv(
    resume: str,
    job: str,
    mock: bool = False,
    gaps: list[str] | None = None,
) -> TailoredCV:
    """Rewrite the CV as an ATS-friendly document tailored to one job.

    A third Claude call, reserved for the paid tier. Nothing is invented — the
    prompt only permits reordering, emphasis, and honest rewording.
    """
    if mock:
        from . import mocks

        return mocks.mock_tailored_cv(resume, job)

    return structured_call(
        system=prompts.TAILORED_CV_SYSTEM,
        user=prompts.build_tailored_cv_user(resume, job, gaps),
        schema=TailoredCV,
        max_tokens=8000,
    )
