/**
 * /.well-known/security.txt (RFC 9116), generated from `siteConfig.security`.
 *
 * `Expires` is computed at BUILD time (build date + `expiresInMonths`), so
 * the site must be rebuilt and redeployed before it lapses; an expired
 * security.txt should be treated as stale by researchers.
 */
import type { APIRoute } from "astro"

import { absoluteUrl } from "@/lib/seo"
import { siteConfig } from "@/site.config"

export const GET: APIRoute = ({ site }) => {
  const { contact, expiresInMonths, preferredLanguages, policy } =
    siteConfig.security

  const expires = new Date()
  expires.setUTCMonth(expires.getUTCMonth() + expiresInMonths)
  expires.setUTCHours(0, 0, 0, 0)

  const lines = [
    ...contact.map((uri) => `Contact: ${uri}`),
    `Expires: ${expires.toISOString()}`,
    `Preferred-Languages: ${preferredLanguages}`,
    `Canonical: ${absoluteUrl("/.well-known/security.txt", site)}`,
    ...(policy ? [`Policy: ${policy}`] : []),
  ]

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
