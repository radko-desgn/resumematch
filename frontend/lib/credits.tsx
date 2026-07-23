"use client";

import * as React from "react";
import { PackId, PACKS_BY_ID } from "./packs";

/**
 * Client-side credit balance, backed by localStorage.
 *
 * IMPORTANT: this is presentation state, not an entitlement. The backend does
 * not yet authenticate callers, so nothing here is a security boundary — a
 * balance in localStorage is trivially editable. Real gating lands with
 * server-side entitlement in v0.3. Until then checkout is simulated and no
 * money changes hands, so the two stay honest with each other.
 *
 * Storage is an external store, so it's read through useSyncExternalStore
 * rather than an effect: React renders the server snapshot during hydration
 * and swaps in the stored value immediately after, with no markup mismatch.
 * Subscribing to `storage` also keeps multiple tabs in agreement for free.
 */

const STORAGE_KEY = "resumematch.credits.v1";

export interface Balance {
  scans: number;
  cvs: number;
  unlimited: boolean;
}

// Stable reference: useSyncExternalStore compares snapshots by identity, so a
// fresh object here would loop forever.
const EMPTY: Balance = Object.freeze({ scans: 0, cvs: 0, unlimited: false });

function read(): Balance {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Balance>;
    return {
      scans: Math.max(0, Number(parsed.scans) || 0),
      cvs: Math.max(0, Number(parsed.cvs) || 0),
      unlimited: Boolean(parsed.unlimited),
    };
  } catch {
    return EMPTY; // corrupt or unavailable storage — start clean rather than throw
  }
}

let cache: Balance | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function getSnapshot(): Balance {
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot(): Balance {
  return EMPTY;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = read(); // another tab changed the balance
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: Balance) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode / quota — the balance just won't survive a reload */
  }
  notify();
}

const alwaysTrue = () => true;
const alwaysFalse = () => false;

interface CreditsState extends Balance {
  /** False during hydration, so counters don't flash a stale zero. */
  hydrated: boolean;
  canScan: boolean;
  canGenerateCv: boolean;
  /** Apply a completed (simulated) purchase. */
  grant: (pack: PackId) => void;
  /** Consume one scan credit. Returns false if there was nothing to spend. */
  spendScan: () => boolean;
  spendCv: () => boolean;
  reset: () => void;
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
  /** Seed a balance in memory without touching storage — used by preview pages. */
  initial?: Partial<Balance>;
}) {
  const isPreview = initial !== undefined;

  const stored = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = React.useSyncExternalStore(subscribe, alwaysTrue, alwaysFalse);
  const [preview, setPreview] = React.useState<Balance>({ ...EMPTY, ...initial });

  const balance = isPreview ? preview : stored;

  const commit = React.useCallback(
    (next: Balance) => (isPreview ? setPreview(next) : write(next)),
    [isPreview]
  );

  const grant = React.useCallback(
    (pack: PackId) => {
      const g = PACKS_BY_ID[pack]?.grants;
      if (!g) return;
      commit({
        scans: balance.scans + g.scans,
        cvs: balance.cvs + g.cvs,
        unlimited: balance.unlimited || Boolean(g.unlimited),
      });
    },
    [commit, balance]
  );

  const spendScan = React.useCallback(() => {
    if (balance.unlimited) return true;
    if (balance.scans <= 0) return false;
    commit({ ...balance, scans: balance.scans - 1 });
    return true;
  }, [commit, balance]);

  const spendCv = React.useCallback(() => {
    if (balance.unlimited) return true;
    if (balance.cvs <= 0) return false;
    commit({ ...balance, cvs: balance.cvs - 1 });
    return true;
  }, [commit, balance]);

  const reset = React.useCallback(() => commit(EMPTY), [commit]);

  const value: CreditsState = {
    ...balance,
    hydrated: isPreview || hydrated,
    canScan: balance.unlimited || balance.scans > 0,
    canGenerateCv: balance.unlimited || balance.cvs > 0,
    grant,
    spendScan,
    spendCv,
    reset,
  };

  return <CreditsCtx.Provider value={value}>{children}</CreditsCtx.Provider>;
}
