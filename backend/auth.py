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

import logging
import os
from functools import lru_cache
from typing import Optional

from fastapi import Header, HTTPException

log = logging.getLogger("resumematch.auth")

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
    except Exception as exc:  # noqa: BLE001
        # Callers always just see "not signed in" — the reason is never leaked
        # to the client, so this can't be used as an oracle. But it IS logged,
        # because a misconfigured server (unreachable JWKS, missing crypto
        # backend) is indistinguishable from a bad token without it.
        log.warning("token rejected: %s: %s", type(exc).__name__, exc)
        return None


def selftest() -> dict:
    """Config diagnostics for /api/health. Touches only public information."""
    info: dict = {"url_set": bool(SUPABASE_URL), "secret_set": bool(os.environ.get("SUPABASE_SECRET_KEY"))}
    try:
        import jwt  # noqa: F401
        from jwt import PyJWKClient  # noqa: F401

        info["pyjwt"] = True
    except Exception as exc:  # noqa: BLE001
        info["pyjwt"] = f"{type(exc).__name__}: {exc}"
        return info
    try:
        from cryptography.hazmat.primitives.asymmetric import ec  # noqa: F401

        info["crypto"] = True
    except Exception as exc:  # noqa: BLE001
        info["crypto"] = f"{type(exc).__name__}: {exc}"
    # The configured URL is public information, so echoing it back is safe and
    # is the fastest way to catch a typo'd env var.
    info["jwks_url"] = _jwks_url()

    # Separate "hostname is wrong" from "this container has no DNS at all".
    import socket
    from urllib.parse import urlparse

    host = urlparse(SUPABASE_URL).hostname if SUPABASE_URL else None
    for label, target in (("dns_supabase", host), ("dns_control", "pypi.org")):
        if not target:
            info[label] = "no host in SUPABASE_URL"
            continue
        try:
            socket.getaddrinfo(target, 443)
            info[label] = f"{target} resolves"
        except Exception as exc:  # noqa: BLE001
            info[label] = f"{target}: {type(exc).__name__}: {exc}"

    try:
        keys = _jwk_client().get_signing_keys()
        info["jwks"] = f"{len(keys)} key(s)"
    except Exception as exc:  # noqa: BLE001
        info["jwks"] = f"{type(exc).__name__}: {exc}"
    return info


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
