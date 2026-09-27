/**
 * /site.webmanifest (Web App Manifest), generated from `siteConfig` and the
 * default theme's colours. Icons live in public/.
 */
import type { APIRoute } from "astro"

import { siteConfig } from "@/site.config"
import { themes } from "@/styles/themes"

export const GET: APIRoute = () => {
  const { name, shortName, description, lang, theme, colorMode } = siteConfig
  // theme_color/background_color are static: use the default mode's colour
  // ("system" falls back to light). The head script updates <meta
  // name="theme-color"> at runtime for the browser UI.
  const color =
    themes[theme.default].themeColor[
      colorMode.default === "dark" ? "dark" : "light"
    ]

  const manifest = {
    name,
    short_name: shortName,
    description,
    lang,
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: color,
    background_color: color,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  }

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  })
}
