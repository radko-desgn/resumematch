"""Analysis orchestration for ResumeMatch.

Ties together two Claude calls (scoring/gap-analysis, bullet rewriting) plus a
local embedding match. Exactly two API calls are made per analysis.
"""

from __future__ import annotations

from . import prompts
from .embeddings import chunk_resume, extract_bullets, match_requirements
from .llm import structured_call
from .schemas import Analysis, RewriteResult, ScoreResult


def analyze(resume: str, job: str, mock: bool = False) -> Analysis:
    """Run the full analysis on a resume + job posting (both plain text).

    When `mock=True`, the two paid Claude calls are replaced with canned results
    (no API key, no cost); the local embedding match still runs for real.
    """
    bullets = extract_bullets(resume)

    if mock:
        # Free/offline mode: fake only the paid calls.
        from . import mocks

        score: ScoreResult = mocks.mock_score(resume, job)
        rewrite: RewriteResult = mocks.mock_rewrite(bullets, job)
    else:
        # 1) Scoring + gap analysis (Claude call #1)
        score = structured_call(
            system=prompts.SCORING_SYSTEM,
            user=prompts.build_scoring_user(resume, job),
            schema=ScoreResult,
        )
        # 3) Bullet rewriting (Claude call #2)
        rewrite = structured_call(
            system=prompts.REWRITE_SYSTEM,
            user=prompts.build_rewrite_user(bullets, job),
            schema=RewriteResult,
        )

    # 2) Local embedding match: requirements -> nearest resume evidence (no API)
    requirement_texts = [r.requirement for r in score.requirements]
    requirement_matches = match_requirements(requirement_texts, chunk_resume(resume))

    return Analysis(
        score=score,
        rewrite=rewrite,
        requirement_matches=requirement_matches,
    )
