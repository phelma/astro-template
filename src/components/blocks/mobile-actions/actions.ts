/**
 * Contact action links (call, WhatsApp, email, directions, booking) built
 * from contact/business data. Pure: pass data in; `siteActionData()` reads
 * the defaults from `siteConfig`. Actions with missing data are skipped.
 */
import {
  directionsUrl,
  mailtoHref,
  telHref,
  whatsappHref,
} from "@/lib/contact-links"
import { siteConfig, type SiteConfig } from "@/site.config"

export type ActionKind = SiteConfig["mobileActions"]["actions"][number]

export interface ActionData {
  name?: string
  /** Display phone number, e.g. "+44 20 7946 0000". */
  phone?: string
  email?: string
  /** International number, digits only ("447946000000"). */
  whatsapp?: string
  /** Prefilled WhatsApp message. */
  whatsappText?: string
  address?: NonNullable<SiteConfig["contact"]["address"]>
  geo?: SiteConfig["business"]["geo"]
  googleMapsUrl?: string
  bookingUrl?: string
}

export interface Action {
  kind: ActionKind
  label: string
  href: string
  icon: string
}

export const defaultActionLabels: Record<ActionKind, string> = {
  call: "Call",
  whatsapp: "WhatsApp",
  email: "Email",
  directions: "Directions",
  book: "Book",
}

export const actionIcons: Record<ActionKind, string> = {
  call: "lucide:phone",
  whatsapp: "lucide:message-circle",
  email: "lucide:mail",
  directions: "lucide:navigation",
  book: "lucide:calendar-check",
}

/**
 * Google Maps directions (Maps URLs API, opens the app on mobile). Prefers
 * the business name + address (matches the Business Profile), then
 * coordinates, then `googleMapsUrl`.
 */
export function directionsHref(data: ActionData): string | undefined {
  const { address, geo, name } = data
  let destination: string | undefined
  if (address) {
    destination = [
      name,
      address.streetAddress,
      address.addressLocality,
      address.postalCode,
      address.addressCountry,
    ]
      .filter(Boolean)
      .join(", ")
  } else if (geo) {
    destination = `${geo.latitude},${geo.longitude}`
  }
  if (!destination) return data.googleMapsUrl
  return directionsUrl({ query: destination })
}

function hrefFor(kind: ActionKind, data: ActionData): string | undefined {
  switch (kind) {
    case "call":
      return data.phone ? telHref(data.phone) : undefined
    case "whatsapp":
      return data.whatsapp
        ? whatsappHref(data.whatsapp, data.whatsappText)
        : undefined
    case "email":
      return data.email ? mailtoHref(data.email) : undefined
    case "directions":
      return directionsHref(data)
    case "book":
      return data.bookingUrl
  }
}

/** Actions in the given order, skipping any whose data is missing. */
export function buildActions(
  kinds: readonly ActionKind[],
  data: ActionData,
  labels: Partial<Record<ActionKind, string>> = {}
): Action[] {
  return [...new Set(kinds)].flatMap((kind) => {
    const href = hrefFor(kind, data)
    if (!href) return []
    return [
      {
        kind,
        href,
        label: labels[kind] ?? defaultActionLabels[kind],
        icon: actionIcons[kind],
      },
    ]
  })
}

/** Action data from `siteConfig.contact` and `siteConfig.business`. */
export function siteActionData(): ActionData {
  const { contact, business, organisation } = siteConfig
  return {
    name: organisation.name,
    phone: contact.phone,
    email: contact.email,
    whatsapp: business.whatsapp,
    address: contact.address,
    geo: business.geo,
    googleMapsUrl: business.googleMapsUrl,
    bookingUrl: business.bookingUrl,
  }
}
