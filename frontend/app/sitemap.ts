import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * sitemap.xml — only canonical, indexable URLs belong here. /terms and /privacy
 * are currently `noindex`, so they're left out until that changes; utility
 * routes (/reset-password, /preview/*) never belong here.
 *
 * No lastModified: a build timestamp would claim the page changed on every
 * deploy, which teaches crawlers to ignore the field.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 }];
}
