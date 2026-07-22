"""Render each CaseSpec into realistic CV + job text.

Run once; the output is committed so evals are reproducible:

    python -m evals.generate_cases

The specs define the ground truth, so generation must respect their absences —
a case asserting "Kubernetes is missing" is worthless if the generated CV
mentions Kubernetes. Every case is therefore checked after generation and
regenerated once if a forbidden term leaked in.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from pydantic import BaseModel, Field

from evals.specs import SPECS, CaseSpec
from resumematch.llm import structured_call

OUT_DIR = Path(__file__).parent / "golden"

SYSTEM = """\
You write realistic synthetic CVs and job postings for testing a CV/job matching
system. They must read like genuine documents, not templates.

Rules:
- Follow the brief EXACTLY. If it says a skill is absent, that skill must not
  appear anywhere — not in a skills list, not implied by a tool name.
- Invent plausible names, companies, and dates. Never use real people.
- CV: normal plain-text CV structure (name, summary, experience with bullets,
  skills, education). No markdown headers.
- Job posting: title, short intro, then explicit "Must-have" and "Nice-to-have"
  sections as bullet lists.
- Keep each document between 150 and 400 words."""


class GeneratedCase(BaseModel):
    cv: str = Field(description="The full CV as plain text.")
    job: str = Field(description="The full job posting as plain text.")


def _user_prompt(spec: CaseSpec) -> str:
    banned = ""
    if spec.forbidden_claims:
        joined = ", ".join(f'"{c}"' for c in spec.forbidden_claims)
        banned = (
            f"\n\nHARD CONSTRAINT — these must NOT appear anywhere in the CV, in any "
            f"form or casing: {joined}. The test depends on their absence."
        )
    return f"""\
Write one CV and one job posting for this test case.

CV must contain exactly this profile:
{spec.cv_brief}

Job posting must require exactly this:
{spec.job_brief}{banned}"""


def _leaks(cv: str, spec: CaseSpec) -> list[str]:
    low = cv.lower()
    return [c for c in spec.forbidden_claims if re.search(re.escape(c.lower()), low)]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ok = leaked = 0

    for spec in SPECS:
        result = structured_call(system=SYSTEM, user=_user_prompt(spec), schema=GeneratedCase, max_tokens=3000)

        bad = _leaks(result.cv, spec)
        if bad:  # one retry with the violation called out
            retry = _user_prompt(spec) + f"\n\nYour previous attempt leaked: {bad}. Remove them entirely."
            result = structured_call(system=SYSTEM, user=retry, schema=GeneratedCase, max_tokens=3000)
            bad = _leaks(result.cv, spec)

        payload = {
            "id": spec.id,
            "role": spec.role,
            "level": spec.level,
            "expected_band": list(spec.band),
            "cv": result.cv,
            "job": result.job,
            "requirements": [
                {"match": r.match, "status": r.status, "note": r.note} for r in spec.requirements
            ],
            "forbidden_claims": spec.forbidden_claims,
        }
        (OUT_DIR / f"{spec.id}.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False))

        if bad:
            leaked += 1
            print(f"  ⚠ {spec.id:<28} still leaks {bad} — review by hand")
        else:
            ok += 1
            print(f"  ✓ {spec.id:<28} cv {len(result.cv):>4} chars | job {len(result.job):>4} chars")

    print(f"\n{ok} clean, {leaked} needing review → {OUT_DIR}")


if __name__ == "__main__":
    main()
