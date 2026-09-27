/**
 * Sitemap helpers for `@astrojs/sitemap` in `astro.config.ts`.
 *
 * Pages rendered with `<BaseLayout noindex>` must also be listed here so
 * they're left out of the sitemap (a sitemap should only list canonical,
 * indexable URLs). The 404 page is excluded by the integration itself.
 *
 * Relative imports only: this module is imported by `astro.config.ts`.
 */

/** Root-relative paths (no trailing slash) excluded from the sitemap. */
export const noindexPaths: readonly string[] = [
  "/styleguide",
  "/components",
  "/404",
]

/** `filter` for `sitemap()`: receives each page's absolute URL. */
export function sitemapFilter(page: string): boolean {
  const path = new URL(page).pathname.replace(/\/+$/, "") || "/"
  return !noindexPaths.some(
    (excluded) => path === excluded || path.startsWith(`${excluded}/`)
  )
}
