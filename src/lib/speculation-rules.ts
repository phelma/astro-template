/**
 * Speculation Rules, enabled by `siteConfig.speculationRules`. BaseLayout
 * renders this as an inline <script type="speculationrules"> and
 * `src/lib/csp.ts` hashes it for CSP.
 *
 * Chromium prerenders same-origin page links on hover or pointerdown
 * ("moderate"). Links to files (a "." in the path, e.g. /llms.txt), links
 * opted out of prefetch (data-astro-prefetch="false") and rel="nofollow"
 * links are skipped. Other browsers ignore the rules; Astro's hover prefetch
 * (`prefetch` in astro.config.ts) still covers them.
 *
 * Before adding analytics, fire page views on `prerenderingchange` when
 * `document.prerendering` is true, or every prerender counts as a visit.
 *
 * Relative imports only: this module is imported by `astro.config.ts`.
 */
export const speculationRules = JSON.stringify({
  prerender: [
    {
      where: {
        and: [
          { href_matches: "/*" },
          { not: { href_matches: "/*.*" } },
          {
            not: {
              selector_matches:
                '[data-astro-prefetch="false"], [rel~="nofollow"]',
            },
          },
        ],
      },
      eagerness: "moderate",
    },
  ],
})
