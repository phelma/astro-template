import type { ImageMetadata } from "astro"

import type { Price } from "@/components/blocks/price-list/price"

/** Image is optional, but when set its alt text must be too ("" if decorative). */
type ServiceImage =
  | { image: ImageMetadata; imageAlt: string }
  | { image?: undefined; imageAlt?: undefined }

export type Service = ServiceImage & {
  title: string
  description: string
  /** astro-icon name, e.g. "lucide:flame". Decorative. */
  icon?: string
  /** Starting price: a number is formatted as £, text is shown as is. */
  price?: Price
  /** Text before the price. Defaults to "From". Use "" for none. */
  pricePrefix?: string
  /** Service page. Makes the whole card clickable. */
  href?: string
  /** Visible link text (image cards and rows). Defaults to "Find out more". */
  linkLabel?: string
  /** Short bullet points (a checklist under the description). */
  features?: string[]
}
