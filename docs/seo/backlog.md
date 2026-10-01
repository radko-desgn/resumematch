# SEO backlog — resumematch.pro

Maintained by the `seo-optimizer` agent (`/seo-update`). Newest priorities first; each run moves
items to its report in `reports/` when done.

## Open

- **`metadataBase` is not set** in `frontend/app/layout.tsx`: `next build` warns that OG/Twitter
  image URLs resolve to `http://localhost:3000`. Set it to `https://www.resumematch.pro` and add a
  canonical URL. (Seen 2026-10-01.)
- **No `robots.txt` or `sitemap.xml`**: `frontend/app/` has neither `robots.ts` nor `sitemap.ts`.
  (Seen 2026-10-01.)
- **First full audit not run yet**: the first run should establish the baselines (drift, PSI/CrUX,
  schema, AI-crawler access).
