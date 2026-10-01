---
description: Biweekly SEO run for resumematch.pro (add "ship" to deploy the fixes live)
argument-hint: "[ship] [focus, e.g. schema, AI search, speed]"
---

Use the Agent tool to run the `seo-optimizer` agent for this biweekly SEO run.
Pass it the user's arguments verbatim: "$ARGUMENTS".
If the arguments contain "ship" (or "push live" / "deploy"), the agent may merge to `main` and deploy after verification; otherwise it stops at a pushed `seo/` branch for review.
When it finishes, relay its summary: what changed, before/after numbers, whether it is live, and the report path.
