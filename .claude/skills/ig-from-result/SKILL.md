---
name: ig-from-result
description: ResumeMatch "product result to social post" converter. Use to turn a fictional, demo, sanitised, or user-approved ResumeMatch analysis into privacy-safe social content (score breakdown, missing-requirement explainer, before/after bullet, quick-wins, anonymised case study). Read resumematch-social first.
---

# Product Result → Social Post

Turn a result into content without exposing anyone. Read **`resumematch-social`**
first.

## Inputs
a result (real+approved, or fictional/sanitised demo) · desired transformation ·
audience · CTA.

## Transformations
score-breakdown carousel · "why this CV scored 64%" explainer · missing-requirement
explainer · before/after bullet (facts preserved) · quick-wins carousel · reel
walkthrough · anonymised case study.

## Privacy sanitisation (do every time)
- Remove names, employers, dates, locations, contact details, anything identifying.
- Remove company-confidential detail from the job side.
- Never expose real CV text without explicit permission.
- Label the result **"demo / example data"** on the asset and in the caption.
- Never attach a successful job outcome (offer/interview) — we have none.

## Output
Hand off to `ig-carousel` or `ig-reel` with the sanitised, labelled result as the
proof element, then run `ig-guardian`. Include:
```yaml
source: real-approved | fictional-demo | sanitised
sanitisation_done: [names, employer, dates, cv_text, company_confidential]
label: "Demo data"
result_used: {score:, verdict:, met:, partial:, missing:, evidence_excerpt:}
handoff: ig-carousel | ig-reel
```

## Rules
- A believable demo (e.g. 64%, 3 met / 2 partial / 1 missing) is fine and honest
  when labelled; an unlabelled "real" result is not.
- The before/after bullet must keep every fact from the original; only phrasing
  and relevance change.
