"""Local embedding utilities for requirement <-> resume matching.

Uses bge-small on-device via fastembed (ONNX runtime). Same model as before,
but the ONNX runtime needs a fraction of the memory of the PyTorch stack —
which is what lets the backend fit a small (512MB) free-tier host. No
network/API call is made at match time; the model is downloaded/cached on
first load only.
"""

from __future__ import annotations

import re

import numpy as np

from .config import EMBED_MODEL
from .schemas import RequirementMatch

_model = None


def _get_model():
    """Lazily load and cache the fastembed model."""
    global _model
    if _model is None:
        from fastembed import TextEmbedding

        _model = TextEmbedding(EMBED_MODEL)
    return _model


def _encode(texts: list[str]) -> np.ndarray:
    """Embed a list of strings into a (n, dim) matrix."""
    return np.asarray(list(_get_model().embed(texts)))


def chunk_resume(text: str) -> list[str]:
    """Split a resume into candidate evidence chunks (lines / bullet fragments).

    Pure text processing — no model required.
    """
    lines = [ln.strip(" \t-*•") for ln in text.splitlines()]
    return [ln for ln in lines if len(ln) >= 8]


def extract_bullets(text: str) -> list[str]:
    """Extract resume bullet lines to feed the rewriting prompt.

    Prefers explicit bullet markers; falls back to substantive lines.
    Pure text processing — no model required.
    """
    bullets: list[str] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if re.match(r"^[-*•]\s+", line):
            bullets.append(re.sub(r"^[-*•]\s+", "", line))
        elif len(line) >= 40:  # substantive prose line, likely an achievement
            bullets.append(line)
    return bullets


def _cosine(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    a = a / (np.linalg.norm(a, axis=1, keepdims=True) + 1e-8)
    b = b / (np.linalg.norm(b, axis=1, keepdims=True) + 1e-8)
    return a @ b.T


def match_requirements(
    requirements: list[str], resume_chunks: list[str]
) -> list[RequirementMatch]:
    """Pair each requirement with its nearest resume chunk by cosine similarity."""
    if not requirements or not resume_chunks:
        return []
    req_emb = _encode(requirements)
    chunk_emb = _encode(resume_chunks)
    sims = _cosine(req_emb, chunk_emb)  # (n_req, n_chunk)
    matches: list[RequirementMatch] = []
    for i, req in enumerate(requirements):
        j = int(np.argmax(sims[i]))
        matches.append(
            RequirementMatch(
                requirement=req,
                best_chunk=resume_chunks[j],
                score=float(sims[i][j]),
            )
        )
    return matches
