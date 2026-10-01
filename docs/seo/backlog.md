# SEO backlog — resumematch.pro

Maintained by the `seo-optimizer` agent (`/seo-update`). Newest priorities first; each run moves
items to its report in `reports/` when done.

## Open

- **Header logo is served far too large.** `next/image` serves `logo-white.png` at `w=3840` (87 KB,
  `logo-black.png` likewise) for a 147×26 slot, because the `<Image>` declares the 1476×261 source
  size. Declare the display size (or `sizes`) so the srcset tops out around 2x. It's in the
  mobile LCP request chain. Impact high, effort S. (Seen 2026-10-01.)
- **PSI/CrUX unavailable.** The keyless PageSpeed Insights quota is shared and was exhausted
  (`429`). Add a Google API key to the claude-seo config to get PSI and CrUX field data every run.
  (Seen 2026-10-01.)
- **Search Console / Bing Webmaster.** Owner action: verify the domain and submit
  `https://www.resumematch.pro/sitemap.xml` once `seo/2026-10-01` is live. (Seen 2026-10-01.)
- **Social tags per page.** No `og:url`. `/terms`, `/privacy` and the utility pages inherit the home
  page's `og:title`/`og:description`. Low impact (legal pages are noindex). (Seen 2026-10-01.)
- **404 page title** is the home title. Give `not-found` its own metadata. Low. (Seen 2026-10-01.)
- **`llms.txt`** is a `404`. Optional summary for AI agents, built only from FAQ/packs facts.
  Evidence of impact is thin, so low priority. (Seen 2026-10-01.)
- **Lighthouse accessibility 97.** `.eyebrow text-white/45` on `#0A0A0A` is 4.48:1 (needs 4.5). The
  wizard step buttons have `aria-label="CV step"` while showing "1" (label-content-name-mismatch).
  This is a colour/design choice, so ask before changing. (Seen 2026-10-01.)
- **JavaScript weight.** Lighthouse: ~159 KB unused JS on the landing page, and 14 KB of legacy
  polyfills (`Array.prototype.at`, `Object.hasOwn`, …), which suggests a browserslist target. Medium
  effort. (Seen 2026-10-01.)
- **Below-the-fold reveals SSR at inline `opacity:0`** (13 framer-motion `whileInView` blocks). The
  text is still in the HTML, and Google renders JS, so this is low priority. Revisit only if
  non-JS readers matter. (Seen 2026-10-01.)
- **Possible load failure under slow conditions.** In 1 of 5 throttled local runs of `origin/main`
  (4x CPU, 1.6 Mbps), the page showed Next's "This page couldn't load" error UI. It was not seen in
  10 runs of the branch. Unverified, so investigate (chunk load timeout?). (Seen 2026-10-01.)

## Needs the owner's decision

- **Index `/terms` and `/privacy`?** Both are `noindex` with the comment "draft/placeholder — keep
  out of search for now". The legal text was finalised in `a135b53`. Indexed legal pages are a small
  trust signal. If yes: remove `robots`, add canonicals, add them to `app/sitemap.ts`. The legal
  files were not touched without asking. (Seen 2026-10-01.)

## Done

- 2026-10-01 ([report](reports/2026-10-01.md)): `metadataBase` + home canonical; `robots.ts` +
  `sitemap.ts`; `noindex` for `/reset-password` and `/preview/results`; Organization/WebSite/
  WebApplication/FAQPage JSON-LD; clean H1 text; hero paints on first frame (mobile LCP 4.87 s →
  0.81 s, emulated); first baselines (drift ids 1–3, Lighthouse, AI-crawler access).
