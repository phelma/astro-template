# Reference

What the template gives you out of the box, and why. For making a site from it see [`new-site.md`](new-site.md); for deploying see [`launch.md`](launch.md).

## Configuration

Site settings (brand, contact, nav, header, footer, business, SEO, robots, security.txt, theme, colour mode) live in `src/site.config.ts`. Each field is documented by a comment in that file. It is validated with zod at build time, so a typo fails the build.

`astro.config.ts`:

- `site`: the canonical production origin (placeholder `https://example.com`). Used for canonical URLs, Open Graph, JSON-LD, sitemap, robots.txt, llms.txt and security.txt. **Change it before deploying.**
- `trailingSlash: "never"` + `build.format: "file"`: `/about` is built as `about.html`, which static hosts serve at `/about`. Canonical URLs, sitemap and nav all use the slash-less form.
- `compressHTML: true`: lossless whitespace compression. (Astro 7's default `"jsx"` mode strips the line break between text and an inline element, which breaks prose that Prettier has wrapped.)
- Also: Fonts API (`fonts`), `prefetch`, `image` defaults, integrations, and the `env` schema (optional variables listed in `.env.example`).

## SEO

Every page uses `BaseLayout` with at least `title` and `description`:

```astro
<BaseLayout
  title="About"
  description="Who we are."
  breadcrumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
>
```

Props: `title`, `description`, `image` (imported image, optimised to 1200px JPEG, or public path/URL), `imageAlt`, `canonical`, `noindex`, `type` (`website` / `article`), `breadcrumbs`. Extra head tags go in the `head` slot.

What you get:

- `lang`, charset, viewport, title template, description, canonical, `robots` meta.
- Full icon set + `site.webmanifest`, `theme-color`, `color-scheme`.
- Open Graph + Twitter card with a default image (`seo.ogImage`) and per-page override.
- JSON-LD `LocalBusiness` (subtype from `business.type`, with address, geo and opening hours) + `WebSite` on every page; `BreadcrumbList` via the `breadcrumbs` prop (also renders visible breadcrumbs); `ContactPage` on `/contact`.
- **Sitemap** (`@astrojs/sitemap`). Caveat: `noindex` pages must **also** be listed in `noindexPaths` in `src/lib/sitemap.ts`, or they will appear in the sitemap.
- **robots.txt** from config: `robots.disallowAll: true` blocks everything (staging); `robots.allowAiCrawlers: false` disallows AI training and assistant crawlers (`src/lib/ai-crawlers.ts`) while leaving search engines alone.
- **/llms.txt** summarising the site from config (nav under "Pages", other footer links under "Optional").
- **AI usage signals**: `robots.contentSignals` adds `Content-Signal: search=…, ai-input=…, ai-train=…` to robots.txt; `tdm` emits `tdm-reservation` meta tags and `/.well-known/tdmrep.json`. Both are declarations, not blocks (use `allowAiCrawlers` for that); the config refuses a TDM reservation alongside `aiTrain: true`.
- **/.well-known/security.txt** (RFC 9116). Caveat: `Expires` is computed at **build time** (build date + `expiresInMonths`, max 12). Rebuild and redeploy at least that often, or it goes stale.
- `text-wrap: balance` on headings; dev-only console warning when a page doesn't have exactly one `<h1>`.
- `/styleguide` and the `/components` showcase pages are `noindex` and excluded from the sitemap.

## Security

- **Headers in `public/_headers`** (Cloudflare): HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, a locked-down `Permissions-Policy` and `Cross-Origin-Opener-Policy`.
- **Minimal CSP**, header only: `frame-ancestors 'none'; base-uri 'self'; object-src 'none'`. `frame-ancestors` stops clickjacking; `base-uri` and `object-src` never block anything these sites use. There is deliberately no strict script/style/img/form-action policy: static brochure sites with no user content, logins or third-party scripts have little to inject into, and a strict CSP silently breaks inline scripts, `style` attributes, embeds and third-party form services. Adding an analytics script, embed or form service needs no CSP change.
- **DOM building**: the template's scripts build DOM with `createElement` / `textContent` rather than `innerHTML` strings. Keep doing that for anything that includes data.
- **HSTS preload**: `preload` is deliberately not set. Only add it (and submit to hstspreload.org) once every subdomain serves HTTPS; removal takes months.

## Performance

- Static HTML; shadcn components ship no JS. The only client JS is the tiny theme script and toggle handlers.
- `astro:assets` `<Image>` / `<Picture>` with responsive `srcset` (`image.layout: "constrained"`); hero image uses `priority`.
- Self-hosted, subsetted fonts via the Fonts API with metric-matched fallbacks; the default theme's fonts are preloaded.
- Prefetch on hover for internal links.
- `No-Vary-Search` so URLs with UTM and click-ID parameters reuse cached and prefetched pages.
- `/_astro/*` cached for a year (immutable, hashed); HTML revalidated on every request.
- `scrollbar-gutter: stable`, `dvh` units, `prefers-reduced-motion` respected. Optional native view transitions (`viewTransitions: true`).

## Icons

`pnpm icons` reads `public/icon.svg` (it can adapt to dark mode via `prefers-color-scheme`) and fills opaque icons with `BACKGROUND` from `scripts/generate-icons.mjs`. It regenerates `favicon.ico` (16 + 32), `apple-touch-icon.png` (180, opaque), `icon-192.png`, `icon-512.png` and `icon-maskable-512.png` (opaque, mark within the maskable safe zone).

In components, use `astro-icon` with Lucide: `<Icon name="lucide:arrow-right" aria-hidden="true" />`.
