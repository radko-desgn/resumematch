"""Supabase authentication for the API.

Access tokens are verified against Supabase's *public* JWKS (ES256), so the
backend never needs the project's JWT secret — only the public keys, fetched
once and cached. A request is authenticated by sending the Supabase access
token as `Authorization: Bearer <token>`.

Two dependencies are exported:
    optional_user  -> user id or None   (endpoints that also serve anonymous)
    require_user   -> user id, else 401 (endpoints that cost credits)
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Optional

from fastapi import Header, HTTPException

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")


def _jwks_url() -> str:
    return f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"


@lru_cache(maxsize=1)
def _jwk_client():
    """Cached JWKS client. PyJWT handles key rotation and per-kid caching."""
    from jwt import PyJWKClient

    if not SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not set")
    return PyJWKClient(_jwks_url())


def _decode(token: str) -> dict:
    import jwt

    signing_key = _jwk_client().get_signing_key_from_jwt(token).key
    return jwt.decode(
        token,
        signing_key,
        algorithms=["ES256", "RS256"],
        audience="authenticated",
        options={"require": ["exp", "sub"]},
    )


def _user_id_from_header(authorization: Optional[str]) -> Optional[str]:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    if not token:
        return None
    try:
        return _decode(token).get("sub")
    except Exception:
        # Expired, malformed, or wrong signature — all mean "not signed in".
        # Deliberately not distinguished, so this can't be used as an oracle.
        return None


def optional_user(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """User id when a valid token is present, else None. Never raises."""
    return _user_id_from_header(authorization)


def require_user(authorization: Optional[str] = Header(None)) -> str:
    """User id, or 401. Use on anything that grants or spends credits."""
    user_id = _user_id_from_header(authorization)
    if not user_id:
        raise HTTPException(401, "Sign in to use this feature.")
    return user_id


def is_configured() -> bool:
    return bool(SUPABASE_URL and os.environ.get("SUPABASE_SECRET_KEY"))
