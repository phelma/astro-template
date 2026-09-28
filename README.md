# Astro marketing-site template

**A fast, accessible, production-ready base for marketing and brochure sites.**
Static HTML, a theme system that restyles everything from a few CSS variables, and the SEO and security basics already done.

![Astro 7](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Base_UI-000000?logo=shadcnui&logoColor=white)
![Static output](https://img.shields.io/badge/output-static-2ea44f)
![Cloudflare ready](https://img.shields.io/badge/Cloudflare-ready-F38020?logo=cloudflare&logoColor=white)

| Default theme                                          | Bold theme                                               |
| ------------------------------------------------------ | -------------------------------------------------------- |
| ![Default theme, light](.github/assets/home-light.png) | ![Bold theme, light](.github/assets/home-bold-light.png) |
| ![Default theme, dark](.github/assets/home-dark.png)   | ![Bold theme, dark](.github/assets/home-bold-dark.png)   |

_Same markup in all four screenshots. Only the theme tokens and colour mode change._

It's a base, not a design. Replace the placeholder copy, pick or build a theme, and ship.

## Why this template

- **Zero JavaScript by default.** shadcn/ui components are React, but they render to HTML at build time. The only client JS is a tiny theme script. Hydrate a component only when it needs real interactivity.
- **Themes that go beyond colour.** Each theme sets shadcn tokens plus fonts, radius, shadows, tracking and heading weight. Switch `data-theme` and the whole site changes, with no rebuild.
- **Light, dark and system modes.** Light is the default, and one config value changes it. The theme is applied before first paint, so there's no flash of the wrong theme.
- **SEO handled.** Meta tags, Open Graph and Twitter cards, canonical URLs, JSON-LD (LocalBusiness with opening hours, WebSite, BreadcrumbList), a sitemap, and `robots.txt` with an AI-crawler toggle and Content Signals.
- **Secure by default.** HSTS, clickjacking, referrer, permissions, COOP and CORP headers for Cloudflare, a minimal CSP that never gets in the way, and a generated `security.txt`.
- **Ready for AI agents.** Generated `/llms.txt` and `/llms-full.txt`, a Markdown copy of every page (`/about.md`), `Link` discovery headers, TDMRep, and an `AGENTS.md` that tells coding agents the project's conventions.
- **Accessible.** Skip link, landmarks, visible focus, targets of at least 24px, reduced-motion and forced-colours support, and AA-contrast tokens.
- **One config file.** Brand, contact, nav, footer, SEO, robots and theme settings live in `src/site.config.ts`. The file is zod-validated, so a typo fails the build.

## What's inside

| Area       | Choice                                                                               |
| ---------- | ------------------------------------------------------------------------------------ |
| Framework  | Astro 7, static output, no adapter, clean URLs (`/about`)                            |
| Styling    | Tailwind CSS 4 (Vite plugin, no `tailwind.config`)                                   |
| Components | shadcn/ui (`base-vega` style, Base UI primitives), React 19 at build time only       |
| Blocks     | ~30 themeable Astro blocks for local business sites, no framework JS (`/components`) |
| Icons      | `astro-icon` + Iconify Lucide                                                        |
| Fonts      | Astro Fonts API: self-hosted and subsetted, with metric-matched fallbacks            |
| Pages      | Home, About, Contact, Privacy, 404, `/styleguide`, `/components` (block showcase)    |
| Tooling    | pnpm, TypeScript, `astro check`, ESLint (Astro, jsx-a11y), Prettier (Tailwind sort)  |
| Hosting    | Any static host; `_headers` and `_redirects` included for Cloudflare                 |

## Quick start

```sh
# From the CLI
pnpm create astro@latest -- --template phelma/astro-template

# Or click "Use this template" on GitHub, then clone your new repo.

pnpm install
pnpm dev          # http://localhost:4321
```

Open [`/styleguide`](http://localhost:4321/styleguide) to see every token, both themes in light and dark, and the installed components.

Requires Node `>=22.12` (`.nvmrc` pins 24) and **pnpm**.

Then work through the [launch checklist](#launch-checklist).

## Launch checklist

Copy this into an issue and tick as you go. Links point to the section that explains each step.

### Make it yours

- [ ] Set `site` in `astro.config.ts` to your production origin ([config](#astroconfigts)).
- [ ] Rename the project: set `name` in `package.json`.
- [ ] Delete the template-only files: `.github/assets/` (README screenshots), `CHECKLIST.md` (an audit of the template, not your site; keep it as a to-do list if useful) and `IDEAS.md`.
- [ ] Rewrite this README for your project.
- [ ] Read through `AGENTS.md` and delete any rules that no longer apply.

### Brand and config (`src/site.config.ts`)

- [ ] Fill in your site's `name`, `shortName` (max 12 chars), `description` and `titleTemplate` ([fields](#srcsiteconfigts)).
- [ ] Set `locale` and `lang` for your audience (the template uses `en-GB` / `en`).
- [ ] Fill in `organisation` with your business `name`, `legalName` and `logo`.
- [ ] Enter your real `contact` email, phone and address.
- [ ] Add your social profiles to `contact.socials`, and delete the `example` GitHub and LinkedIn entries.
- [ ] Update the `nav` and `footer` links to match your pages.
- [ ] Set `seo.ogImageAlt`, and set `seo.twitterHandle` or remove it.
- [ ] Set `security.contact` to an address someone actually monitors for vulnerability reports.

### Look and feel

- [ ] Pick a theme or [add your own](#add-a-theme), then set `theme.default`, `theme.available` and `theme.switcher`.
- [ ] Delete the themes you don't use (CSS file, `global.css` import and variant, registry entry, fonts in `astro.config.ts`) so their fonts aren't built.
- [ ] Choose the default colour mode with `colorMode.default` ([light / dark mode](#light--dark-mode)).
- [ ] Open `/styleguide` and check text meets AA contrast in both light and dark mode.
- [ ] Replace `public/icon.svg` with your logo, set `BACKGROUND` in `scripts/generate-icons.mjs` to its background colour, then run `pnpm icons` ([icons](#icons)).
- [ ] Replace `public/og-default.png` with your own 1200x630 social share image.

### Content

- [ ] Replace the placeholder copy on the home, about, contact and 404 pages in `src/pages/`.
- [ ] Replace `src/assets/hero-placeholder.jpg` with a real image and write `alt` text that describes it.
- [ ] Write a real privacy policy at `/privacy` for your jurisdiction. Update it whenever you add analytics, forms, embeds or cookies.
- [ ] Decide whether to ship `/styleguide`. It is `noindex` but still public; if you don't want it live, delete the page and its `noindexPaths` entry.
- [ ] For every new page, pass `title`, `description` and `breadcrumbs`, and add `noindex` pages to `noindexPaths` ([SEO](#seo)).

### Policy decisions

The defaults allow everything. Make these choices on purpose ([SEO](#seo)):

- [ ] Decide whether to allow or block AI training and assistant crawlers with `robots.allowAiCrawlers`.
- [ ] Set your `search`, `aiInput` and `aiTrain` preferences in `robots.contentSignals`.
- [ ] Declare your text and data mining rights with `tdm.reservation` and `tdm.policy`.
- [ ] Decide whether to keep `viewTransitions` and `speculationRules` switched on.

### Third parties

Only if you add them ([security](#security)):

- [ ] Analytics: add a consent banner if you need one, and count prerendered page views on `prerenderingchange` ([performance](#performance)).
- [ ] Forms: pick a form service, pass its endpoint as `action` to `ContactForm` / `QuoteForm`, or add an adapter ([adding an adapter](#adding-an-adapter-later)).
- [ ] Maps: set `PUBLIC_GOOGLE_MAPS_EMBED_KEY` (see `.env.example`); without it maps use Google's unofficial keyless embed.
- [ ] Embeds (maps, booking): list them and the `embed-consent:*` localStorage keys in your privacy policy.

### Deploy

- [ ] Create the Cloudflare project (for Workers, add `wrangler.jsonc` with your `name`) ([deploying](#deploying-to-cloudflare-static)).
- [ ] In `public/_headers`, uncomment the `X-Robots-Tag: noindex` rules and set your `*.pages.dev` / `*.workers.dev` hostnames, so preview URLs stay out of search results.
- [ ] Set `robots.disallowAll: true` for staging builds, and check production builds have it `false`.
- [ ] Add your custom domain, and redirect whichever of apex / `www` you don't use to the one in `site`.
- [ ] If you're replacing an existing site, add `301` redirects for its old URLs to `public/_redirects`.
- [ ] Add CAA records and enable DNSSEC for your domain. Only add HSTS `preload` once every subdomain serves HTTPS.
- [ ] Optionally, set up the Reporting API endpoint in `_headers`.
- [ ] Run `pnpm format:check && pnpm lint && pnpm check && pnpm build` and fix anything that fails.

### After launch

- [ ] Visit a URL that doesn't exist and check you get the 404 page with a `404` status (browser devtools, Network tab).
- [ ] Scan the site with securityheaders.com.
- [ ] Paste your URLs into the Open Graph and Twitter card debuggers and check the social previews look right.
- [ ] Test your pages with Google's Rich Results Test and fix any structured data errors.
- [ ] Open `/robots.txt`, `/sitemap-index.xml`, `/llms.txt` and `/.well-known/security.txt` and check they show your domain and details, not the template's.
- [ ] Submit your sitemap to Google Search Console and Bing Webmaster Tools.
- [ ] Run Lighthouse and an accessibility checker (axe) on your main pages and fix what they flag.
- [ ] Put a reminder in your calendar to rebuild and redeploy before `security.txt` expires (`security.expiresInMonths`, max 12).

## Scripts

| Command             | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `pnpm dev`          | Dev server with HMR.                                           |
| `pnpm build`        | Static build to `dist/`.                                       |
| `pnpm preview`      | Serve `dist/` locally.                                         |
| `pnpm check`        | `astro check` (TypeScript + `.astro` diagnostics).             |
| `pnpm lint`         | ESLint (TypeScript, Astro, jsx-a11y, React hooks).             |
| `pnpm format`       | Prettier (with Astro + Tailwind class sorting) over the repo.  |
| `pnpm format:check` | Prettier in check mode.                                        |
| `pnpm icons`        | Regenerate favicon / touch / PWA icons from `public/icon.svg`. |

Before pushing: `pnpm format:check && pnpm lint && pnpm check && pnpm build`.

## Project structure

```text
public/
  _headers, _redirects          Cloudflare headers (security, caching) and redirects
  icon.svg, favicon.ico, ...    Icon set (generated by `pnpm icons`)
  og-default.png                Default social image (1200x630)
scripts/generate-icons.mjs      Icon generator (sharp)
src/
  site.config.ts                Brand, contact, nav, SEO, robots, theme settings (zod-validated)
  layouts/BaseLayout.astro      <head> (SEO, social, icons, fonts, theme boot, JSON-LD) + page chrome
  components/
    layout/                     Header (Popover API mobile nav), Footer
    theme/                      ThemeToggle (light/dark/system), ThemeSwitcher (optional)
    seo/                        JsonLd, Breadcrumbs
    blocks/<name>/              Themeable Astro blocks (header, forms, map, hours, gallery, ...)
    showcase/                   Showcase + Demo layout for /components pages
    sections/                   Prose, plus thin wrappers over blocks (Hero, Features, CtaBand, PageHeader)
    ui/                         shadcn/ui components (button, card, badge, input, field, native-select, ...)
  lib/
    seo.ts                      Title, URL and JSON-LD helpers (LocalBusiness, WebSite, BreadcrumbList)
    hours.ts                    Opening hours: weekly table, special hours, summaries, "open now"
    contact-links.ts            tel:, mailto:, WhatsApp and Google Maps directions URLs
    ids.ts                      Deterministic, page-unique element ids for blocks
    theme-script.ts             Blocking head script (colour mode + theme)
    sitemap.ts                  noindexPaths (sitemap exclusions)
    markdown-export.ts          Build step: page .md copies + llms-full.txt
    speculation-rules.ts        Prerender rules (Chromium)
    ai-crawlers.ts              AI crawler user agents for robots.txt
  pages/
    index, about, contact, privacy, 404, styleguide (.astro)
    components/                 One showcase page per block (noindex)
    robots.txt.ts, llms.txt.ts, site.webmanifest.ts, .well-known/{security.txt,tdmrep.json}.ts
  styles/
    global.css                  Tailwind, shadcn base, token mapping, base styles
    themes/<name>.css           One file per theme
    themes/index.ts             Theme registry (labels, theme-color, fonts)
astro.config.ts                 site, env schema, fonts, sitemap, prefetch, images
.env.example                    Optional build-time variables (Google Maps keys)
AGENTS.md                       Rules for AI coding agents (CLAUDE.md is a symlink)
CHECKLIST.md                    Website specification checklist, audited against the template
IDEAS.md                        Possible future improvements
```

## Configuration

### `astro.config.ts`

- `site`: the canonical production origin (placeholder `https://example.com`). Used for canonical URLs, Open Graph, JSON-LD, sitemap, robots.txt, llms.txt and security.txt. **Change it before deploying.**
- `trailingSlash: "never"` + `build.format: "file"`: `/about` is built as `about.html`.
- `compressHTML: true`: lossless whitespace compression. (Astro 7's default `"jsx"` mode strips the line break between text and an inline element, which breaks prose that Prettier has wrapped.)
- Also: Fonts API (`fonts`), `prefetch`, `image` defaults, integrations.

### `src/site.config.ts`

Validated with zod at build time, so a typo fails the build.

| Field               | Purpose                                                                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`, `shortName` | Brand name (titles, OG, JSON-LD); short name (manifest, mobile header, max 12 chars).                                                         |
| `description`       | Default meta description.                                                                                                                     |
| `titleTemplate`     | e.g. `"%s \| Acme Studio"`. The home page (no `title`) gets just `name`.                                                                      |
| `locale`, `lang`    | `og:locale` / JSON-LD (`en-GB`) and `<html lang>` (`en`).                                                                                     |
| `organisation`      | JSON-LD business node: `name`, `legalName`, `logo`, `sameAs` (defaults to social URLs).                                                       |
| `contact`           | `email`, `phone`, `address`, `socials` (label, URL, `lucide:*` icon). Used by contact page, footer, JSON-LD, llms.txt.                        |
| `nav`, `footer`     | Header and footer links (nav items with `children` become dropdowns). External links open in a new tab.                                       |
| `footerOptions`     | Footer `layout` (simple, columns, centered, cta), `tone`, `blurb`, link `columns`, `legalLinks`, `cta` copy.                                  |
| `header`            | `layout`, `variant`, `sticky`, `bordered`, `mobileMenu`, `showPhone`, `cta`, `topBar`.                                                        |
| `announcement`      | Optional banner: `message`, `link`, `from`/`until` dates, `dismissible`.                                                                      |
| `business`          | `type` (schema.org LocalBusiness subtype, validated), `hours`, `specialHours`, `timeZone`, `geo`, `areaServed`, `whatsapp`, `bookingUrl`, ... |
| `mobileActions`     | Sticky bottom bar on phones: `enabled`, `actions` (call, whatsapp, email, directions, book).                                                  |
| `seo`               | Default `ogImage` (+ `ogImageAlt`) and `twitterHandle`.                                                                                       |
| `robots`            | `allowAiCrawlers`, `disallowAll`, `contentSignals` (see [SEO](#seo)).                                                                         |
| `tdm`               | TDMRep text and data mining `reservation` (0/1) and optional `policy` URL.                                                                    |
| `security`          | security.txt `contact`, `expiresInMonths`, `preferredLanguages`, `policy`.                                                                    |
| `theme`             | `default` theme, `available` themes, `switcher` (show runtime theme picker).                                                                  |
| `colorMode.default` | `"light"` (default), `"dark"` or `"system"`.                                                                                                  |
| `viewTransitions`   | Native cross-document view transitions (`@view-transition`). Off by default.                                                                  |
| `speculationRules`  | Prerender internal links on hover in Chromium (Speculation Rules). On by default.                                                             |

## Themes

**Theme = tokens. shadcn style = component structure.**

- The **shadcn style** (`components.json`: `base-vega`, neutral) decides what components are made of: markup, spacing, which tokens they use. Changing it means re-adding components.
- A **theme** is only CSS custom properties: colours, radius, fonts, shadows, tracking and heading tokens. Switching `data-theme` on `<html>` restyles everything at runtime, with no rebuild.

How it works:

- Each theme is `src/styles/themes/<name>.css`, scoped to `[data-theme="<name>"]` (light) and `[data-theme="<name>"].dark` (dark). It defines all shadcn tokens (`--background`, `--primary`, ..., `--chart-*`, `--sidebar-*`, `--radius`) in oklch, plus tweakcn-style extras (`--font-sans/serif/mono`, `--shadow-2xs` ... `--shadow-2xl`, `--tracking-normal`, `--spacing`) and heading tokens (`--heading-font`, `--heading-weight`, `--heading-tracking`).
- `src/styles/global.css` maps the tokens to Tailwind with `@theme inline`, so `bg-primary`, `rounded-lg`, `shadow-md`, `font-sans`, `tracking-tight` etc. all read the live variables.
- `src/styles/themes/index.ts` is the registry: label, `themeColor` (hex, for `<meta name="theme-color">` and the manifest) and which Fonts API variables the theme uses/preloads.
- Two themes ship: `default` (shadcn neutral) and `bold` (sharp corners, hard offset shadows, Space Grotesk, heavy headings, saturated primary). See both side by side at `/styleguide`.

### Add a theme

1. **Get tokens.** Design one at [tweakcn](https://tweakcn.com) or with shadcn's theme builder (`shadcn create` / the themes page) and export the CSS variables.
2. **Create `src/styles/themes/<name>.css`.** Copy `default.css` as a starting point, then paste the exported values: the export's `:root { ... }` block goes in `[data-theme="<name>"] { ... }` and its `.dark { ... }` block goes in `[data-theme="<name>"].dark { ... }`. Keep every token defined (including `--heading-*` and the `--shadow-*` scale). Ignore any `@theme inline` block from the export: `global.css` already has one.
3. **Import it** in `src/styles/global.css` (`@import "./themes/<name>.css";`) and add a variant: `@custom-variant theme-<name> (&:is([data-theme="<name>"] *));`.
4. **Register it** in `src/styles/themes/index.ts`: add the name to `themeNames` and an entry in `themes` (label, `themeColor` hex for light/dark = the theme's `--background`, fonts, preload).
5. **Fonts.** Add each family to `fonts` in `astro.config.ts` (Fonts API, e.g. `fontProviders.fontsource()`) with a `cssVariable`, and reference it from the theme: `--font-sans: var(--font-my-font, ui-sans-serif, system-ui, sans-serif);`. Only the default theme's `preload` fonts are preloaded.
6. **Use it**: set `theme.default` and/or add it to `theme.available` in `src/site.config.ts`. Set `theme.switcher: true` to show a `<select>` in the header that lets visitors pick (persisted in `localStorage`).
7. Check contrast (AA) in light and dark at `/styleguide`.

For structural tweaks tokens can't express, use the per-theme variants in markup: `class="theme-bold:uppercase theme-bold:border-2"`.

## Light / dark mode

- Default is **light**. Set `colorMode.default` to `"system"` (follow the OS) or `"dark"` in `src/site.config.ts`.
- The header has a three-state toggle (light / dark / system) built from a native radio group; the choice is stored in `localStorage`.
- A blocking inline script in `<head>` (`src/lib/theme-script.ts`) sets `.dark`, `data-theme`, `data-color-mode`, `color-scheme` and `theme-color` before first paint (no flash), and follows OS changes in system mode.
- Use the `dark:` variant for mode-specific tweaks; prefer tokens that already differ per mode.

## shadcn/ui

Add components with:

```sh
pnpm dlx shadcn@latest add dialog
```

They land in `src/components/ui/` as React components. Use them directly in `.astro` files **without** a `client:*` directive: they render to static HTML with the token styles and ship no JavaScript.

```astro
---
import { Button } from "@/components/ui/button"
---

<Button variant="outline">Static button</Button>
```

For links styled as buttons, use `buttonVariants`: `<a href="/contact" class={buttonVariants({ size: "lg" })}>`.

Only hydrate (`client:visible`, `client:idle`, ...) when a component needs genuinely complex client-side behaviour (e.g. a combobox or data table). For simple interactivity prefer native HTML: `popover`, `<details>`, `<dialog>`, form validation.

Review diffs to `src/styles/global.css` after `shadcn add`: tokens belong in theme files, not `:root`.

## Blocks

`src/components/blocks/` holds reusable Astro components for local business sites. Browse them at [`/components`](http://localhost:4321/components) (noindex), where each block has a page showing every variant; switch theme and colour mode there to check them.

| Group   | Blocks                                                                                          |
| ------- | ----------------------------------------------------------------------------------------------- |
| Layout  | `section` (band + container + heading group), `navbar` (header parts), `announcement`, `footer` |
| Heroes  | `hero`, `page-header`, `cta`, `features`                                                        |
| Local   | `opening-hours` (live "Open now"), `map`, `booking`, `service-area`, `mobile-actions`           |
| Forms   | `form` (native controls, field, validation, honeypot), `contact-form`, `quote-form`             |
| Content | `testimonials`, `faq`, `services`, `price-list`, `steps`, `stats`, `team`, `logo-strip`         |
| Media   | `gallery` (lightbox), `before-after`                                                            |

They work like shadcn components: the code lives in the repo and is yours to edit, and they only use theme tokens, so they restyle with the theme. To make one fit a site:

1. **Change the theme** (tokens, fonts, radius, shadows) and every block follows.
2. **Pick variants** with props (`layout`, `variant`, `tone`, `size`, ...). Section blocks also take `tone`, `spacing`, `width` and `headingLevel`.
3. **Override at the call site** with `class`, which is merged last, or target a part via its `data-slot`: `<Faq class="**:data-[slot=faq-question]:text-lg" />`. Set fixed custom properties with classes (`[--embed-aspect:5/2]`): they work with breakpoints and `cn()` merging. `style` is fine for values computed from data.
4. **Edit the block**, or its `variants.ts`, when the structure itself should change.

Business data (contact, hours, address, booking link) comes from `src/site.config.ts` by default and can be overridden per instance with props. The header, footer, announcement banner, mobile action bar and `LocalBusiness` JSON-LD are driven entirely by config.

Blocks ship no framework JavaScript. Where they need behaviour (dropdowns, lightbox, form validation, "Open now") it's native HTML plus a small bundled script that the page works without. Third-party embeds (Google Maps, Calendly) are click-to-load, so nothing loads from Google before the visitor asks for it.

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
- **Markdown for agents**: after the build, every indexable page's `<main>` is converted to Markdown at `/about.md` (home: `/index.md`), advertised with `<link rel="alternate" type="text/markdown">`, and concatenated into **/llms-full.txt**. Breadcrumbs, icons and anything marked `data-markdown-ignore` are dropped. Build-only (not served by `astro dev`). The `.md` files are `noindex` via `_headers`.
- **AI usage signals**: `robots.contentSignals` adds `Content-Signal: search=…, ai-input=…, ai-train=…` to robots.txt; `tdm` emits `tdm-reservation` meta tags and `/.well-known/tdmrep.json`. Both are declarations, not blocks (use `allowAiCrawlers` for that); the config refuses a TDM reservation alongside `aiTrain: true`.
- **`Link` header** on every response pointing at `/llms.txt` (`describedby`) and the sitemap.
- **/.well-known/security.txt** (RFC 9116). Caveat: `Expires` is computed at **build time** (build date + `expiresInMonths`, max 12). Rebuild and redeploy at least that often, or it goes stale.
- `text-wrap: balance` on headings; dev-only console warning when a page doesn't have exactly one `<h1>`.
- `/styleguide` is `noindex` and excluded from the sitemap.

## Security

- **Headers in `public/_headers`** (Cloudflare): HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, a locked-down `Permissions-Policy`, `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy: same-site`.
- **Minimal CSP**, header only: `frame-ancestors 'none'; base-uri 'self'; object-src 'none'`. `frame-ancestors` stops clickjacking; `base-uri` and `object-src` never block anything these sites use. There is deliberately no strict script/style/img/form-action policy: static brochure sites with no user content, logins or third-party scripts have little to inject into, and a strict CSP silently breaks inline scripts, `style` attributes, embeds and third-party form services. Adding an analytics script, embed or form service needs no CSP change.
- **DOM building**: the template's scripts build DOM with `createElement` / `textContent` rather than `innerHTML` strings. Keep doing that for anything that includes data.
- **Reporting API**: a commented-out `Reporting-Endpoints` block in `_headers`, with `report-to` for the header CSP and COOP.
- **HSTS preload**: `preload` is deliberately not set. Only add it (and submit to hstspreload.org) once every subdomain serves HTTPS; removal takes months.

## Performance

- Static HTML; shadcn components ship no JS. The only client JS is the tiny theme script and toggle handlers.
- `astro:assets` `<Image>` / `<Picture>` with responsive `srcset` (`image.layout: "constrained"`); hero image uses `priority`.
- Self-hosted, subsetted fonts via the Fonts API with metric-matched fallbacks; the default theme's fonts are preloaded.
- Prefetch on hover for internal links; in Chromium, Speculation Rules prerender them on hover (`speculationRules`). Before adding analytics, count page views on `prerenderingchange` when `document.prerendering` is true.
- `No-Vary-Search` so URLs with UTM and click-ID parameters reuse cached and prerendered pages.
- `/_astro/*` cached for a year (immutable, hashed); HTML revalidated on every request.
- `scrollbar-gutter: stable`, `dvh` units, `prefers-reduced-motion` respected. Optional native view transitions (`viewTransitions: true`).

## Deploying to Cloudflare (static)

Build command `pnpm build`, output directory `dist`. `public/_headers` and `public/_redirects` are copied to `dist/` and honoured by both options.

**Workers static assets** (recommended for new projects). Add a `wrangler.jsonc`:

```jsonc
{
  "name": "my-site",
  "compatibility_date": "2026-09-27",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
  },
}
```

`"not_found_handling": "404-page"` is required to serve `404.html` with a 404 status. Then `pnpm dlx wrangler deploy` (or connect the repo in the dashboard). Wrangler's local state (`.wrangler/`) is already git-ignored.

**Pages**: create a Pages project from the repo with the build settings above. `404.html` is used automatically.

Either way, uncomment the `X-Robots-Tag: noindex` rules at the bottom of `public/_headers` for your `*.pages.dev` / `*.workers.dev` hostnames, and use `robots.disallowAll: true` for staging builds.

### Adding an adapter later

For server-rendered routes (forms, APIs, auth), run `pnpm astro add cloudflare` and mark dynamic pages with `export const prerender = false`. Keep marketing pages prerendered. Note: `_headers` only applies to static assets, not to responses generated by Worker code, so SSR routes must set their own security headers. There is **no 500 page** in this template: a static site has no server errors to render; add `src/pages/500.astro` when you add an adapter.

## Icons

Replace `public/icon.svg` (it can adapt to dark mode via `prefers-color-scheme`), set `BACKGROUND` in `scripts/generate-icons.mjs` to your logo's background colour, then run:

```sh
pnpm icons
```

This regenerates `favicon.ico` (16 + 32), `apple-touch-icon.png` (180, opaque), `icon-192.png`, `icon-512.png` and `icon-maskable-512.png` (opaque, mark within the maskable safe zone).

In components, use `astro-icon` with Lucide: `<Icon name="lucide:arrow-right" aria-hidden="true" />`.

## Checklist coverage

The template targets the foundations, SEO, accessibility, security, performance, privacy and agent sections of the [website specification checklist](https://specification.website/checklist.md). [CHECKLIST.md](./CHECKLIST.md) records which items the template covers; the unticked ones are yours to decide. Things it deliberately leaves to you or to [IDEAS.md](./IDEAS.md): CI and automated tests, analytics and consent, contact forms, i18n, blog/RSS, generated OG images, DNS-level settings (CAA, DNSSEC) and HSTS preload.
