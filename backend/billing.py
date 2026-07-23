"""Checkout for the credit packs.

Deliberately simulated: `create_session` returns a Stripe-shaped payload
without contacting Stripe. Two reasons, both worth keeping in view:

  1. No money should move while the app is a portfolio demo.
  2. More importantly, the paid endpoints (/api/analyze?full=true,
     /api/tailored-cv) are unauthenticated. Anyone can call them directly and
     get a full analysis for nothing. Charging for access that isn't actually
     gated would be selling something we don't deliver. Real Stripe belongs
     *after* server-side entitlement (v0.3), not before.

When that lands, `create_session` is the only function that changes:

    session = stripe.checkout.Session.create(
        mode="subscription" if pack.recurring else "payment",
        line_items=[{"price": pack.stripe_price_id, "quantity": 1}],
        success_url=..., cancel_url=...,
    )
    return {"simulated": False, "url": session.url, "session_id": session.id}

...and credits get granted by the `checkout.session.completed` webhook against
a real user record, rather than echoed back to the client.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Pack:
    id: str
    name: str
    amount_cents: int
    recurring: bool = False
    #: what a completed purchase adds to the balance
    grants: dict = field(default_factory=dict)


# Mirrors frontend/lib/packs.ts. Amounts are the source of truth for what
# would be charged; the frontend copy is display only.
PACKS: dict[str, Pack] = {
    "single": Pack("single", "Single Scan Pass", 399, grants={"scans": 1, "cvs": 0}),
    "hunter": Pack("hunter", "Job Hunter Pack", 999, grants={"scans": 6, "cvs": 1}),
    "pro": Pack("pro", "Pro Career Pass", 1999, recurring=True,
                grants={"scans": 0, "cvs": 0, "unlimited": True}),
}


def create_session(pack_id: str) -> dict:
    """Return a Stripe-Checkout-shaped session for `pack_id`.

    Raises KeyError if the pack is unknown, so the caller can map it to a 404.
    """
    pack = PACKS[pack_id]
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
