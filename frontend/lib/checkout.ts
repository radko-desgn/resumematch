import { PackId } from "./packs";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface CheckoutSession {
  simulated: boolean;
  session_id: string;
  /** Live sessions send the browser here; simulated ones are null. */
  url: string | null;
  pack: PackId;
  name: string;
  amount_cents: number;
  recurring: boolean;
  grants: { scans: number; cvs: number; unlimited?: boolean };
}

/**
 * Start checkout for a pack.
 *
 * Returns the session rather than acting on it, so the caller decides: a live
 * session gets a redirect to `url`, a simulated one gets credits applied
 * locally. That keeps the redirect path already written for when Stripe lands.
 */
export async function startCheckout(pack: PackId): Promise<CheckoutSession> {
  const res = await fetch(`${API}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pack }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || "Could not start checkout");
  return body as CheckoutSession;
}
