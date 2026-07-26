---
description: End-to-end ResumeMatch Instagram campaign — orchestrates strategy, hooks, creative, captions, review, guardian, humanize, and a calendar into a production-ready package.
argument-hint: [campaign goal / length / audience]
---

Invoke the **ig-campaign** orchestrator skill (reads **resumematch-social**). Run
the full workflow for the request below: verify product state, generate and rank
concepts (**ig-strategist**), hooks (**ig-hooks**), creative (**ig-carousel** /
**ig-reel**, using **ig-from-result** for proof), captions (**ig-caption**),
review (**ig-reviewer**), **humanizer**, then the **ig-guardian** gate, and a
calendar (**ig-calendar**). Return one production-ready package. Use
`[PLACEHOLDER]` for missing info; never invent claims. Optionally render ready
carousels via `backend/carousel.py`.

Request: $ARGUMENTS

Example: `/instagram-launch-campaign 2-week pre-launch campaign for job seekers`
