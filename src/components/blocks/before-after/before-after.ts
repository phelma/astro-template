import type { ImageMetadata } from "astro"

/** One side of a comparison. Both sides should share the same dimensions. */
export interface ComparisonImage {
  src: ImageMetadata
  alt: string
}

/** One before/after pair, as used by BeforeAfterGrid. */
export interface ComparisonPair {
  before: ComparisonImage
  after: ComparisonImage
  caption?: string
  /** Slider name for screen readers; defaults to "Before/after comparison". */
  label?: string
}
