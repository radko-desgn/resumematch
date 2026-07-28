/**
 * Site-wide feature flags.
 *
 * COMING_SOON puts the site in pre-launch mode: the scanner is shown but faded
 * and non-interactive, and every scan/checkout CTA is swapped for a "Follow for
 * launch" prompt. The full product code stays in place, so flipping this back to
 * off restores the live scanner, credits, and pricing exactly as before.
 *
 * Default is ON. To bring the scanner back (e.g. once the domain is ready), set
 *   NEXT_PUBLIC_COMING_SOON=false
 * in the environment (Vercel project settings), or change the fallback below.
 */
export const COMING_SOON =
  (process.env.NEXT_PUBLIC_COMING_SOON ?? "true").toLowerCase() !== "false";

/** Where every "Follow for launch" CTA points while in coming-soon mode. */
export const INSTAGRAM_URL = "https://www.instagram.com/resumematch.pro/";
