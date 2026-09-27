import type { ImageMetadata } from "astro"

export interface Logo {
  /** Organisation name: the image alt text, or the placeholder text. */
  name: string
  /**
   * Logo image (SVG or raster). Omit to render a text placeholder badge,
   * e.g. until the site owner supplies the official artwork. Use accreditation
   * logos only as the scheme's brand guidelines allow.
   */
  image?: ImageMetadata
  /** Link, e.g. to the business's entry on the scheme's register. */
  href?: string
  /** Icon for the text placeholder. Defaults to "lucide:badge-check". */
  icon?: string
  /** Invert a dark, single-colour logo in dark mode so it stays visible. */
  invertInDark?: boolean
}
