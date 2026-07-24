"""Input sanity checks for the CV and job-post boxes.

Why this exists: the scorer will happily analyse anything handed to it, and in
free/demo mode the score is canned — so typing keyboard mash used to produce a
confident "74% match". That reads as broken, and it teaches users the number
means nothing.

Two layers, cheapest first:

1. Structure — is this even prose? Catches keyboard mash, one word pasted a
   hundred times, and text far too short to analyse.
2. Topic — does it read like a CV / a job post? Uses the embedding model that
   is already loaded for requirement matching, so it costs nothing extra and
   needs no API call.

Thresholds are deliberately permissive. A false accept just produces a weak
analysis; a false reject blocks a real user from their own CV, which is far
worse. Anything ambiguous is allowed through.
"""

from __future__ import annotations

import re
from collections import Counter
from dataclasses import dataclass

# Permissive on purpose: a terse skills-list CV is a real CV. Junk is caught by
# the gibberish checks and the topic score below, not by demanding length.
MIN_CHARS = 100
MIN_WORDS = 15

# What each box should broadly resemble. Multiple short prototypes beat one long
# one: the comparison is a max over these, so an unusual CV only has to look
# like one facet of a CV rather than the average of all of them.
_CV_PROTOTYPES = [
    "Professional experience: senior software engineer at a technology company, "
    "responsible for building and shipping products with a team.",
    "Education: bachelor degree in computer science. Skills: programming, "
    "communication, project management. Certifications and languages.",
    "Work history and employment record with job titles, dates, achievements, "
    "responsibilities and measurable results delivered for employers.",
]
_JOB_PROTOTYPES = [
    "We are hiring for this role. You will be responsible for delivering work "
    "with our team and reporting to the manager.",
    "Requirements: several years of relevant experience, strong communication "
    "skills, and a degree or equivalent practical background.",
    "About the role, what you will do, what we are looking for, qualifications, "
    "benefits, salary range, and how to apply for this position.",
]

_LABEL = {"cv": "CV", "job": "job description"}


@dataclass
class Verdict:
    ok: bool
    reason: str = ""


def _words(text: str) -> list[str]:
    return re.findall(r"[^\W\d_]{2,}", text, flags=re.UNICODE)


def _structure_problem(text: str, kind: str) -> str | None:
    """Cheap checks that need no model. Returns a message, or None if fine."""
    label = _LABEL[kind]
    stripped = text.strip()

    if len(stripped) < MIN_CHARS:
        return (
            f"That's too short to analyse. Paste the full {label} — "
            f"at least a few sentences."
        )

    words = _words(stripped)
    if len(words) < MIN_WORDS:
        return f"That doesn't look like a complete {label}. Paste the full text."

    # Real prose is mostly letters and spaces. A wall of symbols or digits is not.
    letters = sum(ch.isalpha() or ch.isspace() for ch in stripped)
    if letters / len(stripped) < 0.6:
        return f"That doesn't read like a {label}. Paste the text of the {label}."

    # Nearly every real word contains a vowel; keyboard mash mostly doesn't.
    with_vowel = sum(bool(re.search(r"[aeiouyAEIOUYÀ-ɏ]", w)) for w in words)
    if with_vowel / len(words) < 0.55:
        return f"That looks like random characters rather than a {label}."

    # One token repeated over and over ("test test test ...").
    most_common = Counter(w.lower() for w in words).most_common(1)[0][1]
    if most_common / len(words) > 0.35:
        return f"That looks like repeated text rather than a real {label}."

    # A single enormous unbroken token is a paste error or mashing.
    if max((len(w) for w in words), default=0) > 40:
        return f"That doesn't look like readable text. Paste the {label} as plain text."

    return None


def _similarity(text: str, prototypes: list[str]) -> float:
    """Best cosine similarity between the text and any prototype."""
    import numpy as np

    from .embeddings import _encode

    vecs = _encode([text[:2000]] + prototypes)
    v = vecs[0] / (np.linalg.norm(vecs[0]) + 1e-8)
    protos = vecs[1:] / (np.linalg.norm(vecs[1:], axis=1, keepdims=True) + 1e-8)
    return float(np.max(protos @ v))


# Calibrated against real CVs/job posts vs. junk rather than guessed. Measured:
# real content scored 0.52-0.73 (a terse "Python, Docker, Senior Engineer 2020-24"
# CV scores 0.73), while word salad, a recipe and sports news scored 0.39-0.47.
# 0.48 sits in the gap. Biased low on purpose — wrongly blocking someone's real
# CV is far worse than letting a weak one through to a weak analysis.
SIMILARITY_FLOOR = 0.48


def check(text: str, kind: str, min_similarity: float = SIMILARITY_FLOOR) -> Verdict:
    """Validate one input box. `kind` is "cv" or "job"."""
    problem = _structure_problem(text, kind)
    if problem:
        return Verdict(False, problem)

    try:
        score = _similarity(text, _CV_PROTOTYPES if kind == "cv" else _JOB_PROTOTYPES)
    except Exception:  # noqa: BLE001
        return Verdict(True)  # model unavailable: never block on the optional check

    if score < min_similarity:
        # Deliberately not claiming "you pasted the other box here" — measured,
        # CVs and job posts are too semantically close to tell apart reliably.
        return Verdict(
            False,
            f"This doesn't read like a {_LABEL[kind]}. Paste the real "
            f"{_LABEL[kind]} text so the match means something.",
        )
    return Verdict(True)
