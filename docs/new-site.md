# Making a site from the template

How to turn this template into one business's site. `AGENTS.md` has the conventions for writing code here; this is the order of work and where everything lives. The site is done when nothing of the template's shows: no example copy, config values, images, icons or theme.

A few steps are the owner's decision rather than the builder's; they're marked _(owner)_. Without an answer, leave the template's default.

## Settings you may be told to leave alone

Two settings decide where a site lives and whether search engines see it. Whoever deploys the site may set them for you:

- `site` in `astro.config.ts`: the canonical origin, used in canonical URLs, Open Graph, JSON-LD, the sitemap and `robots.txt`.
- `robots.disallowAll` in `src/site.config.ts`: `true` makes `robots.txt` disallow every crawler, for staging and preview builds.

Otherwise, set `site` to the production origin.

## 1. Config

`src/site.config.ts` holds the business's facts and the site's chrome, and is zod-validated, so a bad value fails the build. Its comments explain each field. Fill in:

- `name`, `shortName` (max 12 characters), `description`, `titleTemplate`, `organisation`.
- `locale` and `lang` for the site's audience (the template uses `en-GB` / `en`).
- `business`: `type` (the closest entry in `localBusinessTypes`), `hours`, `specialHours`, `areaServed`, `priceRange`, `bookingUrl`, `googleMapsUrl`, and `geo` only from a known source.
- `contact`: phone, email, address. `contact.socials`: the business's own profiles only; the GitHub and LinkedIn entries are examples.
- `nav`, `footer`, `footerOptions`, `header`, `mobileActions`, `announcement`: the site's navigation and chrome.
- `seo.ogImageAlt`; `seo.twitterHandle` only if the business has one.
- `security.contact`: an address someone monitors for vulnerability reports.

Every other value in the file is the template's example (Acme Studio, a London address, its hours): replace it, or delete it where the field is optional and there's nothing true to put there. `robots.allowAiCrawlers`, `robots.contentSignals`, `tdm` and `viewTransitions` are policy decisions _(owner)_; the file's comments explain each.

Also set `name` in `package.json` to the project's name.

## 2. Theme

A theme is tokens only: colours, radius, fonts, shadows, tracking, heading style. Make one per site: follow [Add a theme](themes.md#add-a-theme), then:

- In `src/site.config.ts`, set `theme.default` to it, `theme.available` to just it, and `theme.switcher: false`.
- Set `colorMode.default` (`light`, `dark` or `system`). Visitors can switch modes, so both must look designed and meet the contrast check in [Add a theme](themes.md#add-a-theme).

The `default` and `bold` themes can stay: with `theme.available` set, visitors never see them. Removing one (so its fonts aren't built) is optional: see the end of [Add a theme](themes.md#add-a-theme).

## 3. Pages and components

- The template's pages are examples: edit `src/pages/index.astro`, add the site's pages, rewrite or delete `about.astro` and `contact.astro` (and their `nav` and `footer` links), and keep `404.astro` with new copy.
- `privacy.astro` is a placeholder. A real privacy policy for the business's jurisdiction is _(owner)_: it names every third party the site uses (maps, booking, forms, analytics).
- `src/pages/styleguide.astro` and `src/pages/components/` are the template's tooling (`noindex`, but public): leave them. Whether to ship `/styleguide` is _(owner)_; to remove it, delete the page and its `noindexPaths` entry in `src/lib/sitemap.ts`.
- Give sections ids so `/#<id>` links reach them.
- Blocks (`src/components/blocks/`, every variant shown at `/components`, catalogue in [blocks.md](blocks.md)) are parts to use where they fit. Customise each for the site: its variants and props, `class` and `data-slot` hooks, or its markup. Write the site's own components in `src/components/site/` when a design needs something the blocks don't do well.
- The header, footer and `BaseLayout` are the site's to change or replace. Keep their SEO tags, JSON-LD, skip link and colour-mode handling working. The "change structure only by editing components" rule in `AGENTS.md` means exactly this: edit or replace the component.
- Reuse the fiddly logic even when you restyle heavily: opening hours from `src/lib/hours.ts`, `tel:`, `mailto:`, WhatsApp and directions links from `src/lib/contact-links.ts`.
- Third-party embeds: `Map` and `BookingEmbed` are iframes that load from Google or the booking provider as the visitor scrolls near them. They work without an API key or a CSP change, so use them wherever a design shows a map or a booking widget.
- Forms: there are no ready-made forms. Build whatever forms the design needs from the `form` blocks (`Form`, `FormField`, `ChoiceGroup`, `CheckboxField`, `FormSubmit` and the rest; every one is shown at `/components/forms`). A form sends to a form service's endpoint, set as `Form`'s `action`. Choosing the service is _(owner)_: until then, leave `action` unset. The form sends nothing until it's set.

## 4. Images

- The site's own images go in `src/assets/` and render through `<Image>` / `<Picture>` from `astro:assets`, which resize and compress them. `priority` on at most one above-the-fold image per page. Every image has `alt` text that describes it, or `alt=""` if it's decorative.
- A remote image that must stay hotlinked (a stock photo whose licence requires it): a plain `<img>` with its URL, a `srcset` of a few widths, `sizes`, `width` and `height`, and `loading="lazy"` below the fold. `astro:assets` is for local images.
- `src/assets/hero-placeholder.jpg` and everything in `src/assets/placeholders/` are the template's stand-ins (photos, avatars, logos). Replace every use outside `src/pages/components/`.

## 5. Icons and share image

- Replace `public/icon.svg` with the site's mark, set `BACKGROUND` in `scripts/generate-icons.mjs` to its background colour, and run `pnpm icons` to regenerate the favicon and app icons.
- Replace `public/og-default.png` with a 1200×630 PNG for the site (`sharp` is installed), and describe it in `seo.ogImageAlt`.

## 6. Finish

- Search for the template's leftovers: example copy, Acme Studio and `example.com`, the example contact details, placeholder images. Check the footer, the 404 page, `src/site.config.ts`, `/llms.txt` and `/.well-known/security.txt`.
- Every page has its own `title` and `description`, exactly one `<h1>`, and headings that descend without skipping.
- Delete any template-only files that are still here: `.github/assets/` (screenshots of the template), `IDEAS.md` and `docs/spec-audit.md` (an audit of the template, not the site). The other files in `docs/` describe code the site keeps; delete them only if nobody will read them, and drop their pointers from `AGENTS.md` too.
- Write `README.md` for the project, replacing the template's if there is one: what the site is, how to run it, how it's deployed.
- _(owner)_ Delete any rules in `AGENTS.md` that no longer apply to the site.
- Run the Verify commands in `AGENTS.md` until they all pass. The static site is built to `dist/`.

Deploying the site, and the decisions only the owner makes (AI crawlers, analytics, forms, domains), aren't part of making it: they're for whoever launches it.
