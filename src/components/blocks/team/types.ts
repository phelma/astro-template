import type { ImageMetadata } from "astro"

/** Photo is optional, but when set its alt text must be too ("" if decorative). */
type Photo =
  | { image: ImageMetadata; imageAlt: string }
  | { image?: undefined; imageAlt?: undefined }

export interface TeamMemberLink {
  /** Accessible name, e.g. "Email Sarah" or "Sarah on LinkedIn". */
  label: string
  href: string
  /** astro-icon name, e.g. "lucide:mail". */
  icon: string
}

export type TeamMember = Photo & {
  name: string
  /** Job title, e.g. "Senior stylist" or "Gas Safe engineer". */
  role: string
  bio?: string
  links?: TeamMemberLink[]
}
