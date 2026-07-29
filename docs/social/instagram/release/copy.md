# Launch / "RELEASED" — carousel + reel

A distinct launch look (green bookends + left-aligned poster type + a giant
"RELEASED"), deliberately different from the black centered coming-soon set, with
a hard push on the **free scan**. Product is live at resumematch.pro, so the CTA
is the real free check. Rendered via `backend/post_release.py` (carousel) and
`backend/post_release_reel.py` (reel).

## Carousel (4 slides — `release-01..04.png`, 1080×1350)
1. **GREEN cover** — "The wait is over" → **It's RELEASED.** / The CV-to-job scanner is live.
2. Black — "No account. No catch." → **Your first scan is free.** / Paste your CV and a job post. See your fit in ~15 seconds.
3. Black — "What you get" → **Met, partial, missing.** *(+ labelled demo result card)*
4. **GREEN CTA** — "It's live · free to try" → **Scan your CV free.** → resumematch.pro · @resumematch.pro

### Carousel caption (~110 words)
It's released. ResumeMatch is live — and your first scan is free.

Paste your CV and a job post and see how you actually stack up against that exact role: a real match score, every requirement marked met, partial, or missing, and the evidence behind each one pulled straight from your CV. Nothing invented.

No account, no catch. It takes about 15 seconds.

Try it free: resumematch.pro

**Short:** ResumeMatch is released — and your first scan is free. See how your CV fits a specific job before you apply. resumematch.pro

**Hashtags:** #jobsearch #resumetips #careeradvice #jobhunting #cv #jobseekers #ats

## Reel (`release-reel.mp4`, 1080×1920, 9:16, ~15s, 30fps)
Green open + close, black middle — the same launch identity as the carousel.
- **0–3s** GREEN: *The wait is over* → **It's RELEASED.**
- **3–6s** Black: **Your first scan is free.** / No account. No catch.
- **6–10s** Black: *See the fit · example* → **68%** + SQL met · A/B testing partial · Looker missing (labelled example)
- **10–15s** GREEN: *Now live · free to try* → **Scan your CV free.** → resumematch.pro · @resumematch.pro

### Reel caption
It's released — and your first scan is free. See how your CV fits a specific job before you apply: met, partial, and missing, from real evidence. Try it → resumematch.pro

**Hashtags:** #jobsearch #resumetips #jobhunting #cv #careeradvice #jobseekers

**Audio:** add a subtle upbeat trending track in the IG app on upload (visuals are muted-friendly; keep it low-key, on brand).

## Boost plan (ig-boost) — real destination now
- **Reel first** (Reels get the most reach). Objective: **Traffic** → resumematch.pro. ~€5–8/day, 4–5 days. Placement: **Reels + Stories** (9:16).
- **Carousel** as the feed companion. Objective: Traffic; placement feed + Explore.
- Audience: job seekers, 22–45, interests LinkedIn / Indeed / Résumé / Career / Job interview; English-speaking (paying markets: UK / Ireland / Australia / Canada). Keep same-cost country clusters together.
- Track: **link clicks + landings on resumematch.pro + free scans run** (there's a real product now, not just profile visits).

## Claims audit (ig-guardian): PASS
- "Released / live / free scan" are all accurate — the product and the free quick check are live.
- No waitlist. No invented users, testimonials, statistics, or outcomes.
- The 68% + met/partial/missing is an **example**, labelled in both the carousel (demo card) and the reel (eyebrow "example").
- Requirement→evidence and met/partial/missing are real capabilities. Handle is the real @resumematch.pro. No banned phrases; no em dashes in captions.

## Reproduce
`python -m backend.post_release` · `python -m backend.post_release_reel`
