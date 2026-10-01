# Themes

**Theme = tokens. shadcn style = component structure.**

- The **shadcn style** (`components.json`: `base-vega`, neutral) decides what components are made of: markup, spacing, which tokens they use. Changing it means re-adding components.
- A **theme** is only CSS custom properties: colours, radius, fonts, shadows, tracking and heading tokens. Switching `data-theme` on `<html>` restyles everything at runtime, with no rebuild.

## How it works

- Each theme is `src/styles/themes/<name>.css`, scoped to `[data-theme="<name>"]` (light) and `[data-theme="<name>"].dark` (dark). It defines all shadcn tokens (`--background`, `--primary`, ..., `--chart-*`, `--sidebar-*`, `--radius`), plus tweakcn-style extras (`--font-sans/serif/mono`, `--shadow-2xs` ... `--shadow-2xl`, `--tracking-normal`, `--spacing`) and heading tokens (`--heading-font`, `--heading-weight`, `--heading-tracking`).
- `src/styles/global.css` maps the tokens to Tailwind with `@theme inline`, so `bg-primary`, `rounded-lg`, `shadow-md`, `font-sans`, `tracking-tight` etc. all read the live variables.
- `src/styles/themes/index.ts` is the registry: `label`, `themeColor` (hex, for `<meta name="theme-color">` and the manifest), and which Fonts API variables the theme uses (`fonts`) and preloads (`preload`).
- Two themes ship: `default` (shadcn neutral) and `bold` (sharp corners, hard offset shadows, Space Grotesk, heavy headings, saturated primary). See both side by side at `/styleguide`.
- `theme` in `src/site.config.ts` picks the `default` theme, the `available` ones, and whether to show a runtime `switcher`.

## Add a theme

1. **Get tokens.** Design one at [tweakcn](https://tweakcn.com) or with shadcn's theme builder (`shadcn create` / the themes page) and export the CSS variables, or start from a palette you already have.
2. **Create `src/styles/themes/<name>.css`**, `<name>` short and kebab-case. Copy `default.css` as a starting point, then fill in the values: light tokens (an export's `:root { ... }` block) go in `[data-theme="<name>"] { ... }`, dark ones (its `.dark { ... }` block) in `[data-theme="<name>"].dark { ... }`. Write colours in any CSS colour format (hex, `rgb()`, `hsl()`, `oklch()`...): the shipped themes use oklch, but a theme needn't. Derive `--chart-*` and `--sidebar-*` from the palette if you have no values for them. Keep every token the copy has defined, including `--radius`, `--tracking-normal`, the `--heading-*` tokens and the whole `--shadow-*` scale. Ignore any `@theme inline` block from an export: `global.css` already has one.
3. **Import it** in `src/styles/global.css` (`@import "./themes/<name>.css";`) and add a variant: `@custom-variant theme-<name> (&:is([data-theme="<name>"] *));`.
4. **Register it** in `src/styles/themes/index.ts`: add the name to `themeNames` and an entry in `themes`: `label`, `themeColor` (the theme's `--background` as hex, light and dark), `fonts` (the `cssVariable`s it uses) and `preload` (the ones used above the fold).
5. **Fonts.** Fonts come only through the Astro Fonts API, which downloads and self-hosts them at build time. Add each family to `fonts` in `astro.config.ts` (`provider: fontProviders.fontsource()`, a `cssVariable` such as `--font-<family>`, `weights`, `styles`, `subsets: ["latin"]`, `fallbacks`), and reference it from the theme: `--font-sans: var(--font-<family>, ui-sans-serif, system-ui, sans-serif);`, likewise `--heading-font`. Only the default theme's `preload` fonts are preloaded.
6. **Use it**: set `theme.default` and/or add it to `theme.available` in `src/site.config.ts`. Set `theme.switcher: true` to show a `<select>` in the header that lets visitors pick (persisted in `localStorage`).
7. Look at it at `/styleguide` in light and dark.

To remove a theme, undo the same steps: delete the CSS file, its `global.css` import and variant, its registry entry, and any fonts in `astro.config.ts` that no other theme uses.

## Per-theme tweaks

For structural tweaks tokens can't express, use the per-theme variants in markup: `class="theme-bold:uppercase theme-bold:border-2"`.

## Light / dark mode

- Default is **light**. Set `colorMode.default` to `"system"` (follow the OS) or `"dark"` in `src/site.config.ts`.
- The header has a three-state toggle (light / dark / system) built from a native radio group; the choice is stored in `localStorage`.
- A blocking inline script in `<head>` (`src/lib/theme-script.ts`) sets `.dark`, `data-theme`, `data-color-mode`, `color-scheme` and `theme-color` before first paint (no flash), and follows OS changes in system mode.
- Use the `dark:` variant for mode-specific tweaks; prefer tokens that already differ per mode.
