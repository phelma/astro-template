import type { NavLink, SiteConfig } from "@/site.config"

export type FooterAddress = NonNullable<SiteConfig["contact"]["address"]>

/** A titled list of links (FooterColumn). */
export interface FooterLinkGroup {
  title: string
  links: NavLink[]
}

/** Button in the CTA band. */
export interface FooterCtaAction {
  label: string
  href: string
  /** astro-icon name shown before the label, e.g. "lucide:phone". */
  icon?: string
}

/** `tel:` URI from a display number: "+44 20 7946 0000" -> "tel:+442079460000". */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`
}

/** Address lines for display (country omitted: local sites). */
export function addressLines(address: FooterAddress): string[] {
  return [
    address.streetAddress,
    address.addressLocality,
    address.addressRegion,
    address.postalCode,
  ].filter((line): line is string => Boolean(line))
}
