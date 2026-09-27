/**
 * SEO helpers: titles, absolute URLs and schema.org JSON-LD builders.
 * Pure functions; pass `Astro.site` (or `context.site` in endpoints).
 */
import { siteConfig } from "@/site.config"

export interface BreadcrumbItem {
  /** Visible label and schema.org `name`. */
  name: string
  /** Root-relative or absolute URL. Omit for the current page (last item). */
  href?: string
}

type JsonLdNode = Record<string, unknown>

/**
 * Clean page path for canonical URLs and nav matching. With
 * `build.format: "file"`, `Astro.url.pathname` is e.g. "/about.html" or
 * "/index.html"; this returns "/about" and "/".
 */
export function pagePath(pathname: string): string {
  const clean = pathname
    .replace(/(^|\/)index\.html$/, "$1")
    .replace(/\.html$/, "")
    .replace(/\/+$/, "")
  return clean === "" ? "/" : clean
}

/**
 * Markdown copy of a page (generated after the build by
 * src/lib/markdown-export.ts): "/about" -> "/about.md", "/" -> "/index.md".
 */
export function markdownPath(path: string): string {
  return path === "/" ? "/index.md" : `${path}.md`
}

/** Resolve a root-relative path or absolute URL against the site origin. */
export function absoluteUrl(pathOrUrl: string, site: URL | undefined): string {
  if (!site) {
    throw new Error(
      "`site` must be set in astro.config.ts to build absolute URLs (canonical, OG, sitemap, JSON-LD)."
    )
  }
  return new URL(pathOrUrl, site).href
}

/** Apply `siteConfig.titleTemplate`. No title, or the site name, gives just the site name. */
export function formatTitle(title?: string): string {
  if (!title || title === siteConfig.name) return siteConfig.name
  return siteConfig.titleTemplate.replace("%s", title)
}

/** `en-GB` -> `en_GB` for og:locale. */
export function ogLocale(locale: string = siteConfig.locale): string {
  return locale.replace("-", "_")
}

export function organizationId(site: URL | undefined): string {
  return `${absoluteUrl("/", site)}#organization`
}

export function websiteId(site: URL | undefined): string {
  return `${absoluteUrl("/", site)}#website`
}

export function organizationSchema(site: URL | undefined): JsonLdNode {
  const { organisation, contact } = siteConfig
  const sameAs =
    organisation.sameAs ?? contact.socials.map((social) => social.href)

  return {
    "@type": "Organization",
    "@id": organizationId(site),
    name: organisation.name,
    ...(organisation.legalName && { legalName: organisation.legalName }),
    url: absoluteUrl("/", site),
    logo: absoluteUrl(organisation.logo, site),
    ...(contact.email && { email: contact.email }),
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.address && {
      address: { "@type": "PostalAddress", ...contact.address },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  }
}

export function websiteSchema(site: URL | undefined): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": websiteId(site),
    url: absoluteUrl("/", site),
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
    publisher: { "@id": organizationId(site) },
  }
}

/**
 * BreadcrumbList. Items without `href` (normally the current page) use
 * `currentUrl` so every ListItem has an `item` URL.
 */
export function breadcrumbSchema(
  items: BreadcrumbItem[],
  site: URL | undefined,
  currentUrl: URL
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href
        ? absoluteUrl(item.href, site)
        : absoluteUrl(pagePath(currentUrl.pathname), site),
    })),
  }
}

/** Wrap nodes in a single `@graph` document. */
export function jsonLdGraph(...nodes: JsonLdNode[]): JsonLdNode {
  return { "@context": "https://schema.org", "@graph": nodes }
}

/**
 * Serialise JSON-LD for a <script type="application/ld+json">, escaping `<`
 * so content can't close the script element.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
