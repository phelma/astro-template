import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"
import { defineConfig } from "astro/config"

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Canonical production origin. Used for canonical URLs, sitemap, OG tags, robots.txt.
  site: "https://example.com",
  output: "static",
  integrations: [react(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
})
