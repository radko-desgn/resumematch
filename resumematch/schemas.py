"""Pydantic schemas for ResumeMatch analysis outputs.

These are used both as the structured-output targets for Claude and as the
validated data model the UI/CLI consume.
"""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class Requirement(BaseModel):
    """A single requirement extracted from the job, judged against the resume."""

    requirement: str = Field(description="A single requirement from the job posting.")
    type: Literal["must-have", "nice-to-have"]
    status: Literal["met", "partially-met", "missing"]
    evidence: Optional[str] = Field(
        default=None,
        description="Exact quote from the resume supporting this, or null if missing.",
    )
    note: str = Field(description="One sentence explaining the judgment.")


class ScoreResult(BaseModel):
    """Result of the scoring + gap-analysis call."""

    overall_fit_score: int = Field(ge=0, le=100)
    verdict: Literal["strong match", "moderate match", "weak match"]
    summary: str
    requirements: list[Requirement]
    key_strengths: list[str]
    critical_gaps: list[str]
    quick_wins: list[str]


class RewrittenBullet(BaseModel):
    """One resume bullet, optionally rewritten for the target job."""

    original: str
    rewritten: str
    changed: bool
    rationale: str
    keywords_added: list[str] = Field(default_factory=list)


class RewriteResult(BaseModel):
    """Result of the bullet-rewriting call."""

    rewritten_bullets: list[RewrittenBullet]
    tailored_summary: str


class RequirementMatch(BaseModel):
    """Local-embedding link from a requirement to its best resume evidence."""

    requirement: str
    best_chunk: str
    score: float


class Analysis(BaseModel):
    """The combined analysis returned by analyzer.analyze()."""

    score: ScoreResult
    rewrite: RewriteResult
    requirement_matches: list[RequirementMatch]
