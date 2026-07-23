"""Sanity-check the judge before trusting its numbers.

Feed it a deliberately fabricated, badly-calibrated analysis and assert it
scores low. If the judge rates garbage highly, the judge is broken — not the
system under test.

    python -m evals.validate_judge     # needs a live key
"""

from __future__ import annotations

import json

from evals.judge import judge

CV = (
    "Anna Petrova\nGraphic Designer\n\nEXPERIENCE\n"
    "Graphic Designer at PrintCo (2019-2024)\n"
    "- Designed print brochures and social media banners in Photoshop.\n"
    "- Created brand guidelines and marketing flyers.\n\n"
    "SKILLS\nPhotoshop, Illustrator, InDesign"
)
JOB = (
    "Senior Backend Engineer\nMust-have: 5+ years Python; production APIs; "
    "PostgreSQL; Kubernetes; distributed systems."
)

# A wilfully bad analysis: sky-high score for an impossible match, a fabricated
# quote (Kubernetes never appears in the CV), and a `missing` req still citing.
BAD_ANALYSIS = {
    "score": {
        "overall_fit_score": 95,
        "verdict": "strong match",
        "summary": "Anna is a perfect fit with deep Python and Kubernetes expertise.",
        "requirements": [
            {"requirement": "5+ years Python", "type": "must-have", "status": "met",
             "evidence": "Led a team of senior Python engineers building distributed systems.",
             "note": "Clear expert."},
            {"requirement": "Kubernetes", "type": "must-have", "status": "missing",
             "evidence": "Deployed dozens of Kubernetes clusters in production.", "note": "Strong."},
        ],
        "key_strengths": ["World-class Python and Kubernetes engineer"],
        "critical_gaps": [],
        "quick_wins": [],
    },
    "rewrite": {
        "rewritten_bullets": [
            {"original": "Designed print brochures and social media banners in Photoshop.",
             "rewritten": "Architected large-scale Python microservices on Kubernetes.",
             "changed": True, "rationale": "Aligned to the role.", "keywords_added": ["Kubernetes", "Python"]}
        ],
        "tailored_summary": "Senior backend engineer with 8 years of Python and Kubernetes at scale.",
    },
    "requirement_matches": [],
}


def main() -> int:
    js = judge(CV, JOB, json.dumps(BAD_ANALYSIS))
    print("Judge on a deliberately fabricated analysis (want all LOW):")
    for dim in ("faithfulness", "evidence_quality", "calibration", "usefulness"):
        print(f"  {dim:<16} {getattr(js, dim)}/5 — {getattr(js, dim + '_reason')}")

    ok = js.faithfulness <= 2 and js.calibration <= 2
    print("\n" + ("✓ judge correctly flags garbage" if ok else "✗ JUDGE IS BROKEN — it rated fabrication highly"))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
