"""Configuration and secrets for ResumeMatch.

Loads environment from a local .env (never committed) and exposes the model
constants used across the app.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv()  # populate os.environ from .env if present

# Claude model used for scoring/gap-analysis, bullet rewriting, and tailored CVs.
# Sonnet 5 is the accuracy/cost sweet spot for CV<->job judgment (~6c/deep scan).
# Override with ANTHROPIC_MODEL to switch (e.g. claude-haiku-4-5 to cut cost,
# or claude-opus-4-8 for max quality) without a code change.
MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5")

# Local HuggingFace embedding model for requirement <-> resume matching.
# Runs on-device via sentence-transformers; no API cost.
EMBED_MODEL = "BAAI/bge-small-en-v1.5"


def get_api_key() -> str:
    """Return the Anthropic API key, raising a clear error if it is missing."""
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        raise ValueError(
            "ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your "
            "key, or export ANTHROPIC_API_KEY in your shell."
        )
    return key
