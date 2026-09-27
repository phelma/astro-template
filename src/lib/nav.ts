import { pagePath } from "@/lib/seo"
import type { NavItem, NavLink } from "@/site.config"

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

/** A nav link with its current-page state and external flag worked out. */
export interface ResolvedNavLink extends NavLink {
  current: "page" | "true" | undefined
  external: boolean
}

/** A nav item plus resolved children; `active` when it or a child is current. */
export interface ResolvedNavItem extends ResolvedNavLink {
  children: ResolvedNavLink[]
  active: boolean
}

function resolveLink(link: NavLink, pathname: string): ResolvedNavLink {
  return {
    ...link,
    current: ariaCurrent(link.href, pathname),
    external: isExternal(link),
  }
}

/** Resolve nav items (e.g. `siteConfig.nav`) against the current path. */
export function resolveNav(
  items: readonly NavItem[],
  pathname: string
): ResolvedNavItem[] {
  return items.map((item) => {
    const link = resolveLink(item, pathname)
    const children = (item.children ?? []).map((child) =>
      resolveLink(child, pathname)
    )
    return {
      ...link,
      children,
      active: Boolean(link.current) || children.some((c) => c.current),
    }
  })
}

/** `target`/`rel` attributes for a link that may open in a new tab. */
export function linkTarget(external: boolean) {
  return external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : { target: undefined, rel: undefined }
}

/** Re-exported for existing imports; the implementation is in contact-links. */
export { telHref } from "@/lib/contact-links"
