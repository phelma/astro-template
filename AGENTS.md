# AGENTS.md

Static Astro 7 marketing site: Tailwind 4, shadcn/ui (Base UI) rendered at build time, token-based themes. Human docs: `README.md`. Astro API questions: use the `astro` skill (`.agents/skills/astro`) and docs.astro.build; Astro 7 differs from older training data.

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

Reusable, themeable Astro components (the Astro counterpart to `src/components/ui/`). One folder per block: `blocks/<kebab-name>/<PascalName>.astro`, parts as `<PascalName><Part>.astro`, cva variants in `variants.ts`, pure helpers in `*.ts`. Import `.astro` files directly (no barrel files: they lose prop types). Same customisation contract as shadcn:

- The code is owned by the site: restyle by editing the file, or override at the call site.
- Every component takes `class`, merged last with `cn()` so call-site utilities win, and spreads remaining HTML attributes (`...rest`) onto its root. Type props as `HTMLAttributes<"tag"> & Variants & {...}`.
- Every styled element has `data-slot="<block>-<part>"` so sites and themes can target parts (`**:data-[slot=faq-question]:text-lg`, or `[data-slot="faq-question"]` in theme CSS).
- Visual options are cva variants (`variant`, `size`, `layout`, `tone`...) with defaults, exported from `variants.ts` for reuse like `buttonVariants`.
- Compose from small parts; the top-level component is the default composition. Content via props and slots. Site data (contact, hours, address) defaults from `siteConfig` and can be overridden by props, so blocks work with any data.
- Section-level blocks render inside `Section` / `SectionHeader` (`blocks/section`) and accept `headingLevel` (default 2) plus section props (`tone`, `spacing`, `width`).
- Every block has a showcase page `src/pages/components/<block>.astro` using `Showcase` + `Demo` (`src/components/showcase`) showing each variant; nest block headings under the demo `<h2>` with `headingLevel={3}`. Check in both themes, light and dark.

- Colours, radius, shadows, fonts and tracking come from tokens via Tailwind utilities (`bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`, `shadow-md`, `font-heading`). Use tokens for every colour; hex/rgb/oklch literals and Tailwind palette colours (`bg-blue-500`) belong only in `src/styles/themes/*.css`.
- Theme = tokens (`src/styles/themes/<name>.css`, scoped to `[data-theme="<name>"]` and `[data-theme="<name>"].dark`). shadcn style (`components.json`) = component structure. Change the look via tokens; change structure only by editing components.
- Structural per-theme tweaks: `theme-<name>:` variants (`theme-bold:uppercase`). Mode tweaks: `dark:`.
- New theme: follow "Add a theme" in `README.md` (theme CSS file, import + `@custom-variant` in `global.css`, registry entry in `src/styles/themes/index.ts`, fonts in `astro.config.ts`). Keep every token defined, AA contrast in light and dark; check `/styleguide`.

## Pages and SEO

- Every page uses `BaseLayout` with `title` and `description` (home page omits `title`). Content pages pass `breadcrumbs`.
- Exactly one `<h1>` per page (`Hero` or `PageHeader` provides it). Heading levels descend without skipping.
- `noindex` pages: set `noindex` on `BaseLayout` AND add the path to `noindexPaths` in `src/lib/sitemap.ts`.
- Structured data: extend builders in `src/lib/seo.ts`, render with `JsonLd.astro`.

## Config

- Brand, contact, nav, footer, SEO, robots, security.txt, theme and colour-mode settings: `src/site.config.ts` (zod-validated). Read values from it; keep copy out of components.
- Canonical origin: `site` in `astro.config.ts` (`Astro.site` / `context.site`).
- `src/site.config.ts`, `src/styles/themes/index.ts` and `src/lib/{csp,markdown-export,sitemap,speculation-rules,theme-script,view-transitions}.ts` are imported by `astro.config.ts`: use relative imports there (no `@/`, no `astro:*`).

## Security

- New third-party origin (script, style, font, image, frame, form target, fetch): add it to the matching directive in `security.csp.directives` in `astro.config.ts`.
- Inline scripts/styles must be hashed: bundled `<script>` is hashed by Astro; `is:inline` content must be added to `src/lib/csp.ts`. Prefer bundled scripts.
- The header CSP in `public/_headers` holds only `frame-ancestors`; other directives go in `astro.config.ts`.

## Accessibility

- Landmarks and skip link come from `BaseLayout`; keep content inside it.
- Interactive targets >= 24px (`tap-target` utility, `min-h-6`); icon-only controls need an accessible name.
- Motion respects `prefers-reduced-motion`; focus stays visible.
