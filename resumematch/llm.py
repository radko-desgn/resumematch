"""Thin wrapper around the Anthropic SDK.

Exposes a single `structured_call` helper that returns a validated Pydantic
object using Claude's structured-outputs support (messages.parse).
"""

from __future__ import annotations

from typing import Type, TypeVar

import anthropic
from pydantic import BaseModel

from .config import MODEL, get_api_key

T = TypeVar("T", bound=BaseModel)

_client: anthropic.Anthropic | None = None


def client() -> anthropic.Anthropic:
    """Lazily construct and cache the Anthropic client."""
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=get_api_key())
    return _client


def structured_call(
    system: str,
    user: str,
    schema: Type[T],
    max_tokens: int = 8000,
) -> T:
    """Call Claude and return a schema-validated instance of `schema`.

    Uses messages.parse so the response is validated against the Pydantic model
    automatically; the model is instructed (via the prompts) to emit JSON that
    matches the schema.
    """
    response = client().messages.parse(
        model=MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user}],
        output_format=schema,
    )
    return response.parsed_output
