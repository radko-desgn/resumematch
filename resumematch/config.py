"""Configuration and secrets for ResumeMatch.

Loads environment from a local .env (never committed) and exposes the model
constants used across the app.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv()  # populate os.environ from .env if present

# Claude model used for scoring/gap-analysis and bullet rewriting.
# Cheap ($1/$5 per MTok) and capable enough for this task.
MODEL = "claude-haiku-4-5"

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
