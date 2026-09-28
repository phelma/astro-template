# Ideas

Possible future improvements, deliberately left out of the base template.

## Quality and testing

- **CI (GitHub Actions)**: run `format:check`, `lint`, `check` and `build` on every PR so regressions never reach `main`.
- **Playwright smoke tests**: load every page, assert title/description/canonical/OG/JSON-LD, one `<h1>`, and no theme flash (FOUC) when a stored dark mode or theme loads.
- **axe accessibility tests**: run `@axe-core/playwright` on each page in each theme and mode to catch contrast and ARIA regressions.
- **Lighthouse CI**: budget performance, SEO and accessibility scores per PR.

## Features

- **Contact form**: post to an external form service or a Cloudflare Worker, with a honeypot field.
- **Blog content collection**: Markdown/MDX posts with RSS (`@astrojs/rss`) and `Article` / `BlogPosting` JSON-LD.
- **i18n**: Astro's i18n routing with `hreflang` alternates and per-locale config.
- **Generated OG images**: per-page social cards with satori at build time, reading theme fonts via `experimental_getFontFileURL`.
- **Cookieless analytics**: Cloudflare Web Analytics; add a consent banner only if something sets cookies; honour `Sec-GPC` and publish `/.well-known/gpc.json` if anything is sold or shared.
- **Service worker / offline page**: offline fallback and asset precaching for repeat visits.

## SEO and agents

- **IndexNow**: ping search engines with changed URLs on deploy for faster re-crawling.
- **Markdown content negotiation**: serve the `.md` copy for `Accept: text/markdown` requests to the HTML URL (needs a Worker; add `Vary: Accept`).
- **Auto-derive `noindexPaths`**: collect `noindex` pages at build time so the sitemap can't drift from page props.

## Security

- **HSTS preload**: add `preload` and submit to hstspreload.org once every subdomain is HTTPS-only.
- **CAA and DNSSEC**: restrict which CAs can issue certificates and sign DNS records (DNS settings, outside the repo).

## Build and deploy

- **`SITE_URL` env override**: set `site` from the environment so preview and orchestrated deploys get correct canonical/OG URLs.
- **Orchestrator-managed Wrangler config**: generate `wrangler.jsonc` per environment (name, routes, `not_found_handling`) instead of committing one.
- **Drop the unused `@astrojs/react` client bundle**: remove the React runtime chunk from `dist/_astro/` when no island is hydrated, to trim deploy size.
