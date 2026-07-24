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
// Defaults for this deployment, so accounts work without any dashboard config.
// Both values are public by design: the publishable key is constrained by
// row-level security, ships inside this bundle either way, and grants nothing
// on its own — every paid action is authorised by the backend against the
// user's access token. Set the env vars to point at a different project.
const DEFAULT_URL = "https://eyrnlguyvaxjmmxinkrc.supabase.co";
const DEFAULT_KEY = "sb_publishable_1wZLYSpveCucHw22QJdSHQ_D_Wfwls0";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY;

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
