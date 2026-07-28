"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCredits } from "@/lib/credits";
import { cn } from "@/lib/utils";

/**
 * Handles the return from Stripe Checkout.
 *
 * Stripe sends the browser back to `/?checkout=success` (or `=cancel`). Credits
 * are granted server-side by the webhook, which can land a beat after the
 * redirect, so on success we re-read the balance a few times over several
 * seconds to let it catch up. The query param is stripped either way so a
 * refresh doesn't re-trigger the banner.
 */
type State = null | "success" | "cancel";

export function CheckoutReturn() {
  const { refresh } = useCredits();
  const [state, setState] = useState<State>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("checkout");
    if (status !== "success" && status !== "cancel") return;

    // Clean the URL so a reload doesn't show this again.
    params.delete("checkout");
    const qs = params.toString();
    window.history.replaceState({}, "", window.location.pathname + (qs ? `?${qs}` : ""));

    // Syncing with the URL (an external system unavailable during SSR) on mount
    // is exactly what this effect is for; the one-time set is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(status);

    if (status === "success") {
      // Poll the balance while the webhook fulfills the purchase.
      let tries = 0;
      refresh();
      const timer = setInterval(() => {
        tries += 1;
        refresh();
        if (tries >= 5) clearInterval(timer);
      }, 1500);
      const hide = setTimeout(() => setState(null), 9000);
      return () => {
        clearInterval(timer);
        clearTimeout(hide);
      };
    }
  }, [refresh]);

  if (!state) return null;

  const success = state === "success";
  return (
    <div className="fixed inset-x-0 top-4 z-[80] flex justify-center px-4" role="status" aria-live="polite">
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border bg-[#0A0A0A] px-5 py-3 text-sm text-white shadow-2xl",
          success ? "border-met/40" : "border-white/15"
        )}
      >
        <span
          className={cn("size-2 shrink-0 rounded-full", success ? "bg-met" : "bg-white/40")}
          aria-hidden
        />
        <span>
          {success
            ? "Payment successful — your credits are being added to your account."
            : "Checkout canceled. No charge was made."}
        </span>
        <button
          className="ml-1 inline-flex size-6 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Dismiss"
          onClick={() => setState(null)}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
