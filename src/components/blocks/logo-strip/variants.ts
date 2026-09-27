import { cva, type VariantProps } from "class-variance-authority"

/**
 * Logo row. `grayscale` desaturates logos (CSS filter, so any logo works)
 * until hovered or focused. `marquee` scrolls continuously; see LogoStrip.
 */
export const logoStripListVariants = cva("flex items-center", {
  variants: {
    variant: {
      static: "flex-wrap gap-x-10 gap-y-6",
      grayscale:
        "flex-wrap gap-x-10 gap-y-6 *:grayscale *:transition-[filter,opacity] *:focus-within:grayscale-0 *:hover:grayscale-0 [&_img]:opacity-75 *:focus-within:[&_img]:opacity-100 *:hover:[&_img]:opacity-100",
      // min-w-full: each copy spans the viewport, so the loop has no gap.
      marquee: "min-w-full shrink-0 gap-x-12 pe-12",
    },
    align: {
      start: "justify-start",
      center: "justify-center",
    },
  },
  compoundVariants: [
    { variant: "marquee", align: ["start", "center"], class: "justify-around" },
  ],
  defaultVariants: {
    variant: "static",
    align: "center",
  },
})

/** Marquee wrapper; `speed` sets seconds per loop. */
export const logoStripMarqueeVariants = cva(
  "group/marquee flex flex-col gap-3",
  {
    variants: {
      speed: {
        slow: "[--logo-strip-duration:60s]",
        default: "[--logo-strip-duration:40s]",
        fast: "[--logo-strip-duration:25s]",
      },
    },
    defaultVariants: {
      speed: "default",
    },
  }
)

/** Logo height: images scale to it; text placeholders match it. */
export const logoStripItemVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md",
  {
    variants: {
      size: {
        sm: "h-8 [&_img]:h-8",
        default: "h-12 [&_img]:h-12",
        lg: "h-16 [&_img]:h-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export type LogoStripListVariants = VariantProps<typeof logoStripListVariants>
export type LogoStripMarqueeVariants = VariantProps<
  typeof logoStripMarqueeVariants
>
export type LogoStripItemVariants = VariantProps<typeof logoStripItemVariants>
