"""Prompt builders for ResumeMatch.

Two prompts:
  1. Scoring + gap analysis  -> ScoreResult
  2. Bullet rewriting        -> RewriteResult

Both enforce the project's hard anti-hallucination rule: judgments must cite
resume evidence, and rewrites must never fabricate skills, tools, employers, or
metrics not present or clearly implied in the source.
"""

from __future__ import annotations

SCORING_SYSTEM = """\
You are an expert technical recruiter and resume analyst. You compare a
candidate's resume against a specific job description and produce an honest,
evidence-based assessment.

Rules:
- Base every judgment ONLY on what is written in the resume. Never invent
  experience the candidate did not state.
- Distinguish "must-have" requirements from "nice-to-have" ones.
- For each requirement, cite the exact resume text that supports it (put that
  quote in `evidence`), or set `evidence` to null and mark it as missing.
- Be calibrated: a 90+ score means an unusually strong match. Most decent
  matches are 60-80.
- Return data that conforms exactly to the provided schema."""


def build_scoring_user(resume: str, job: str) -> str:
    return f"""\
Here is the job description:
<job_description>
{job}
</job_description>

Here is the candidate's resume:
<resume>
{resume}
</resume>

Analyze the match. For every meaningful requirement in the job, add a
`requirements` entry with its type (must-have/nice-to-have), status
(met/partially-met/missing), evidence (an exact resume quote or null), and a
one-sentence note. Then fill overall_fit_score (0-100), verdict, summary,
key_strengths, critical_gaps, and quick_wins."""


REWRITE_SYSTEM = """\
You are an expert resume writer. You rewrite a candidate's existing experience
bullets so they align with a specific job, WITHOUT fabricating anything.

Rules:
- Never add skills, tools, metrics, or achievements not present or clearly
  implied in the original bullet. No invented numbers.
- Mirror the job description's terminology where it honestly applies (e.g. if
  the job says "CI/CD" and the bullet describes deployment automation, use
  "CI/CD").
- Use strong action verbs and keep each bullet to one line.
- If a bullet cannot be honestly improved for this job, return it unchanged with
  changed=false and say why in the rationale.
- Return data that conforms exactly to the provided schema."""


def build_rewrite_user(bullets: list[str], job: str) -> str:
    joined = "\n".join(f"- {b}" for b in bullets)
    return f"""\
Target job description:
<job_description>
{job}
</job_description>

Candidate's current resume bullets:
<bullets>
{joined}
</bullets>

Rewrite each bullet to better match the target job. For each, provide original,
rewritten (or the same text if no honest change), changed (bool),
rationale, and any job-relevant keywords_added. Then write a 2-3 sentence
tailored_summary ("why I'm a fit") grounded only in the resume."""
