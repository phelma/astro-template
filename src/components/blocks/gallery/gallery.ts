import type { ImageMetadata } from "astro"

/** One photo in a `Gallery`. */
export interface GalleryImage {
  src: ImageMetadata
  /** Describes the photo; also the thumbnail link's accessible name. */
  alt: string
  /** Shown under/over the thumbnail (see `captions`) and in the lightbox. */
  caption?: string
  /** Filter group(s), e.g. "Kitchens". Enables the filter when `filter` is set. */
  category?: string | string[]
}

/**
 * Most categories the CSS-only filter supports (one static `:has()` rule per
 * slot in GalleryGrid.astro). Add rules there to raise it.
 */
export const MAX_GALLERY_CATEGORIES = 8

const asArray = (category: GalleryImage["category"]): string[] =>
  category === undefined ? [] : Array.isArray(category) ? category : [category]

/** Unique categories in first-seen order. */
export function galleryCategories(items: GalleryImage[]): string[] {
  const categories = [...new Set(items.flatMap((i) => asArray(i.category)))]
  if (categories.length > MAX_GALLERY_CATEGORIES) {
    throw new Error(
      `Gallery filter supports up to ${MAX_GALLERY_CATEGORIES} categories, got ${categories.length}.`
    )
  }
  return categories
}

/** Filter keys ("c1 c2") for an item, matching `galleryCategories` order. */
export function galleryFilterKeys(
  item: GalleryImage,
  categories: string[]
): string {
  return asArray(item.category)
    .filter((c) => categories.includes(c))
    .map((c) => `c${categories.indexOf(c) + 1}`)
    .join(" ")
}
