/** "+44 20 7946 0000" -> "tel:+442079460000" (RFC 3966, no visual separators). */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`
}
