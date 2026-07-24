import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Single browser Supabase client, kept in its own module so both the auth
 * context and the API layer can reach it without importing each other.
 *
 * The publishable key is meant to be public: it is constrained by row-level
 * security, and anything that costs money is authorised by the backend against
 * the access token rather than by this client.
 *
 * Null when the deployment has no Supabase configured, so the marketing site
 * and the free quick check still work without accounts.
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase: SupabaseClient | null =
  URL && KEY
    ? createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true } })
    : null;

/** Current access token, or null when signed out / not configured. */
export async function accessToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/** `Authorization` header when signed in, otherwise an empty object. */
export async function authHeaders(): Promise<Record<string, string>> {
  const token = await accessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
