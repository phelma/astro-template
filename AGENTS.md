# AGENTS.md

Static Astro 7 marketing site: Tailwind 4, shadcn/ui (Base UI) rendered at build time, token-based themes. Human docs: `README.md` and `docs/`. Astro API questions: use the `astro` skill (`.agents/skills/astro`) and docs.astro.build; Astro 7 differs from older training data.

- Making a site for a business from this template (config, theme, pages, images, icons): follow `docs/new-site.md`.
- Adding a theme: `docs/themes.md`.
- Choosing a block: the catalogue is `docs/blocks.md`, every variant rendered at `/components`.
- Why a default is the way it is (CSP, headers, SEO output): `docs/reference.md`.

## Verify

Run before reporting work done; all four must pass:

```sh
pnpm format:check && pnpm lint && pnpm check && pnpm build
```

Use pnpm only. Fix formatting with `pnpm format` (Prettier: no semicolons, double quotes, trailing commas es5, Tailwind class sorting).

## Components and interactivity

- Build with native Astro + HTML first: `popover` (see the mobile nav in `Header.astro`), `<details>`, `<dialog>`, radio groups, form validation. Small vanilla `<script>` blocks are fine.
- shadcn components (`src/components/ui/*.tsx`) render server-side: use them in `.astro` files with no `client:*` directive. Links styled as buttons: `<a class={buttonVariants(...)}>`.
- Hydrate (`client:visible` / `client:idle`) only for complex interactivity native HTML can't do (combobox, data table). State the justification in a comment next to the directive.
- Add shadcn components with `pnpm dlx shadcn@latest add <name>`; revert any tokens it writes into `global.css` `:root` (tokens live in theme files).
- Icons: `astro-icon` with Lucide, `<Icon name="lucide:<name>" aria-hidden="true" />` plus visible or `sr-only` text. `lucide-react` is only for shadcn internals.
- Images: `<Image>` / `<Picture>` from `astro:assets` with images imported from `src/assets/`. `priority` on at most one above-the-fold image per page.

## Blocks (`src/components/blocks/`)

Rules for writing or changing a block. Blocks are reusable, themeable Astro components (the Astro counterpart to `src/components/ui/`). One folder per block: `blocks/<kebab-name>/<PascalName>.astro`, parts as `<PascalName><Part>.astro`, cva variants in `variants.ts`, pure helpers in `*.ts`. Import `.astro` files directly (no barrel files: they lose prop types). Same customisation contract as shadcn:

- The code is owned by the site: restyle by editing the file, or override at the call site.
- Every component takes `class`, merged last with `cn()` so call-site utilities win, and spreads remaining HTML attributes (`...rest`) onto its root. Type props as `HTMLAttributes<"tag"> & Variants & {...}`.
- Every styled element has `data-slot="<block>-<part>"` so sites and themes can target parts (`**:data-[slot=faq-question]:text-lg`, or `[data-slot="faq-question"]` in theme CSS).
- Visual options are cva variants (`variant`, `size`, `layout`, `tone`...) with defaults, exported from `variants.ts` for reuse like `buttonVariants`.
- Compose from small parts; the top-level component is the default composition. Content via props and slots. Site data (contact, hours, address) defaults from `siteConfig` and can be overridden by props, so blocks work with any data.
- Section-level blocks render inside `Section` / `SectionHeader` (`blocks/section`) and accept `headingLevel` (default 2) plus section props (`tone`, `spacing`, `width`).
- Default ids come from `uniqueId(Astro, "<block>")` (`src/lib/ids.ts`) so two instances on a page don't clash; an explicit `id` prop wins.
- Contact URLs (`tel:`, `mailto:`, WhatsApp, Google Maps directions) come from `src/lib/contact-links.ts`; opening-hours logic from `src/lib/hours.ts`. Don't reimplement them in a block.
- Coloured bands set `data-tone` (`Section` does it for you). Adjust children for a band with `in-data-[tone=primary]:`, not by matching `.bg-primary`.
- Set fixed custom properties with classes (`[--gallery-gap:1rem]`): they work with breakpoints and `cn()` merging. `style` is fine for values computed from data.
- A block's own JSON-LD builder may live in its folder (`blocks/faq/schema.ts`); site-wide nodes stay in `src/lib/seo.ts`.
- Every block has a showcase page `src/pages/components/<block>.astro` using `Showcase` + `Demo` (`src/components/showcase`) showing each variant; nest block headings under the demo `<h2>` with `headingLevel={3}`. Check in both themes, light and dark.

## Styling and themes

- Colours, radius, shadows, fonts and tracking come from tokens via Tailwind utilities (`bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`, `shadow-md`, `font-heading`). Use tokens for every colour; hex/rgb/oklch literals and Tailwind palette colours (`bg-blue-500`) belong only in `src/styles/themes/*.css`.
- Theme = tokens (`src/styles/themes/<name>.css`, scoped to `[data-theme="<name>"]` and `[data-theme="<name>"].dark`). shadcn style (`components.json`) = component structure. Change the look via tokens; change structure only by editing components.
- Structural per-theme tweaks: `theme-<name>:` variants (`theme-bold:uppercase`). Mode tweaks: `dark:`.
- New theme: follow "Add a theme" in `docs/themes.md`. Every token the `default` theme defines is defined, text meets AA contrast in light and dark, and it's checked at `/styleguide`.

## Pages and SEO

- Every page uses `BaseLayout` with `title` and `description` (home page omits `title`). Content pages pass `breadcrumbs`.
- Exactly one `<h1>` per page (`Hero` or `PageHeader` provides it). Heading levels descend without skipping.
- `noindex` pages: set `noindex` on `BaseLayout` AND add the path to `noindexPaths` in `src/lib/sitemap.ts`.
- Structured data: extend builders in `src/lib/seo.ts`, render with `JsonLd.astro`. The site node is `LocalBusiness` (type from `business.type`), keeping the `#organization` @id.

## Config

- Site facts, chrome and settings live in `src/site.config.ts` (zod-validated; its comments document each field). Read values from it; keep copy out of components.
- Canonical origin: `site` in `astro.config.ts` (`Astro.site` / `context.site`).
- `src/site.config.ts`, `src/styles/themes/index.ts` and `src/lib/sitemap.ts` are imported by `astro.config.ts`: use relative imports there (no `@/`, no `astro:*`).

## Security

- Security headers live in `public/_headers`. Its CSP stays minimal (`frame-ancestors`, `base-uri`, `object-src`): no script, style, img or form restrictions, and third-party origins need no CSP change (why: `docs/reference.md`).
- Build DOM with `createElement` / `textContent`, not `innerHTML` strings. Prefer bundled `<script>` over `is:inline` (bundled, deduplicated, cached).

## Accessibility

- Landmarks and skip link come from `BaseLayout`; keep content inside it.
- Interactive targets >= 24px (`tap-target` utility, `min-h-6`); icon-only controls need an accessible name.
- Motion respects `prefers-reduced-motion`; focus stays visible.
