import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"
import { defineConfig, fontProviders } from "astro/config"

import { cspHashes } from "./src/lib/csp"
import { sitemapFilter } from "./src/lib/sitemap"

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Canonical production origin. Used for canonical URLs, sitemap, OG tags, robots.txt.
  site: "https://example.com",
  output: "static",

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
  ],

  // Content Security Policy, emitted as a <meta http-equiv> tag per page
  // (static output). Astro hashes the scripts/styles it bundles; our
  // `is:inline` theme script (and optional view-transition style) are hashed
  // in src/lib/csp.ts. Directives that don't work in a <meta> CSP
  // (frame-ancestors, report-uri, sandbox) live in public/_headers instead.
  // Adding a third-party script/style/font/image/iframe? Allow its origin here.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "manifest-src 'self'",
      ],
      scriptDirective: { hashes: cspHashes.scripts },
      styleDirective: { hashes: cspHashes.styles },
    },
  },

  // Shiki highlights with inline `style` attributes, which the CSP above
  // blocks. Prism emits classes instead (bring a Prism theme stylesheet if
  // you render code blocks from Markdown).
  markdown: {
    syntaxHighlight: "prism",
  },

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
