"""Scan history and account deletion, backed by Supabase.

Scans are saved server-side (service role) so the browser can't forge history.
Reads are filtered by user_id here as well as by RLS — defence in depth, and it
keeps the service-role queries honest.
"""

from __future__ import annotations

import os

import httpx
from fastapi import HTTPException

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY", "")

_TIMEOUT = httpx.Timeout(15.0)

# Columns returned for the list view — deliberately NOT the full analysis, so a
# history list stays small and doesn't ship every stored CV to the browser.
_LIST_COLS = "id,created_at,tier,score,verdict,summary,cv_chars,job_chars"


def _headers() -> dict:
    return {
        "apikey": SECRET_KEY,
        "Authorization": f"Bearer {SECRET_KEY}",
        "Content-Type": "application/json",
    }


def _require_config() -> None:
    if not SUPABASE_URL or not SECRET_KEY:
        raise HTTPException(503, "Accounts are not configured on this server.")


def save_scan(user_id: str, payload: dict, tier: str) -> None:
    """Persist one analysis. Never raises to the caller — a failed history
    write must not fail the scan the user actually asked for."""
    if not SUPABASE_URL or not SECRET_KEY:
        return
    score = payload.get("score") or {}
    meta = payload.get("_meta") or {}
    row = {
        "user_id": user_id,
        "tier": tier,
        "score": score.get("overall_fit_score"),
        "verdict": score.get("verdict"),
        "summary": score.get("summary"),
        "analysis": payload,
        "cv_chars": meta.get("cv_chars"),
        "job_chars": meta.get("job_chars"),
    }
    try:
        with httpx.Client(timeout=_TIMEOUT) as c:
            c.post(f"{SUPABASE_URL}/rest/v1/scans", headers=_headers(), json=row)
    except Exception:  # noqa: BLE001 — best effort
        pass


def list_scans(user_id: str, limit: int = 50) -> list[dict]:
    _require_config()
    with httpx.Client(timeout=_TIMEOUT) as c:
        r = c.get(
            f"{SUPABASE_URL}/rest/v1/scans",
            headers=_headers(),
            params={
                "user_id": f"eq.{user_id}",
                "select": _LIST_COLS,
                "order": "created_at.desc",
                "limit": str(limit),
            },
        )
    if r.status_code != 200:
        raise HTTPException(502, f"Could not read history: {r.text[:200]}")
    return r.json()


def get_scan(user_id: str, scan_id: str) -> dict:
    _require_config()
    with httpx.Client(timeout=_TIMEOUT) as c:
        r = c.get(
            f"{SUPABASE_URL}/rest/v1/scans",
            headers=_headers(),
            params={
                "user_id": f"eq.{user_id}",  # scope to the owner even with service role
                "id": f"eq.{scan_id}",
                "select": "id,created_at,tier,analysis",
            },
        )
    if r.status_code != 200:
        raise HTTPException(502, f"Could not read scan: {r.text[:200]}")
    rows = r.json()
    if not rows:
        raise HTTPException(404, "Scan not found.")
    return rows[0]


def delete_scan(user_id: str, scan_id: str) -> None:
    _require_config()
    with httpx.Client(timeout=_TIMEOUT) as c:
        r = c.delete(
            f"{SUPABASE_URL}/rest/v1/scans",
            headers=_headers(),
            params={"user_id": f"eq.{user_id}", "id": f"eq.{scan_id}"},
        )
    if r.status_code not in (200, 204):
        raise HTTPException(502, f"Could not delete scan: {r.text[:200]}")


def delete_account(user_id: str, email: str | None) -> None:
    """Delete the user and everything that hangs off them.

    Removing the auth user cascades credits and scans (foreign keys with ON
    DELETE CASCADE). free_scans is keyed by email, not user id, so it's removed
    separately — which also honours erasure of that address.
    """
    _require_config()
    with httpx.Client(timeout=_TIMEOUT) as c:
        r = c.delete(
            f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}",
            headers={"apikey": SECRET_KEY, "Authorization": f"Bearer {SECRET_KEY}"},
        )
        if r.status_code not in (200, 204):
            raise HTTPException(502, f"Could not delete account: {r.text[:200]}")
        if email:
            c.delete(
                f"{SUPABASE_URL}/rest/v1/free_scans",
                headers=_headers(),
                params={"email": f"eq.{email.strip().lower()}"},
            )
