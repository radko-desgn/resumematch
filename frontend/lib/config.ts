/**
 * Site-wide feature flags.
 *
 * COMING_SOON puts the site in pre-launch mode: the scanner is shown but faded
 * and non-interactive, and every scan/checkout CTA is swapped for a "Follow for
 * launch" prompt. The full product code stays in place, so flipping this back to
 * off restores the live scanner, credits, and pricing exactly as before.
 *
 * Default is now OFF (full site) so that merging this branch to main ships the
 * live scanner + payments in one step. To force the pre-launch teaser back on
 * (e.g. to delay the public launch after merging), set
 *   NEXT_PUBLIC_COMING_SOON=true
 * in the environment (Vercel project settings).
 */
export const COMING_SOON =
  (process.env.NEXT_PUBLIC_COMING_SOON ?? "false").toLowerCase() === "true";

/** Where every "Follow for launch" CTA points while in coming-soon mode. */
export const INSTAGRAM_URL = "https://www.instagram.com/resumematch.pro/";
