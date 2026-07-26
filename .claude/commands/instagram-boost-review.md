---
description: Decide whether a ResumeMatch post should get paid promotion, from organic signals, with a test structure and stop conditions.
argument-hint: [post + organic metrics]
---

Invoke the **ig-boost** skill (reads **resumematch-social**). Evaluate the post
and metrics below using the skill's YAML: boost / do-not-boost / gather-more-data,
reasoning, objective, audience hypothesis, creative variations (one variable
each), test structure, stop conditions, success criteria. Don't auto-boost a
"Coming Soon" post; don't state Meta Ads options/benchmarks as fixed facts — say
when current external research is needed.

Input: $ARGUMENTS

Example: `/instagram-boost-review "why no replies" carousel — 120 saves, 40 shares, 8 profile visits`
