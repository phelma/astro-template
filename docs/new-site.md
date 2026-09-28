# Making a site from the template

How to turn this template into one business's site. `AGENTS.md` has the conventions for writing code here; this is the order of work and where everything lives. The site is done when nothing of the template's shows: no example copy, config values, images, icons or theme.

## Settings you may be told to leave alone

Two settings decide where a site lives and whether search engines see it. Whoever deploys the site may set them for you:

- `site` in `astro.config.ts`: the canonical origin, used in canonical URLs, Open Graph, JSON-LD, the sitemap and `robots.txt`.
- `robots.disallowAll` in `src/site.config.ts`: `true` makes `robots.txt` disallow every crawler, for staging and preview builds.

## 1. Config

`src/site.config.ts` holds the business's facts and the site's chrome, and is zod-validated, so a bad value fails the build. Its comments explain each field. Fill in:

- `name`, `shortName` (max 12 characters), `description`, `titleTemplate`, `organisation`.
- `business`: `type` (the closest entry in `localBusinessTypes`), `hours`, `specialHours`, `areaServed`, `priceRange`, `bookingUrl`, `googleMapsUrl`, and `geo` only from a known source.
- `contact`: phone, email, address. `contact.socials`: the business's own profiles only; the GitHub and LinkedIn entries are examples.
- `nav`, `footer`, `footerOptions`, `header`, `mobileActions`, `announcement`: the site's navigation and chrome.
- `seo.ogImageAlt`; `seo.twitterHandle` only if the business has one.
- `security.contact`.

Every other value in the file is the template's example (Acme Studio, a London address, its hours): replace it, or delete it where the field is optional and there's nothing true to put there.

## 2. Theme

A theme is tokens only: colours, radius, fonts, shadows, tracking, heading style. Make one per site:

1. Copy `src/styles/themes/default.css` to `src/styles/themes/<name>.css`, `<name>` short and kebab-case. Light tokens go in `[data-theme="<name>"] { ... }`, dark in `[data-theme="<name>"].dark { ... }`.
2. Define every token the copy has, in oklch: the colour tokens (derive `--chart-*` and `--sidebar-*` from the palette), `--radius`, the `--heading-*` tokens, the whole `--shadow-*` scale and `--tracking-normal`. Text/background pairs meet WCAG AA (4.5:1) in both modes; `--input` and `--ring` meet 3:1.
3. In `src/styles/global.css`, add `@import "./themes/<name>.css";` beside the others and `@custom-variant theme-<name> (&:is([data-theme="<name>"] *));`.
4. In `src/styles/themes/index.ts`, add the name to `themeNames` and an entry to `themes`: `label`, `themeColor` (the theme's `--background` as hex, light and dark), `fonts` (the `cssVariable`s it uses) and `preload` (the ones above the fold).
5. Fonts come only through the Astro Fonts API, which downloads and self-hosts them at build time. Add each family to `fonts` in `astro.config.ts` (`provider: fontProviders.fontsource()`, a `cssVariable` such as `--font-<family>`, `weights`, `styles`, `subsets: ["latin"]`, `fallbacks`), and reference it from the theme: `--font-sans: var(--font-<family>, ui-sans-serif, system-ui, sans-serif);`, likewise `--heading-font`.
6. In `src/site.config.ts`, set `theme.default` to it, `theme.available` to just it, and `theme.switcher: false`. The `default` and `bold` themes can stay: with `theme.available` set, visitors never see them.
7. Set `colorMode.default` (`light`, `dark` or `system`). Visitors can switch modes, so both must look designed.

For structural per-theme tweaks tokens can't express, use the `theme-<name>:` variant in markup. Check `/styleguide` in light and dark.

## 3. Pages and components

- The template's pages are examples: edit `src/pages/index.astro`, add the site's pages, rewrite or delete `about.astro`, `contact.astro` and `privacy.astro` (and their `nav` and `footer` links), and keep `404.astro` with new copy. `src/pages/styleguide.astro` and `src/pages/components/` are the template's tooling (`noindex`): leave them.
- Give sections ids so `/#<id>` links reach them.
- Blocks (`src/components/blocks/`, every variant shown at `/components`) are parts to use where they fit. Customise each for the site: its variants and props, `class` and `data-slot` hooks, or its markup. Write the site's own components in `src/components/site/` when a design needs something the blocks don't do well.
- The header, footer and `BaseLayout` are the site's to change or replace. Keep their SEO tags, JSON-LD, skip link and colour-mode handling working. The "change structure only by editing components" rule in `AGENTS.md` means exactly this: edit or replace the component.
- Reuse the fiddly logic even when you restyle heavily: opening hours from `src/lib/hours.ts`, `tel:`, `mailto:`, WhatsApp and directions links from `src/lib/contact-links.ts`.
- Third-party embeds: `Map` and `BookingEmbed` are iframes that load from Google or the booking provider as the visitor scrolls near them. A site that must load nothing from another origin uses `MapPlaceholder` with directions links instead of `Map`, and a booking link instead of `BookingEmbed`.
- Forms: `ContactForm` and `QuoteForm` need a form service's endpoint as `action`; a site without one uses call, email and booking links.

## 4. Images

- The site's own images go in `src/assets/` and render through `<Image>` / `<Picture>` from `astro:assets`, which resize and compress them. `priority` on at most one above-the-fold image per page.
- A remote image that must stay hotlinked (a stock photo whose licence requires it): a plain `<img>` with its URL, a `srcset` of a few widths, `sizes`, `width` and `height`, and `loading="lazy"` below the fold. `astro:assets` is for local images.
- `src/assets/hero-placeholder.jpg` and everything in `src/assets/placeholders/` are the template's stand-ins (photos, avatars, logos). Replace every use outside `src/pages/components/`.

## 5. Icons and share image

- Replace `public/icon.svg` with the site's mark, set `BACKGROUND` in `scripts/generate-icons.mjs` to its background colour, and run `pnpm icons` to regenerate the favicon and app icons.
- Replace `public/og-default.png` with a 1200×630 PNG for the site (`sharp` is installed), and describe it in `seo.ogImageAlt`.

## 6. Finish

- Search for the template's leftovers: example copy, Acme Studio and `example.com`, the example contact details, placeholder images. Check the footer, the 404 page, `src/site.config.ts`, `/llms.txt` and `/.well-known/security.txt`.
- Every page has its own `title` and `description`, exactly one `<h1>`, and headings that descend without skipping.
- Run the Verify commands in `AGENTS.md` until they all pass. The static site is built to `dist/`.
