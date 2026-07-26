---
name: ig-caption
description: ResumeMatch Instagram caption writer. Use to write a concise caption that supports (not repeats) the creative, plus a short and a founder-voice alternative, hashtags, and an accessibility description. Read resumematch-social first; run humanizer after.
---

# ResumeMatch Caption Writer

Captions that add to the creative rather than restate it. Read
**`resumematch-social`** first. Compose with the installed `copywriting` skill if
useful; finish with `humanizer`.

## Inputs
the creative it supports (carousel/reel + hook) · audience · goal · CTA.

## Structure
strong first line · short relatable situation or insight · useful explanation ·
natural product connection · one CTA. Default 150–220 words.

## Output
```yaml
primary_caption:
short_alt:            # ~1-2 sentences
founder_voice_alt:    # first-person, repo-true facts only
hashtags:             # separate block, 6-10, relevant not spammy
alt_text:             # when the post needs an accessibility description
```

## Rules
- One primary CTA (default "Follow for launch" per the state table).
- No fabricated proof, no invented founder anecdotes, no emoji spam.
- Don't repeat the slide headlines verbatim; extend the thought.
- Never "join the waitlist"; never imply live paid/real-analysis features.
