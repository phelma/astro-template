/**
 * Google Maps URL builders (pure; no API calls).
 *
 * - Maps URLs (directions / search links): no key, documented at
 *   https://developers.google.com/maps/documentation/urls/get-started
 * - Maps Embed API (iframe, needs a key, free and unlimited):
 *   https://developers.google.com/maps/documentation/embed/embedding-map
 * - Keyless embed fallback (`/maps?q=...&output=embed`): widely used but not
 *   an official API; Google may change it. Configure a key for production.
 * - Maps Static API (poster image, needs a key, billed per load):
 *   https://developers.google.com/maps/documentation/maps-static/start
 */
import type { SiteConfig } from "@/site.config"

export type Address = NonNullable<SiteConfig["contact"]["address"]>

export interface MapLocation {
  /** Free-text search: business name and/or address. */
  query?: string
  /** Google place ID (most precise; find it with Google's Place ID Finder). */
  placeId?: string
  lat?: number
  lng?: number
}

/** Address as display lines: street, "Town, Region", postcode. */
export function addressLines(address: Address): string[] {
  return [
    address.streetAddress,
    [address.addressLocality, address.addressRegion].filter(Boolean).join(", "),
    address.postalCode,
  ]
}

/** One-line address for searches: "1 High St, Leeds, LS1 1AA". */
export const addressText = (address: Address) =>
  addressLines(address).join(", ")

const coords = ({ lat, lng }: MapLocation) =>
  lat !== undefined && lng !== undefined ? `${lat},${lng}` : undefined

/** Best free-text destination: query, else coordinates. */
const searchText = (location: MapLocation) =>
  location.query ?? coords(location) ?? ""

function build(base: string, params: Record<string, string | undefined>) {
  const url = new URL(base)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, value)
  }
  return url.toString()
}

/** "Get directions" link: opens Google Maps (app on phones) with routing. */
export const directionsUrl = (location: MapLocation) =>
  build("https://www.google.com/maps/dir/", {
    api: "1",
    destination: searchText(location),
    destination_place_id: location.placeId,
  })

/** "Open in Google Maps" link for the place. */
export const searchUrl = (location: MapLocation) =>
  build("https://www.google.com/maps/search/", {
    api: "1",
    query: searchText(location),
    query_place_id: location.placeId,
  })

export interface EmbedOptions {
  zoom?: number
  /** Map UI language, e.g. "en-GB". */
  language?: string
  /** Region bias (two-letter), e.g. "GB". */
  region?: string
  maptype?: "roadmap" | "satellite"
}

/**
 * iframe URL. With `key`: Maps Embed API place mode (or view mode when only
 * coordinates are known). Without: the keyless `output=embed` URL.
 */
export function embedUrl(
  location: MapLocation,
  { key, zoom, language, region, maptype }: EmbedOptions & { key?: string }
) {
  const z = zoom?.toString()
  if (!key) {
    return build("https://www.google.com/maps", {
      q: searchText(location),
      z,
      hl: language,
      t: maptype === "satellite" ? "k" : undefined,
      output: "embed",
    })
  }
  const q = location.placeId ? `place_id:${location.placeId}` : location.query
  const common = { key, zoom: z, language, region, maptype }
  if (!q) {
    return build("https://www.google.com/maps/embed/v1/view", {
      ...common,
      center: coords(location),
    })
  }
  return build("https://www.google.com/maps/embed/v1/place", {
    ...common,
    q,
    center: coords(location),
  })
}

/** Maps Static API image with a marker on the location. */
export function staticMapUrl(
  location: MapLocation,
  {
    key,
    zoom = 15,
    width = 640,
    height = 480,
    language,
    region,
    maptype,
  }: EmbedOptions & { key: string; width?: number; height?: number }
) {
  const target = coords(location) ?? searchText(location)
  return build("https://maps.googleapis.com/maps/api/staticmap", {
    key,
    center: target,
    zoom: zoom.toString(),
    // Max 640x640; scale 2 doubles the pixels for high-density screens.
    size: `${Math.min(width, 640)}x${Math.min(height, 640)}`,
    scale: "2",
    markers: target,
    language,
    region,
    maptype,
  })
}
