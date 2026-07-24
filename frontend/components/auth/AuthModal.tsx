"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Lock, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Sign in / create account.
 *
 * Deliberately a modal rather than a page: signing in is always something you
 * do *in the middle of* buying or scanning, and a route change would throw away
 * the CV and job text the user already pasted into the wizard.
 */
export function AuthModal({
  open,
  onClose,
  reason,
}: {
  open: boolean;
  onClose: () => void;
  /** Why the prompt appeared, e.g. "Deep analysis costs 1 credit." */
  reason?: string;
}) {
  const { signIn, signUp, signInWithGoogle, configured } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Close and drop any stale error, so reopening starts clean. */
  const close = React.useCallback(() => {
    setError(null);
    onClose();
  }, [onClose]);

  // Escape to dismiss, and don't let the page scroll behind the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signup") await signUp(email.trim(), password);
      else await signIn(email.trim(), password);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={mode === "signup" ? "Create account" : "Sign in"}
            className="fixed left-1/2 top-1/2 z-[90] w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-2xl"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full hover:bg-foreground/5"
            >
              <X className="size-4" />
            </button>

            <h2 className="font-display text-xl">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {reason || "Sign in to buy and spend credits."}
            </p>

            {!configured ? (
              <p className="mt-5 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
                Accounts aren&apos;t configured on this deployment yet.
              </p>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 w-full"
                  onClick={() => signInWithGoogle().catch((e) => setError(e.message))}
                >
                  <GoogleMark /> Continue with Google
                </Button>

                <div className="my-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">or</span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <form onSubmit={submit} className="space-y-3">
                  <Input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    required
                    minLength={6}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    placeholder="Password (6+ characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-xs text-missing">{error}</p>}
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
                    {mode === "signup" ? "Create account" : "Sign in"}
                  </Button>
                </form>

                <button
                  type="button"
                  onClick={() => { setError(null); setMode(mode === "signup" ? "signin" : "signup"); }}
                  className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  {mode === "signup"
                    ? "Already have an account? Sign in"
                    : "New here? Create an account"}
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4h6.6c-.1 1.1-.9 2.8-2.5 3.9l3.9 3c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5l-3.9 3C3.4 21.3 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4l-4-3C.5 8.3 0 10.1 0 12s.5 3.7 1.3 5.3l4-2.9z" />
      <path fill="#EA4335" d="M12 4.7c2.2 0 3.7.9 4.5 1.7l3.4-3.3C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.3 6.7l4 3c.9-2.9 3.6-5 6.7-5z" />
    </svg>
  );
}
