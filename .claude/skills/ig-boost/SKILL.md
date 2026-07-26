---
name: ig-boost
description: ResumeMatch paid-promotion (boost) candidate evaluator. Use to decide whether a post should get paid spend, based on organic signals, with a test structure and stop conditions. Read resumematch-social first. Does not invent platform benchmarks.
---

# ResumeMatch Boost Candidate Evaluator

Decide boost / don't boost / gather more data — from real organic signals, never
from vanity likes. Read **`resumematch-social`** first.

## Principle
Test organically before paying. A boost candidate generally has: a strong organic
hook, the intended job-seeker audience, saves/shares/profile-visits/qualified
clicks, value without heavy context, and a landing destination that matches the
promise (given the state table, that destination is currently the Instagram
profile / "follow", not a purchase or waitlist).

## Inputs
the post · organic metrics (saves, shares, qualified comments, profile visits,
link clicks, watch time / reel completion, reach by audience) · campaign objective.

## Output
```yaml
decision: boost | do-not-boost | gather-more-data
reasoning:
campaign_objective:
audience_hypothesis:
creative_variations:   # 2-3, change ONE variable each
test_structure:        # what to run, one variable at a time
stop_conditions:
success_criteria:
```

## Rules
- Do not auto-recommend boosting a "Coming Soon" post.
- Do not state current Meta Ads options/benchmarks as timeless fact — when
  benchmark or targeting specifics are needed, say explicitly that current
  external research against Meta's latest options is required.
- Match the objective to the real goal (reach/engagement now, not conversions,
  since checkout and real analysis aren't live).
