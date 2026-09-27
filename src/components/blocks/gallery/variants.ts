import { cva, type VariantProps } from "class-variance-authority"

/**
 * Thumbnail list layout. `grid`: uniform cells (see `aspect`); `masonry`: CSS
 * columns, photos keep their own shape; `featured`: the first photo large,
 * the rest in a grid beside it (`columns` is ignored).
 */
export const galleryListVariants = cva("", {
  variants: {
    layout: {
      grid: "grid grid-cols-2 gap-3 sm:gap-4",
      masonry: "columns-2 gap-3 *:mb-3 *:break-inside-avoid sm:gap-4 sm:*:mb-4",
      featured: "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4",
    },
    columns: {
      2: "",
      3: "",
      4: "",
    },
  },
  compoundVariants: [
    { layout: "grid", columns: 3, class: "md:grid-cols-3" },
    { layout: "grid", columns: 4, class: "md:grid-cols-3 lg:grid-cols-4" },
    { layout: "masonry", columns: 3, class: "md:columns-3" },
    { layout: "masonry", columns: 4, class: "md:columns-3 lg:columns-4" },
  ],
  defaultVariants: {
    layout: "grid",
    columns: 3,
  },
})

/** Thumbnail frame shape for the `grid` layout. */
export const galleryFrameVariants = cva(
  "group/gallery-link relative block overflow-hidden rounded-lg bg-muted outline-offset-2",
  {
    variants: {
      aspect: {
        square: "aspect-square",
        landscape: "aspect-4/3",
        portrait: "aspect-3/4",
        video: "aspect-video",
        auto: "",
      },
    },
    defaultVariants: {
      aspect: "square",
    },
  }
)

/** Where thumbnail captions go. They always show in the lightbox. */
export const galleryCaptionVariants = cva("text-sm", {
  variants: {
    captions: {
      below: "mt-2 text-muted-foreground",
      overlay:
        "pointer-events-none absolute inset-x-2 bottom-2 rounded-md bg-background/90 px-3 py-1.5 font-medium text-foreground shadow-sm",
      hidden: "sr-only",
    },
  },
  defaultVariants: {
    captions: "below",
  },
})

/** Icon buttons in the lightbox (prev, next, close). */
export const galleryControlVariants = cva(
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
)

export type GalleryListVariants = VariantProps<typeof galleryListVariants>
export type GalleryFrameVariants = VariantProps<typeof galleryFrameVariants>
export type GalleryCaptionVariants = VariantProps<typeof galleryCaptionVariants>
