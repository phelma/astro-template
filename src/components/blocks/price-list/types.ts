import type { Price } from "./price"

export interface PriceListItem {
  name: string
  description?: string
  /** Number (formatted as £) or text ("POA", "from £40"). */
  price: Price
  /** Shown after the price, e.g. "per hour", "each". */
  unit?: string
  /** Short highlight, e.g. "Popular", "New", "Vegan". */
  badge?: string
}

export interface PriceListGroup {
  /** Group heading, e.g. "Cuts" or "Breakfast". Omit for a single ungrouped list. */
  title?: string
  description?: string
  items: PriceListItem[]
}
