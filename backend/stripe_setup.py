"""One-time setup: create the ResumeMatch products + prices in Stripe.

Run once per Stripe mode (test first, later live), with the matching secret key:

    STRIPE_SECRET_KEY=sk_test_... python -m backend.stripe_setup

It prints the price IDs to paste into your env:

    STRIPE_PRICE_SINGLE=price_...
    STRIPE_PRICE_HUNTER=price_...
    STRIPE_PRICE_PRO=price_...

Re-running creates fresh products/prices (Stripe has no unique constraint on
product names), so run it deliberately — once per mode is enough. Amounts and
currency come from backend/billing.py.
"""

from __future__ import annotations

import os

import stripe

from backend.billing import CURRENCY, PACKS, TAX_CODE


def main() -> None:
    key = os.environ.get("STRIPE_SECRET_KEY", "")
    if not key:
        raise SystemExit("Set STRIPE_SECRET_KEY first (use your TEST key to start).")

    stripe.api_key = key
    mode = "TEST" if "_test_" in key else "LIVE"
    print(f"Creating ResumeMatch products/prices in {mode} mode ({CURRENCY.upper()})...\n")

    lines: list[str] = []
    for pack in PACKS.values():
        product = stripe.Product.create(
            name=f"ResumeMatch — {pack.name}",
            tax_code=TAX_CODE,  # required by Managed Payments / Stripe Tax
            metadata={"pack": pack.id},
        )
        price_kwargs: dict = {
            "product": product.id,
            "unit_amount": pack.amount_cents,
            "currency": CURRENCY,
        }
        if pack.recurring:
            price_kwargs["recurring"] = {"interval": "month"}
        price = stripe.Price.create(**price_kwargs)

        amount = pack.amount_cents / 100
        suffix = "/mo" if pack.recurring else ""
        print(f"  {pack.name:<20} {amount:>6.2f} {CURRENCY.upper()}{suffix}  ->  {price.id}")
        lines.append(f"{pack.price_env}={price.id}")

    print("\nPaste these into backend/.env, then restart the API:\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
