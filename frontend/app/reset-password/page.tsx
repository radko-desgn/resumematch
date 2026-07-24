"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Lock } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Set a new password.
 *
 * Serves two arrivals with the same form:
 *   * from the emailed reset link — supabase-js reads the recovery token out
 *     of the URL on load and establishes a session, so updateUser() just works;
 *   * from a signed-in user who wants to change their password.
 *
 * If neither applies there is no session, so the form explains that instead of
 * failing on submit.
 */
function ResetForm() {
  const { session, ready, updatePassword, email } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await updatePassword(password);
      setDone(true);
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-16">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to ResumeMatch
      </Link>

      <h1 className="font-display text-2xl">Set a new password</h1>

      {!ready ? (
        <p className="mt-3 text-sm text-muted-foreground">Checking your link…</p>
      ) : done ? (
        <div className="mt-5 rounded-2xl border border-border p-5">
          <p className="flex items-center gap-2 text-sm">
            <Check className="size-4 text-met" /> Password updated.
          </p>
          <Button asChild className="mt-4 w-full">
            <Link href="/">Continue to ResumeMatch</Link>
          </Button>
        </div>
      ) : !session ? (
        <div className="mt-5 rounded-2xl border border-border p-5">
          <p className="text-sm text-muted-foreground">
            This reset link is invalid or has expired. Request a new one from the sign-in
            window, or sign in and change your password from here.
          </p>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link href="/">Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {email ? `Signed in as ${email}.` : "Choose a new password for your account."}
          </p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <Input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="New password (6+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Repeat new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {error && <p className="text-xs text-missing">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
              Update password
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthProvider>
      <ResetForm />
    </AuthProvider>
  );
}
