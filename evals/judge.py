"""LLM-as-judge for the dimensions deterministic code can't score.

The judge reads the CV, the job, and the analysis, and rates four things 1-5
with a one-line justification each. It never sees the "expected" answer — it
judges the analysis on its own merits so it can't just parrot the ground truth.

A judge you don't validate is a rubber stamp. `validate.py` feeds it a
deliberately broken analysis and asserts it scores low; run that before trusting
any numbers.
"""

from __future__ import annotations

from pydantic import BaseModel, Field

from resumematch.config import MODEL
from resumematch.llm import client


class JudgeScores(BaseModel):
    faithfulness: int = Field(ge=1, le=5, description="Are claims grounded in the CV, with nothing invented?")
    faithfulness_reason: str
    evidence_quality: int = Field(ge=1, le=5, description="Do cited quotes genuinely support the judgment?")
    evidence_quality_reason: str
    calibration: int = Field(ge=1, le=5, description="Is the score defensible for this CV↔job pair — not inflated, not harsh?")
    calibration_reason: str
    usefulness: int = Field(ge=1, le=5, description="Would this actually help the candidate decide and improve?")
    usefulness_reason: str


JUDGE_SYSTEM = """\
You are a strict evaluator of a CV/job matching system's output. You are given a
CV, a job description, and the system's analysis. Rate the analysis on four
dimensions from 1 (poor) to 5 (excellent), each with a one-sentence reason.

Be demanding and specific:
- faithfulness: penalise ANY claim, strength, or rewrite that states or implies
  experience not present in the CV. Fabrication is a 1-2 regardless of polish.
- evidence_quality: a cited quote must actually support the requirement it's
  attached to; vague or mismatched evidence is low.
- calibration: would a careful recruiter give a similar score? A weak candidate
  scored high, or a strong one scored low, is a 1-2. Reserve 5 for clearly
  defensible scores.
- usefulness: are the gaps and recommendations concrete and actionable, or
  generic filler?

Judge only what is in front of you. Do not invent missing context."""


def judge(cv: str, job: str, analysis_json: str) -> JudgeScores:
    resp = client().messages.parse(
        model=MODEL,
        max_tokens=2000,
        system=JUDGE_SYSTEM,
        messages=[
            {
                "role": "user",
                "content": (
                    f"<job>\n{job}\n</job>\n\n<cv>\n{cv}\n</cv>\n\n"
                    f"<analysis>\n{analysis_json}\n</analysis>\n\n"
                    "Rate the analysis."
                ),
            }
        ],
        output_format=JudgeScores,
    )
    return resp.parsed_output
