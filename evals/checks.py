"""Deterministic eval checks — pure code, no LLM, no cost.

These catch the objective failures a judge shouldn't have to reason about:
a cited quote that isn't in the CV, a `missing` requirement that still carries
evidence, a score outside the case's band, or a requirement the ground truth
pins to one status coming back as another.

Everything returns a list of Check(name, passed, detail) so the runner can
tally and print them uniformly.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

from resumematch.schemas import Analysis


@dataclass
class Check:
    name: str
    passed: bool
    detail: str = ""


def _normalize(text: str) -> str:
    """Loose match: lowercase, collapse whitespace, strip most punctuation.

    Models legitimately tidy a quote (smart quotes, trimmed trailing period),
    so an exact substring test would flag good output. This stays strict on
    words while tolerating cosmetic differences.
    """
    text = text.lower().replace("’", "'").replace("‘", "'")
    text = text.replace("“", '"').replace("”", '"')
    text = re.sub(r"[^a-z0-9 ]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _evidence_in_cv(evidence: str, cv: str) -> bool:
    ev = _normalize(evidence)
    doc = _normalize(cv)
    if not ev:
        return False
    if ev in doc:
        return True
    # Allow a light paraphrase: most of the quote's words appear, in a run.
    words = ev.split()
    if len(words) >= 6:
        # require a contiguous 6-word shingle to appear verbatim
        return any(" ".join(words[i : i + 6]) in doc for i in range(len(words) - 5))
    return False


def run_checks(analysis: Analysis, case: dict) -> list[Check]:
    cv: str = case["cv"]
    reqs = analysis.score.requirements
    checks: list[Check] = []

    # 1) Score within the case's expected band
    lo, hi = case["expected_band"]
    sc = analysis.score.overall_fit_score
    checks.append(
        Check("score_in_band", lo <= sc <= hi, f"score {sc}, expected {lo}-{hi}")
    )

    # 2) Every non-missing requirement's evidence actually exists in the CV
    hallucinated = [
        r.requirement[:40]
        for r in reqs
        if r.status != "missing" and r.evidence and not _evidence_in_cv(r.evidence, cv)
    ]
    checks.append(
        Check(
            "evidence_grounded",
            not hallucinated,
            "all quotes found in CV" if not hallucinated else f"not in CV: {hallucinated}",
        )
    )

    # 3) `missing` requirements must carry null evidence
    bad_missing = [r.requirement[:40] for r in reqs if r.status == "missing" and r.evidence]
    checks.append(
        Check(
            "missing_has_null_evidence",
            not bad_missing,
            "ok" if not bad_missing else f"missing but cited: {bad_missing}",
        )
    )

    # 4) Ground-truth requirement statuses (matched by substring)
    for want in case.get("requirements", []):
        needle = want["match"].lower()
        hits = [r for r in reqs if needle in r.requirement.lower()]
        if not hits:
            checks.append(Check(f"req[{want['match']}]", False, "requirement not surfaced"))
            continue
        got = hits[0].status
        checks.append(
            Check(
                f"req[{want['match']}]",
                got == want["status"],
                f"got {got}, expected {want['status']}",
            )
        )

    # 5) No forbidden claim fabricated into a rewrite / tailored text.
    #    Only count a term the model ADDED — if it was already in the original
    #    bullet, or appears in a negating phrase ("no X experience"), it isn't
    #    fabrication.
    NEGATORS = ("no ", "without", "lacks", "not ", "absent", "missing")

    def _fabricated(term: str) -> bool:
        t = term.lower()
        for b in analysis.rewrite.rewritten_bullets:
            if t in b.rewritten.lower() and t not in b.original.lower():
                return True  # added, not carried over
        summ = analysis.rewrite.tailored_summary.lower()
        if t in summ:
            # ignore if it's inside a negating clause
            idx = summ.find(t)
            window = summ[max(0, idx - 24) : idx]
            if not any(n in window for n in NEGATORS):
                return True
        return False

    fabricated = [c for c in case.get("forbidden_claims", []) if _fabricated(c)]
    checks.append(
        Check(
            "no_fabricated_claims",
            not fabricated,
            "clean" if not fabricated else f"fabricated: {fabricated}",
        )
    )

    return checks
