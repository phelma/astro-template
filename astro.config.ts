import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"
import { defineConfig, fontProviders } from "astro/config"

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Canonical production origin. Used for canonical URLs, sitemap, OG tags, robots.txt.
  site: "https://example.com",
  output: "static",

  // Clean, slash-less URLs (/about) emitted as about.html, which static hosts
  // like Cloudflare serve at /about. Keeps canonical, sitemap and nav in sync.
  trailingSlash: "never",
  build: { format: "file" },

  integrations: [react(), sitemap(), icon()],

  // Prefetch internal links on hover/focus. Opt a link out with
  // data-astro-prefetch="false", or pick a strategy per link
  // (data-astro-prefetch="viewport").
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },

  image: {
    // Responsive srcset/sizes by default for <Image>/<Picture>.
    layout: "constrained",
    responsiveStyles: true,
  },

  // Fonts API: self-hosted, subsetted, with metric-matched fallbacks.
  // Each theme references these CSS variables (src/styles/themes/*.css) and
  // lists them in src/styles/themes/index.ts (which controls preloading).
  fonts: [
    // Theme: default
    {
      name: "Geist",
      cssVariable: "--font-geist",
      provider: fontProviders.fontsource(),
      weights: ["100 900"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      provider: fontProviders.fontsource(),
      weights: ["100 900"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
    // Theme: bold
    {
      name: "Space Grotesk",
      cssVariable: "--font-space-grotesk",
      provider: fontProviders.fontsource(),
      weights: ["300 700"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      name: "Space Mono",
      cssVariable: "--font-space-mono",
      provider: fontProviders.fontsource(),
      weights: [400, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
