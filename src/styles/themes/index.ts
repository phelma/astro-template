/**
 * Theme registry.
 *
 * Each theme is a CSS file in this folder (`<name>.css`, imported from
 * `src/styles/global.css`) plus an entry here. The entry holds the few values
 * that JavaScript/HTML needs and can't read from CSS before first paint:
 *
 * - `label`: shown in the optional theme switcher.
 * - `themeColor`: `<meta name="theme-color">` per colour mode (use the
 *   theme's `--background` as hex).
 * - `fonts`: Astro Fonts API `cssVariable`s the theme uses (see
 *   `astro.config.ts`). Their @font-face rules are always emitted (browsers
 *   only download faces that are actually used).
 * - `preload`: subset of `fonts` to `<link rel="preload">`. Only the default
 *   theme's (`siteConfig.theme.default`) preloads are emitted.
 *
 * This module must stay free of `astro:*` runtime imports and path aliases so
 * `astro.config.ts` can import it (via `src/site.config.ts`).
 */

export const themeNames = ["default", "bold"] as const

export type ThemeName = (typeof themeNames)[number]

export interface ThemeDefinition {
  label: string
  themeColor: { light: string; dark: string }
  fonts: readonly string[]
  preload: readonly string[]
}

export const themes = {
  default: {
    label: "Default",
    themeColor: { light: "#ffffff", dark: "#0a0a0a" },
    fonts: ["--font-geist", "--font-geist-mono"],
    preload: ["--font-geist"],
  },
  bold: {
    label: "Bold",
    themeColor: { light: "#faf7ea", dark: "#0d0f18" },
    fonts: ["--font-space-grotesk", "--font-space-mono"],
    preload: ["--font-space-grotesk"],
  },
} as const satisfies Record<ThemeName, ThemeDefinition>
