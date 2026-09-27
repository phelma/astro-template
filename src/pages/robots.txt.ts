/**
 * /robots.txt, generated from `siteConfig.robots`.
 *
 * - `disallowAll: true` blocks every crawler (use on staging/previews).
 * - `allowAiCrawlers: false` adds a Disallow group for AI crawlers
 *   (see src/lib/ai-crawlers.ts).
 * - `contentSignals` adds a `Content-Signal` line (contentsignals.org) to
 *   the catch-all group, saying how fetched pages may be used.
 */
import type { APIRoute } from "astro"

import { aiCrawlers } from "@/lib/ai-crawlers"
import { absoluteUrl } from "@/lib/seo"
import { siteConfig } from "@/site.config"

export const GET: APIRoute = ({ site }) => {
  const { allowAiCrawlers, disallowAll, contentSignals } = siteConfig.robots
  const groups: string[] = []

  if (disallowAll) {
    groups.push(["User-agent: *", "Disallow: /"].join("\n"))
  } else {
    if (!allowAiCrawlers) {
      groups.push(
        [
          "# AI training and AI assistant crawlers",
          ...aiCrawlers.map((agent) => `User-agent: ${agent}`),
          "Disallow: /",
        ].join("\n")
      )
    }
    const signal = (value: boolean) => (value ? "yes" : "no")
    groups.push(
      [
        "User-agent: *",
        "Allow: /",
        ...(contentSignals
          ? [
              `Content-Signal: search=${signal(contentSignals.search)}, ai-input=${signal(contentSignals.aiInput)}, ai-train=${signal(contentSignals.aiTrain)}`,
            ]
          : []),
      ].join("\n")
    )
  }

  const body = [
    ...groups,
    `Sitemap: ${absoluteUrl("/sitemap-index.xml", site)}`,
  ].join("\n\n")

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
