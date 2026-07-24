"use client";

import * as React from "react";
import { Session } from "@supabase/supabase-js";
import { supabase, accessToken as getAccessToken } from "./supabaseClient";

/**
 * Supabase auth for the browser.
 *
 * The publishable key is safe to ship — it is scoped by the database's
 * row-level security, and every operation that costs money is authorised by
 * the backend against the access token, never by this client.
 */

export interface AuthState {
  session: Session | null;
  email: string | null;
  /** False until the initial session lookup finishes — avoids a signed-out flash. */
  ready: boolean;
  configured: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Email a password-reset link. */
  requestPasswordReset: (email: string) => Promise<void>;
  /** Set a new password for the signed-in (or recovering) user. */
  updatePassword: (password: string) => Promise<void>;
  /** Bearer token for API calls, refreshed as needed. */
  accessToken: () => Promise<string | null>;
}

const AuthCtx = React.createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = React.useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "That email and password don't match.";
  if (m.includes("already registered")) return "That email already has an account — try signing in.";
  if (m.includes("should be at least")) return "Password must be at least 6 characters.";
  if (m.includes("for security purposes") || m.includes("rate limit"))
    return "Too many attempts — wait a minute and try again.";
  return message;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [ready, setReady] = React.useState(!supabase);

  React.useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = React.useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Accounts aren't configured.");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(friendly(error.message));
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Accounts aren't configured.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(friendly(error.message));
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    if (!supabase) throw new Error("Accounts aren't configured.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw new Error(friendly(error.message));
  }, []);

  const signOut = React.useCallback(async () => {
    await supabase?.auth.signOut();
  }, []);

  const requestPasswordReset = React.useCallback(async (email: string) => {
    if (!supabase) throw new Error("Accounts aren't configured.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(friendly(error.message));
  }, []);

  const updatePassword = React.useCallback(async (password: string) => {
    if (!supabase) throw new Error("Accounts aren't configured.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(friendly(error.message));
  }, []);

  const accessToken = React.useCallback(() => getAccessToken(), []);

  const value: AuthState = {
    session,
    email: session?.user?.email ?? null,
    ready,
    configured: Boolean(supabase),
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    requestPasswordReset,
    updatePassword,
    accessToken,
  };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
