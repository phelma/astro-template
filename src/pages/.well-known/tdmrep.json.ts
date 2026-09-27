/**
 * /.well-known/tdmrep.json (TDMRep, W3C Community Group), generated from
 * `siteConfig.tdm`: the site-wide text and data mining reservation. It
 * covers non-HTML files too; BaseLayout also emits the same values as
 * <meta> tags, which take precedence per page.
 */
import type { APIRoute } from "astro"

import { siteConfig } from "@/site.config"

export const GET: APIRoute = () => {
  const { reservation, policy } = siteConfig.tdm

  const rules = [
    {
      location: "/",
      "tdm-reservation": reservation,
      ...(policy && { "tdm-policy": policy }),
    },
  ]

  return new Response(JSON.stringify(rules, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
}
