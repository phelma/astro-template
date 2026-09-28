import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"
import { defineConfig, envField, fontProviders } from "astro/config"

import { markdownExport } from "./src/lib/markdown-export"
import { sitemapFilter } from "./src/lib/sitemap"

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Canonical production origin. Used for canonical URLs, sitemap, OG tags, robots.txt.
  site: "https://example.com",
  output: "static",

  // Astro 7 defaults to JSX whitespace rules ("jsx"), which drop the line
  // break between text and an inline element ("such as\n<code>" renders as
  // "such as<code>"). Prettier reflows prose onto new lines, so use lossless
  // compression instead: whitespace that affects rendering is kept.
  compressHTML: true,

  // Clean, slash-less URLs (/about) emitted as about.html, which static hosts
  // like Cloudflare serve at /about. Keeps canonical, sitemap and nav in sync.
  trailingSlash: "never",
  build: { format: "file" },

  integrations: [
    react(),
    // URLs follow `trailingSlash: "never"`, matching canonical URLs. Pages
    // marked noindex are excluded via src/lib/sitemap.ts.
    sitemap({ filter: sitemapFilter }),
    icon(),
    // After the build: /about.md etc. and /llms-full.txt for agents.
    markdownExport(),
  ],

  // Typed environment variables (astro:env). Set them in `.env` locally and
  // in the host's build settings; see .env.example.
  env: {
    schema: {
      // Google Maps Embed API key for blocks/map. Public: it ends up in the
      // HTML, so restrict it to your domain in Google Cloud. Without it,
      // maps use Google's keyless embed URL.
      PUBLIC_GOOGLE_MAPS_EMBED_KEY: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },

  // Prefetch internal links on hover/focus. Opt a link out with
  // data-astro-prefetch="false", or pick a strategy per link
  // (data-astro-prefetch="viewport"). Chromium also prerenders on hover via
  // Speculation Rules (siteConfig.speculationRules).
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
