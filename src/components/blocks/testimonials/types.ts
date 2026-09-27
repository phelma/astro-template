import type { ImageMetadata } from "astro"

/** Avatar is optional, but when set its alt text must be too ("" if decorative). */
type Avatar =
  | { avatar: ImageMetadata; avatarAlt: string }
  | { avatar?: undefined; avatarAlt?: undefined }

export type Testimonial = Avatar & {
  quote: string
  name: string
  /** Job and/or place, e.g. "Kitchen refit, Leeds". */
  context?: string
  /** Star rating from 1 to 5 (halves allowed). */
  rating?: number
  /** Where the review was left, e.g. "Google", "Checkatrade". */
  source?: string
  /** Link to the original review. */
  sourceHref?: string
}

/** Aggregate score shown above the testimonials. */
export interface TestimonialsSummary {
  /** Average rating, e.g. 4.9. */
  rating: number
  /** Number of reviews, e.g. 120. */
  count: number
  /** Review platform, e.g. "Google". */
  source?: string
  /** Link to all reviews on the platform. */
  href?: string
  /** Best possible rating. Defaults to 5. */
  max?: number
}
