---
description: Convert a fictional/demo/sanitised ResumeMatch analysis into a privacy-safe social post (score breakdown, missing-requirement explainer, before/after bullet, etc.).
argument-hint: [result data or "make a demo" / desired format]
---

Invoke the **ig-from-result** skill (reads **resumematch-social**). Turn the
result below into a privacy-safe post: sanitise all identifying data, label it
"demo/example," never attach a job outcome, then hand off to **ig-carousel** or
**ig-reel** and finish with **ig-guardian**. If no result is provided, build a
believable labelled demo (e.g. 64%, 3 met / 2 partial / 1 missing).

Result / request: $ARGUMENTS

Example: `/instagram-from-result make a demo "why this CV scored 64%" carousel`
