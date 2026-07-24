"""Server-side credit ledger, backed by Supabase Postgres.

This module is the *only* thing allowed to change a balance. It talks to
PostgREST with the project's secret key, so the browser can never grant or
refund itself credits — the frontend's copy of the balance is display state.

Spending goes through the SQL functions in supabase/schema.sql, which decrement
inside a single guarded UPDATE. That keeps two concurrent requests from
double-spending the last credit.
"""

from __future__ import annotations

import os

import httpx
from fastapi import HTTPException

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY", "")

EMPTY = {"scans": 0, "cvs": 0, "unlimited": False}

_TIMEOUT = httpx.Timeout(15.0)


def _headers() -> dict:
    return {
        "apikey": SECRET_KEY,
        "Authorization": f"Bearer {SECRET_KEY}",
        "Content-Type": "application/json",
    }


def _require_config() -> None:
    if not SUPABASE_URL or not SECRET_KEY:
        raise HTTPException(
            503, "Accounts are not configured on this server (missing Supabase settings)."
        )


def get_balance(user_id: str) -> dict:
    """Current balance for a user. A missing row reads as an empty balance."""
    _require_config()
    with httpx.Client(timeout=_TIMEOUT) as c:
        r = c.get(
            f"{SUPABASE_URL}/rest/v1/credits",
            headers=_headers(),
            params={"user_id": f"eq.{user_id}", "select": "scans,cvs,unlimited"},
        )
    if r.status_code != 200:
        raise HTTPException(502, f"Could not read credits: {r.text[:200]}")
    rows = r.json()
    if not rows:
        return dict(EMPTY)
    row = rows[0]
    return {
        "scans": int(row.get("scans") or 0),
        "cvs": int(row.get("cvs") or 0),
        "unlimited": bool(row.get("unlimited")),
    }


def _rpc(fn: str, payload: dict):
    _require_config()
    with httpx.Client(timeout=_TIMEOUT) as c:
        r = c.post(f"{SUPABASE_URL}/rest/v1/rpc/{fn}", headers=_headers(), json=payload)
    if r.status_code not in (200, 204):
        raise HTTPException(502, f"Credit operation failed: {r.text[:200]}")
    return r.json() if r.content else None


def spend_scan(user_id: str) -> bool:
    """Consume one scan credit. False when the balance wouldn't allow it."""
    return bool(_rpc("spend_scan", {"p_user": user_id}))


def spend_cv(user_id: str) -> bool:
    """Consume one tailored-CV credit. False when the balance wouldn't allow it."""
    return bool(_rpc("spend_cv", {"p_user": user_id}))


def grant(user_id: str, grants: dict) -> dict:
    """Apply a completed purchase, then return the new balance."""
    _rpc(
        "grant_credits",
        {
            "p_user": user_id,
            "p_scans": int(grants.get("scans", 0)),
            "p_cvs": int(grants.get("cvs", 0)),
            "p_unlimited": bool(grants.get("unlimited", False)),
        },
    )
    return get_balance(user_id)
