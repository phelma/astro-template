import { pagePath } from "@/lib/seo"
import type { NavLink } from "@/site.config"

/** True for absolute http(s) URLs, or when the link sets `external: true`. */
export function isExternal(link: Pick<NavLink, "href" | "external">): boolean {
  return link.external ?? /^https?:\/\//.test(link.href)
}

/**
 * `aria-current` value for a nav link: "page" for an exact match, "true" when
 * the current page is inside the link's section, otherwise undefined.
 */
export function ariaCurrent(
  href: string,
  pathname: string
): "page" | "true" | undefined {
  if (/^https?:\/\//.test(href)) return undefined
  const target = pagePath(href.split(/[?#]/)[0] ?? href)
  const current = pagePath(pathname)
  if (target === current) return "page"
  if (target !== "/" && current.startsWith(`${target}/`)) return "true"
  return undefined
}
