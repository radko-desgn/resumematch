"use client";

import * as React from "react";
import { PackId } from "./packs";
import { getCredits, buyPack } from "./api";
import { useAuth } from "./auth";

/**
 * Credit balance, read from the server.
 *
 * This is a *cache* of the authoritative balance in Postgres, kept here so the
 * header badge and the gates can render without a round trip. It is never the
 * thing that decides whether an action is allowed — the backend re-checks and
 * spends on every paid call, so editing this in devtools buys nothing.
 */

export interface Balance {
  scans: number;
  cvs: number;
  unlimited: boolean;
}

const EMPTY: Balance = { scans: 0, cvs: 0, unlimited: false };

interface CreditsState extends Balance {
  /** False until the first fetch settles, so counters don't flash a stale zero. */
  hydrated: boolean;
  signedIn: boolean;
  canScan: boolean;
  canGenerateCv: boolean;
  /** Re-read the balance from the server (after a spend, say). */
  refresh: () => Promise<void>;
  /** Run checkout for a pack; resolves with the new balance. */
  purchase: (pack: PackId) => Promise<Balance>;
}

const CreditsCtx = React.createContext<CreditsState | null>(null);

export function useCredits() {
  const ctx = React.useContext(CreditsCtx);
  if (!ctx) throw new Error("useCredits must be used within CreditsProvider");
  return ctx;
}

export function CreditsProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  /** Seed a balance without contacting the server — used by preview pages. */
  initial?: Partial<Balance>;
}) {
  const isPreview = initial !== undefined;
  const { session, ready } = useAuth();
  const signedIn = Boolean(session);

  const [preview] = React.useState<Balance>({ ...EMPTY, ...initial });
  const [fetched, setFetched] = React.useState<Balance | null>(null);

  // Signed-out is *derived*, not stored. Keeping it out of state means the
  // effect below never has to setState synchronously just to clear a balance,
  // and a sign-out can't leave a stale number on screen.
  const balance: Balance = isPreview ? preview : signedIn ? fetched ?? EMPTY : EMPTY;
  const hydrated = isPreview || !signedIn || fetched !== null;

  const refresh = React.useCallback(async () => {
    if (isPreview || !signedIn) return;
    try {
      setFetched(await getCredits());
    } catch {
      setFetched(EMPTY); // token expired mid-flight, or the API is unreachable
    }
  }, [isPreview, signedIn]);

  // Re-read whenever the session changes (sign in, sign out, token refresh).
  // The request is fired here rather than delegated to refresh() so the state
  // update lands in the promise continuation, and so a response that arrives
  // after the session changed again can be discarded instead of overwriting
  // the newer balance.
  React.useEffect(() => {
    if (!ready || !signedIn) return;
    let cancelled = false;
    getCredits()
      .then((b) => !cancelled && setFetched(b))
      .catch(() => !cancelled && setFetched(EMPTY));
    return () => {
      cancelled = true;
    };
  }, [ready, signedIn]);

  const purchase = React.useCallback(async (pack: PackId) => {
    const session = await buyPack(pack);
    if (session.url) {
      window.location.href = session.url; // a live Stripe session would land here
      return EMPTY;
    }
    const next = session.balance ?? EMPTY;
    setFetched(next);
    return next;
  }, []);

  const value: CreditsState = {
    ...balance,
    hydrated,
    signedIn: isPreview ? true : signedIn,
    canScan: balance.unlimited || balance.scans > 0,
    canGenerateCv: balance.unlimited || balance.cvs > 0,
    refresh,
    purchase,
  };

  return <CreditsCtx.Provider value={value}>{children}</CreditsCtx.Provider>;
}
