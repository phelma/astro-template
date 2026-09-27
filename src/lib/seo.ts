/**
 * SEO helpers: titles, absolute URLs and schema.org JSON-LD builders.
 * Pure functions; pass `Astro.site` (or `context.site` in endpoints).
 */
import type {
  BreadcrumbList,
  DayOfWeek,
  Graph,
  LocalBusiness,
  OpeningHoursSpecification,
  Organization,
  Thing,
  WebSite,
} from "schema-dts"

import {
  DAYS,
  normaliseWeek,
  schemaDayName,
  schemaTimes,
  specialRanges,
  todayIn,
  type TimeRange,
  upcomingSpecialHours,
} from "@/lib/hours"
import { siteConfig, type SiteConfig } from "@/site.config"

export interface BreadcrumbItem {
  /** Visible label and schema.org `name`. */
  name: string
  /** Root-relative or absolute URL. Omit for the current page (last item). */
  href?: string
}

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

/**
 * Plain Organization node. BaseLayout emits `localBusinessSchema` (same @id)
 * instead; switch back to this for businesses with no customer-facing location.
 */
export function organizationSchema(site: URL | undefined): Organization {
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

/**
 * Any schema.org LocalBusiness subtype name known to schema-dts: "Plumber",
 * "HairSalon", "Dentist", "Restaurant", ... (`business.type` in site config).
 */
export type LocalBusinessType = Exclude<LocalBusiness, string>["@type"]

/**
 * `business.type` options (site config). Fails to compile if one of them is
 * not a LocalBusiness subtype in schema-dts.
 */
export type BusinessType = AssertLocalBusinessType<
  SiteConfig["business"]["type"]
>
type AssertLocalBusinessType<T extends LocalBusinessType> = T

/**
 * `business.hours` + `business.specialHours` as OpeningHoursSpecification,
 * following Google's guidance: identical hours share one spec with several
 * `dayOfWeek`s; ranges past midnight stay on the opening day (Sat 18:00 to
 * 02:00); 24 hours is 00:00–23:59; special hours use validFrom/validThrough
 * without `dayOfWeek`, and closed days are 00:00–00:00. Special hours that
 * ended before `today` (ISO date) are left out.
 */
export function openingHoursSpecification(
  business: SiteConfig["business"] = siteConfig.business,
  today: string = todayIn(business.timeZone)
): OpeningHoursSpecification[] {
  const week = normaliseWeek(business.hours)
  const bySlot = new Map<string, { range: TimeRange; days: DayOfWeek[] }>()
  for (const day of DAYS) {
    for (const range of week[day].map(schemaTimes)) {
      const key = `${range.opens}-${range.closes}`
      const slot = bySlot.get(key) ?? { range, days: [] }
      slot.days.push(schemaDayName(day))
      bySlot.set(key, slot)
    }
  }
  const regular = [...bySlot.values()].map(
    ({ range, days }): OpeningHoursSpecification => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days,
      opens: range.opens,
      closes: range.closes,
    })
  )

  const special = upcomingSpecialHours(business.specialHours, today).map(
    (entry): OpeningHoursSpecification => {
      const [range] = specialRanges(entry)
      const times = range
        ? schemaTimes(range)
        : { opens: "00:00", closes: "00:00" }
      return {
        "@type": "OpeningHoursSpecification",
        ...times,
        validFrom: entry.from,
        validThrough: entry.until ?? entry.from,
      }
    }
  )

  return [...regular, ...special]
}

/**
 * The business as one LocalBusiness node typed with `business.type` (e.g.
 * "Plumber"). LocalBusiness is a subtype of Organization, so it keeps the
 * `#organization` @id: `publisher` and ContactPage `about` references still
 * resolve, and Google reads it for both logo and local business details.
 * Google requires `name` and `address`; everything else is emitted when set.
 */
export function localBusinessSchema(site: URL | undefined): LocalBusiness {
  const { organisation, contact, business, seo } = siteConfig
  const sameAs =
    organisation.sameAs ?? contact.socials.map((social) => social.href)
  const hours = openingHoursSpecification(business)

  const node = {
    "@type": business.type,
    "@id": organizationId(site),
    name: organisation.name,
    ...(organisation.legalName && { legalName: organisation.legalName }),
    description: siteConfig.description,
    url: absoluteUrl("/", site),
    logo: absoluteUrl(organisation.logo, site),
    image: absoluteUrl(seo.ogImage, site),
    ...(contact.email && { email: contact.email }),
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.address && {
      address: { "@type": "PostalAddress", ...contact.address },
    }),
    ...(business.geo && {
      geo: { "@type": "GeoCoordinates", ...business.geo },
    }),
    ...(business.priceRange && { priceRange: business.priceRange }),
    ...(hours.length > 0 && { openingHoursSpecification: hours }),
    ...(business.areaServed.length > 0 && {
      areaServed: business.areaServed.map((name) => ({
        "@type": "Place",
        name,
      })),
    }),
    ...(business.googleMapsUrl && { hasMap: business.googleMapsUrl }),
    ...(sameAs.length > 0 && { sameAs }),
  }
  // `business.type` is checked against schema-dts above, but TypeScript
  // can't match an object with a union "@type" to the union of subtypes.
  return node as LocalBusiness
}

export function websiteSchema(site: URL | undefined): WebSite {
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
): BreadcrumbList {
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
export function jsonLdGraph(...nodes: Thing[]): Graph {
  return { "@context": "https://schema.org", "@graph": nodes }
}

/**
 * Serialise JSON-LD for a <script type="application/ld+json">, escaping `<`
 * so content can't close the script element.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
