import type { ActionLink } from "@/lib/actions"
import { telHref, type Address } from "@/lib/contact-links"
import { siteConfig, type LinkGroup, type NavLink } from "@/site.config"

export type FooterAddress = Address

/** A titled list of links (FooterColumn). */
export type FooterLinkGroup = LinkGroup

/** Button in the CTA band (icon shown before the label). */
export type FooterCtaAction = Pick<ActionLink, "label" | "href" | "icon">

/**
 * CTA band buttons: `primary` (default siteConfig.header.cta) then a
 * click-to-call button for siteConfig.contact.phone.
 */
export function defaultFooterCtaActions(
  primary: NavLink | undefined = siteConfig.header.cta,
  callLabel: string = siteConfig.footerOptions.cta.callLabel
): FooterCtaAction[] {
  const { phone } = siteConfig.contact
  return [
    ...(primary ? [{ label: primary.label, href: primary.href }] : []),
    ...(phone
      ? [
          {
            label: callLabel.replace("{phone}", phone),
            href: telHref(phone),
            icon: "lucide:phone",
          },
        ]
      : []),
  ]
}
