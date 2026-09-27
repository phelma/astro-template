/**
 * Contact link builders shared by the blocks: `tel:`, `mailto:`, WhatsApp
 * (`wa.me`) and Google Maps URLs, plus postal address formatting. Pure, no
 * site config: callers pass the data in.
 *
 * Google Maps links use the Maps URLs API (no key; opens the app on phones):
 * https://developers.google.com/maps/documentation/urls/get-started
 */
import type { SiteConfig } from "@/site.config"

export type Address = NonNullable<SiteConfig["contact"]["address"]>

/** `tel:` URL from a display number: "+44 20 7946 0000" -> "tel:+442079460000". */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/(?!^\+)[^\d]/g, "")}`
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`
}

/** WhatsApp chat link; `number` in international format ("447946000000"). */
export function whatsappHref(number: string, text?: string): string {
  const url = new URL(`https://wa.me/${number.replace(/\D/g, "")}`)
  if (text) url.searchParams.set("text", text)
  return url.href
}

/** Address as display lines: street, "Town, Region", postcode. */
export function addressLines(address: Address): string[] {
  return [
    address.streetAddress,
    [address.addressLocality, address.addressRegion].filter(Boolean).join(", "),
    address.postalCode,
  ].filter(Boolean)
}

/** One-line address for searches: "1 High St, Leeds, LS1 1AA". */
export const addressText = (address: Address) =>
  addressLines(address).join(", ")

/** A place on Google Maps. */
export interface MapLocation {
  /** Free-text search: business name and/or address. */
  query?: string
  /** Google place ID (most precise; find it with Google's Place ID Finder). */
  placeId?: string
  lat?: number
  lng?: number
}

/** "lat,lng" when both are known. */
export const mapCoords = ({ lat, lng }: MapLocation) =>
  lat !== undefined && lng !== undefined ? `${lat},${lng}` : undefined

/** Best free-text destination: query, else coordinates. */
export const mapSearchText = (location: MapLocation) =>
  location.query ?? mapCoords(location) ?? ""

/** URL with the non-empty params set. */
export function urlWithParams(
  base: string,
  params: Record<string, string | undefined>
): string {
  const url = new URL(base)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, value)
  }
  return url.toString()
}

/** "Get directions" link: opens Google Maps (app on phones) with routing. */
export const directionsUrl = (location: MapLocation) =>
  urlWithParams("https://www.google.com/maps/dir/", {
    api: "1",
    destination: mapSearchText(location),
    destination_place_id: location.placeId,
  })

/** "Open in Google Maps" link for the place. */
export const searchUrl = (location: MapLocation) =>
  urlWithParams("https://www.google.com/maps/search/", {
    api: "1",
    query: mapSearchText(location),
    query_place_id: location.placeId,
  })
