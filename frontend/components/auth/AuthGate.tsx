"use client";

import * as React from "react";
import { AuthModal } from "./AuthModal";

/**
 * Hosts the single sign-in modal and lets anything below it ask for a session.
 *
 * One shared modal rather than one per call site, so the CV and job text the
 * user has already typed survive the prompt — signing in never navigates away.
 */
interface AuthGateState {
  /** Open the sign-in modal, optionally explaining why it appeared. */
  promptSignIn: (reason?: string) => void;
}

const Ctx = React.createContext<AuthGateState | null>(null);

export function useAuthGate() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useAuthGate must be used within AuthGateProvider");
  return ctx;
}

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState<string | undefined>();

  const promptSignIn = React.useCallback((why?: string) => {
    setReason(why);
    setOpen(true);
  }, []);

  const value = React.useMemo(() => ({ promptSignIn }), [promptSignIn]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <AuthModal open={open} onClose={() => setOpen(false)} reason={reason} />
    </Ctx.Provider>
  );
}
