import { siteConfig } from "@/site.config"

/** A number is formatted as currency; a string ("POA", "£40–£60") is shown as is. */
export type Price = number | string

/**
 * Format a price for display: 45 -> "£45", 7.5 -> "£7.50". Whole amounts
 * drop the pence. Uses the site locale and GBP by default.
 */
export function formatPrice(
  price: Price,
  { currency = "GBP", locale = siteConfig.locale } = {}
): string {
  if (typeof price === "string") return price
  const whole = Number.isInteger(price)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(price)
}
