# Evaluation harness

Measures whether the analysis engine is actually good — not by eyeballing a few
examples, but against a fixed golden set with automated grading, so a prompt
change can be shown to help or hurt.

## Run

```bash
python -m evals.run                 # mock mode — free, exercises the plumbing + deterministic checks
python -m evals.run --live          # real Claude calls + LLM judge (costs ~$1-2)
python -m evals.run --live -k design   # only cases whose id contains "design"
python -m evals.validate_judge      # sanity-check the judge itself (live)
```

Results are written to `eval_results/latest.json`. `run.py` exits non-zero when
the deterministic pass-rate is below `--threshold` (default 0.90), so it can gate CI.

## What's measured

**Deterministic checks** (`checks.py`, pure code, no cost):
- `score_in_band` — overall score within the case's expected range
- `evidence_grounded` — every cited quote actually appears in the CV
- `missing_has_null_evidence` — `missing` requirements carry no evidence
- `req[...]` — ground-truth requirement statuses hold (met / partial / missing)
- `no_fabricated_claims` — no forbidden term was *added* into a rewrite

**LLM-as-judge** (`judge.py`, 1–5 each): faithfulness, evidence quality,
calibration, usefulness. It never sees the expected answer, and it's validated
against a deliberately fabricated analysis (`validate_judge.py`) — which it
correctly scores straight 1/5s.

## The golden set

20 constructed cases (`golden/*.json`), generated from `specs.py` so the ground
truth is true by construction (a CV that uses MongoDB and never says "postgres"
*must* return that requirement missing). Weighted to design + AI/software
engineering, covering strong/weak matches plus career-changer, sparse CV,
keyword-stuffed, missing-must-have, over-qualified, employment gap, contractor,
and non-native-English cases. Synthetic on purpose — real CVs would be personal data.

Regenerate (only if specs change): `python -m evals.generate_cases`.

## Baseline (live, 20 cases)

| Metric | Value |
|--------|-------|
| Deterministic pass-rate | ~86–89% (110/124) |
| Judge — faithfulness | 4.5–4.7 / 5 |
| Judge — evidence quality | ~4.7 / 5 |
| Judge — calibration | ~4.7 / 5 |
| Judge — usefulness | ~4.0 / 5 |
| Avg latency / analysis | ~24 s (live) |

**A real fix this surfaced:** the first baseline caught the rewrite step
inventing experience when a CV was too sparse (only titles + dates) and reaching
for job keywords on poor-fit candidates. The rewrite prompt was tightened to
forbid both; judge faithfulness on those cases went to 5/5.

> Note on variance: LLM output is non-deterministic, so the pass-rate moves a
> few points run to run. Track the trend across runs, not a single number.

## Known backlog (next iterations)

- **Calibration edges:** a handful of scores land just outside their band
  (e.g. an employment-gap CV scored 92 vs an 85 ceiling; a career-changer 28 vs
  a 30 floor). The bands are hand-set opinions — some of these are arguable, not
  clearly wrong.
- **Residual rewrite fabrication under variance:** occasional runs still surface
  a job keyword on a poor-fit CV. Next step: constrain the rewrite step to skip
  entirely when the fit score is low.
- **`usefulness` at 4.0** is the lowest judge dimension — recommendations could
  be more concrete.
