"""Run the eval harness over the golden set.

    python -m evals.run              # mock mode (free, deterministic checks only)
    python -m evals.run --live       # real Claude calls + LLM judge
    python -m evals.run --live -k ai # only cases whose id contains "ai"

Writes eval_results/latest.json and prints a summary. Exit code is non-zero if
the deterministic pass-rate drops below --threshold (default 0.90), so this can
gate CI.
"""

from __future__ import annotations

import argparse
import glob
import json
import time
from pathlib import Path

from resumematch.analyzer import analyze
from evals.checks import run_checks

RESULTS = Path(__file__).parent.parent / "eval_results"


def _load_cases(pattern: str | None) -> list[dict]:
    files = sorted(glob.glob(str(Path(__file__).parent / "golden" / "*.json")))
    cases = [json.load(open(f)) for f in files]
    if pattern:
        cases = [c for c in cases if pattern in c["id"]]
    return cases


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--live", action="store_true", help="real Claude calls + LLM judge")
    ap.add_argument("-k", dest="pattern", default=None, help="only run cases whose id contains this")
    ap.add_argument("--threshold", type=float, default=0.90, help="min deterministic pass-rate to exit 0")
    args = ap.parse_args()
    mock = not args.live

    judge_fn = None
    if args.live:
        from evals.judge import judge as judge_fn  # imported lazily; needs a key

    cases = _load_cases(args.pattern)
    print(f"Running {len(cases)} cases · {'LIVE' if args.live else 'MOCK'} mode\n")

    results = []
    total_checks = total_passed = 0
    latencies: list[float] = []
    judge_totals: dict[str, list[int]] = {}

    for c in cases:
        t0 = time.time()
        analysis = analyze(c["cv"], c["job"], mock=mock, with_rewrites=True)
        dt = time.time() - t0
        latencies.append(dt)

        checks = run_checks(analysis, c)
        passed = sum(1 for ch in checks if ch.passed)
        total_checks += len(checks)
        total_passed += passed

        row = {
            "id": c["id"],
            "score": analysis.score.overall_fit_score,
            "band": c["expected_band"],
            "checks": [{"name": ch.name, "passed": ch.passed, "detail": ch.detail} for ch in checks],
            "checks_passed": passed,
            "checks_total": len(checks),
            "latency_s": round(dt, 2),
        }

        if judge_fn:
            js = judge_fn(c["cv"], c["job"], json.dumps(analysis.model_dump()))
            row["judge"] = js.model_dump()
            for dim in ("faithfulness", "evidence_quality", "calibration", "usefulness"):
                judge_totals.setdefault(dim, []).append(getattr(js, dim))

        results.append(row)

        mark = "✓" if passed == len(checks) else "✗"
        fails = [ch.name for ch in checks if not ch.passed]
        extra = f"  judge f/e/c/u: {row['judge']['faithfulness']}/{row['judge']['evidence_quality']}/{row['judge']['calibration']}/{row['judge']['usefulness']}" if judge_fn else ""
        print(f"  {mark} {c['id']:<28} {passed}/{len(checks)} checks{extra}"
              + (f"   fails: {fails}" if fails else ""))

    rate = total_passed / total_checks if total_checks else 0.0
    summary = {
        "mode": "live" if args.live else "mock",
        "cases": len(cases),
        "deterministic_pass_rate": round(rate, 3),
        "checks_passed": total_passed,
        "checks_total": total_checks,
        "avg_latency_s": round(sum(latencies) / len(latencies), 2) if latencies else 0,
    }
    if judge_totals:
        summary["judge_avg"] = {k: round(sum(v) / len(v), 2) for k, v in judge_totals.items()}

    RESULTS.mkdir(exist_ok=True)
    (RESULTS / "latest.json").write_text(json.dumps({"summary": summary, "results": results}, indent=2))

    print("\n" + "=" * 60)
    print(f"Deterministic pass-rate: {rate:.1%}  ({total_passed}/{total_checks})")
    print(f"Avg latency: {summary['avg_latency_s']}s")
    if judge_totals:
        j = summary["judge_avg"]
        print(f"Judge (1-5): faithfulness {j['faithfulness']} · evidence {j['evidence_quality']} · "
              f"calibration {j['calibration']} · usefulness {j['usefulness']}")
    print(f"→ eval_results/latest.json")

    if rate < args.threshold:
        print(f"\n✗ below threshold {args.threshold:.0%}")
        return 1
    print(f"\n✓ meets threshold {args.threshold:.0%}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
