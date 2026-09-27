/**
 * CSP helpers for `astro.config.ts`.
 *
 * Astro's `security.csp` only auto-hashes scripts/styles it processes
 * (bundled `<script>`, component `<style>`, `<Font />` CSS). Our blocking
 * head script, optional speculation rules and optional view-transition style
 * are `is:inline`, so their hashes must be supplied via config:
 *
 *   security: {
 *     csp: {
 *       scriptDirective: { hashes: cspHashes.scripts },
 *       styleDirective: { hashes: cspHashes.styles },
 *     },
 *   }
 *
 * Relative imports only: this module is imported by `astro.config.ts`.
 */
import { createHash } from "node:crypto"

import { siteConfig } from "../site.config"
import { speculationRules } from "./speculation-rules"
import { themeScript } from "./theme-script"
import { viewTransitionStyle } from "./view-transitions"

type Sha256 = `sha256-${string}`

export function sha256(content: string): Sha256 {
  return `sha256-${createHash("sha256").update(content, "utf8").digest("base64")}`
}

export const cspHashes: { scripts: Sha256[]; styles: Sha256[] } = {
  scripts: [
    sha256(themeScript),
    ...(siteConfig.speculationRules ? [sha256(speculationRules)] : []),
  ],
  styles: siteConfig.viewTransitions ? [sha256(viewTransitionStyle)] : [],
}
