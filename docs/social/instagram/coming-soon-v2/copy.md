# Coming Soon carousel v2 (4 slides, A/B cover)

Produced through the ResumeMatch marketing skills: ig-strategist → ig-hooks →
ig-carousel → ig-from-result → ig-caption → ig-reviewer → ig-guardian → ig-boost,
humanized, then re-checked. Rendered via `backend/post_coming_soon_v2.py`.

## 1. Campaign angle
A good CV can still be the *wrong* CV for a specific job. Lead with that
recognition, show that different roles need different evidence, reveal that
ResumeMatch scores the fit and the gaps from your real CV, and close on the
launch. Audience: cold, English-speaking job seekers reusing one CV. Funnel:
awareness / curiosity (pre-launch). Goal: recognition + follows. CTA: Follow for
launch. Works with zero prior knowledge of the product.

## 2. Ten ranked hooks
1. **Good CV. Wrong job.** — problem statement (main cover A)
2. **Does your CV prove what this job needs?** — diagnostic question (cover B)
3. A good CV can still be the wrong CV.
4. You're not underqualified. Your CV just doesn't prove it.
5. Same CV for every job? That's the problem.
6. Your CV is good. Is it right for this role?
7. The job asks for this. Does your CV show it?
8. A strong CV isn't a universal CV.
9. Why strong candidates still get filtered out.
10. Rejected with a great CV? Here's the gap.

Main version uses #1 (problem-led). A/B variation uses #2 (diagnostic question).

## 3. Final slide copy
1. **Good CV. Wrong job.** / A strong CV can still be the wrong one for this role.
2. **Good, or right?** / One role wants SQL and dashboards. Another wants campaigns and copy. A good CV still has to prove what this role needs.
3. **Check the fit first.** / It scores your CV against the specific role, from real evidence. *(+ demo result card)*
4. **Know the gap first.** / ResumeMatch is coming soon. *(+ met/partial/missing legend + CTA)*

## 4. Image ideas (rendered in the existing brand system)
- Slide 1: editorial cover, the statement is the visual; one key word on a highlight chip.
- Slide 2: the contrast is the message; key word chipped. (Alt: two role columns, SQL/dashboards vs campaigns/copy.)
- Slide 3: the **product proof is the hero** — a compact demo score card (score + met/partial/missing rows + one fix line).
- Slide 4: conclusive summary — a met/partial/missing legend + the CTA pill; no new explanation.

## 5. Fictional demo result (slide 3) — labelled "demo"
Overall match **68%**. SQL: met · Data visualisation: met · A/B testing: partial ·
Stakeholder reporting: partial · Looker: missing. Recommendation: "Add clearer
evidence of A/B testing." Optional evidence snippet: *"Created weekly performance
reports and presented findings to internal stakeholders."* Fictional; no real
person or data.

## 6. Organic caption (~120 words)
A good CV and the *right* CV aren't the same thing. You can be genuinely strong
on paper and still be a weak match for a specific role, because every job weighs
its requirements differently. One team lives on SQL and dashboards. The next
cares most about campaigns and copy. Same CV, very different fit, and usually you
only find out after the silence.

ResumeMatch checks your CV against the exact role before you apply. It scores the
fit and shows what's met, partial, and missing, based on real evidence from your
CV, and it tailors without inventing anything you haven't done.

It's coming soon. Follow along so you catch it the day it goes live.

## 7. Paid-ad primary text (short)
A good CV can still be the wrong CV for the job. ResumeMatch scores your CV
against the specific role and shows what's met, partial, and missing, from real
evidence. Coming soon, follow to know when it's live.

## 8. Paid-ad headline
Good CV. Wrong job?

## 9. A/B cover test
- **Version A (statement):** "Good CV. Wrong job." → `coming-soon-a-01.png`
- **Version B (question):** "Does your CV prove it?" → `coming-soon-b-01.png`
- Slides 2–4 are identical.
- **Compare on swipe-through (cover → slide 2) first**, then saves and profile
  visits. Swipe-through best isolates which cover earns attention; saves/profile
  visits show which drives intent.

## 10. Boost-readiness (ig-boost)
- Problem lands on slide 1: yes.
- Understandable with no prior context: yes (reveal by slide 3, demo card).
- Proof credibility: good, and honestly labelled demo.
- CTA matches destination: yes — "Follow for launch" points at the profile, which
  exists. (Do NOT switch to "try the free check" while live analysis is mocked.)
- **Recommendation: test organically first.** Run both covers organically, watch
  swipe-through, saves, shares, profile visits, and reach within the job-seeker
  audience. Boost only the stronger cover once it shows organic pull. Test cover A
  (problem statement) first; it's the clearer cold-audience stop. Objective =
  reach/engagement or profile visits (not conversions — checkout/real analysis
  aren't live). Current Meta Ads options/benchmarks require separate verification.

## 11. Claims audit (ig-guardian): PASS
No waitlist (CTA = follow). No "live"/"try it now" claim (says "coming soon");
CTA points at the profile, which exists. Slide-3 result is labelled **demo**;
no real user, testimonial, statistic, interview, or job outcome. Requirement →
evidence, met/partial/missing, and honest tailoring are real product
capabilities. No prices shown. Tone within brand; no banned phrases.

## 12. Issues to resolve before publishing
- **Handle** — confirmed as `@resume.matches` (rendered on slide 4).
- **Keep the CTA as "Follow"** until live AI is enabled on the deploy (the live
  free check currently returns a canned demo score, so "try the free check" would
  mislead a cold audience). Flip the CTA once real analysis is on.
- Nothing else blocking; both covers passed review + guardian.

## Assets
`coming-soon-a-01..04.png`, `coming-soon-b-01..04.png` (1080×1350).
Reproduce with `python -m backend.post_coming_soon_v2`.
