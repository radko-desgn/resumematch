"""Checkout for the credit packs — real Stripe when configured, else simulated.

Real mode turns on when STRIPE_SECRET_KEY and the per-pack price IDs are set.
Then `create_session` opens a Stripe Checkout Session (hosted by Stripe, so we
never touch card data) and returns its URL. Credits are granted only after
Stripe confirms payment, through the `checkout.session.completed` webhook — see
`parse_webhook` here and `/api/stripe/webhook` in main.py.

Without those env vars it falls back to the simulated session (url=None), which
keeps local dev and the portfolio demo working with no Stripe account: the
caller grants credits immediately in that case.

Server-side entitlement is already in place (the paid endpoints require auth and
spend a credit), so charging maps to access we actually deliver.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field

import stripe


@dataclass(frozen=True)
class Pack:
    id: str
    name: str
    amount_cents: int
    recurring: bool = False
    #: what a completed purchase adds to the balance
    grants: dict = field(default_factory=dict)
    #: name of the env var holding this pack's Stripe Price ID (test or live)
    price_env: str = ""


# Mirrors frontend/lib/packs.ts. `amount_cents` is what stripe_setup.py charges
# when it creates the prices; the frontend copy is display only.
PACKS: dict[str, Pack] = {
    "single": Pack("single", "Single Scan Pass", 399, grants={"scans": 1, "cvs": 0},
                   price_env="STRIPE_PRICE_SINGLE"),
    "hunter": Pack("hunter", "Job Hunter Pack", 999, grants={"scans": 6, "cvs": 1},
                   price_env="STRIPE_PRICE_HUNTER"),
    "pro": Pack("pro", "Pro Career Pass", 1999, recurring=True,
                grants={"scans": 0, "cvs": 0, "unlimited": True},
                price_env="STRIPE_PRICE_PRO"),
}

#: Currency the prices are created and charged in (the Stripe account is EUR).
CURRENCY = os.environ.get("STRIPE_CURRENCY", "eur")

#: Stripe product tax code. Required by Managed Payments / Stripe Tax so VAT is
#: computed correctly. Default is "General - Electronically Supplied Services",
#: the right bucket for a digital analysis service. Override via STRIPE_TAX_CODE.
TAX_CODE = os.environ.get("STRIPE_TAX_CODE", "txcd_10000000")


def _secret() -> str:
    return os.environ.get("STRIPE_SECRET_KEY", "")


def _price_id(pack: Pack) -> str:
    return os.environ.get(pack.price_env, "")


def stripe_enabled() -> bool:
    """True when a secret key and every pack's price ID are configured."""
    return bool(_secret()) and all(_price_id(p) for p in PACKS.values())


def _grants_meta(grants: dict) -> dict:
    # Stripe metadata values must be strings.
    return {
        "scans": str(int(grants.get("scans", 0))),
        "cvs": str(int(grants.get("cvs", 0))),
        "unlimited": "true" if grants.get("unlimited") else "false",
    }


def _simulated(pack: Pack) -> dict:
    return {
        "simulated": True,
        "session_id": f"cs_test_simulated_{pack.id}",
        "url": None,  # a live session would send the browser here
        "pack": pack.id,
        "name": pack.name,
        "amount_cents": pack.amount_cents,
        "recurring": pack.recurring,
        "grants": pack.grants,
    }


def create_session(pack_id: str, user_id: str, success_url: str, cancel_url: str) -> dict:
    """Create a checkout session for `pack_id` on behalf of `user_id`.

    Returns a payload with a hosted `url` when Stripe is configured, or a
    simulated one (url=None) otherwise. Raises KeyError for an unknown pack.
    """
    pack = PACKS[pack_id]

    if not stripe_enabled():
        return _simulated(pack)

    stripe.api_key = _secret()
    params: dict = {
        "mode": "subscription" if pack.recurring else "payment",
        "line_items": [{"price": _price_id(pack), "quantity": 1}],
        "success_url": success_url,
        "cancel_url": cancel_url,
        "client_reference_id": user_id,
        # The webhook reads these back to know who to credit and with what.
        "metadata": {"user_id": user_id, "pack": pack.id, **_grants_meta(pack.grants)},
        "allow_promotion_codes": True,
    }
    if pack.recurring:
        # Stamp the same metadata on the subscription so future renewal/cancel
        # webhooks can still resolve the user.
        params["subscription_data"] = {"metadata": {"user_id": user_id, "pack": pack.id}}

    session = stripe.checkout.Session.create(**params)
    return {
        "simulated": False,
        "session_id": session.id,
        "url": session.url,
        "pack": pack.id,
        "name": pack.name,
        "amount_cents": pack.amount_cents,
        "recurring": pack.recurring,
        "grants": pack.grants,
    }


def parse_webhook(payload: bytes, sig_header: str) -> dict | None:
    """Verify a Stripe webhook and extract a fulfillment for it.

    Returns {"event_id", "user_id", "grants"} for a completed, paid checkout, or
    None for events we don't act on. Raises ValueError when the signature or the
    webhook secret is missing/invalid, so the caller can return a 400.
    """
    secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
    if not secret:
        raise ValueError("Stripe webhook secret is not configured")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, secret)
    except Exception as exc:  # noqa: BLE001 — signature error or malformed body
        raise ValueError(f"Invalid webhook signature: {exc}")

    if event["type"] != "checkout.session.completed":
        return None  # renewals/cancellations handled separately (future work)

    # event["data"]["object"] is a StripeObject: it supports item access but not
    # dict.get, and dict() conversion misbehaves, so read fields defensively.
    session = event["data"]["object"]

    def sfield(obj, key, default=None):
        try:
            return obj[key]
        except (KeyError, TypeError):
            return default

    if sfield(session, "payment_status") not in ("paid", "no_payment_required"):
        return None

    meta = sfield(session, "metadata")
    user_id = sfield(meta, "user_id") or sfield(session, "client_reference_id")
    if not user_id:
        return None

    grants = {
        "scans": int(sfield(meta, "scans", 0) or 0),
        "cvs": int(sfield(meta, "cvs", 0) or 0),
        "unlimited": sfield(meta, "unlimited") == "true",
    }
    return {"event_id": event["id"], "user_id": user_id, "grants": grants}
