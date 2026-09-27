/**
 * /llms.txt (https://llmstxt.org): a Markdown summary of the site for LLMs
 * and agents, generated from `siteConfig` (name, description, nav, footer).
 *
 * Links in `footer` that aren't in `nav` go under "Optional", which the
 * spec defines as skippable when context is short.
 */
import type { APIRoute } from "astro"

import { isExternal } from "@/lib/nav"
import { absoluteUrl } from "@/lib/seo"
import { siteConfig, type NavLink } from "@/site.config"

export const GET: APIRoute = ({ site }) => {
  const { name, description, nav, footer, contact } = siteConfig

  const toItem = (link: NavLink) =>
    `- [${link.label}](${isExternal(link) ? link.href : absoluteUrl(link.href, site)})`

  const navHrefs = new Set(nav.map((link) => link.href))
  const optional = footer.filter((link) => !navHrefs.has(link.href))

  const details = [
    contact.email && `email ${contact.email}`,
    contact.phone && `phone ${contact.phone}`,
  ].filter(Boolean)

  const lines = [
    `# ${name}`,
    "",
    `> ${description}`,
    ...(details.length > 0 ? ["", `Contact: ${details.join(", ")}.`] : []),
    "",
    "## Pages",
    "",
    ...nav.map(toItem),
    ...(optional.length > 0
      ? ["", "## Optional", "", ...optional.map(toItem)]
      : []),
  ]

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
