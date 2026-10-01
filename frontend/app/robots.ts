import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt — everything is crawlable, search and AI crawlers alike.
 *
 * Pages that shouldn't be indexed (the reset-password form, the results design
 * sandbox, and for now /terms and /privacy) say so with a `noindex` meta tag instead of a
 * Disallow here: a blocked page can't be fetched, so its noindex is never seen.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
