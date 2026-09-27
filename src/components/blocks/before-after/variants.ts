import { cva, type VariantProps } from "class-variance-authority"

/**
 * Before/after comparison. `orientation`: which way the divider moves
 * (horizontal: before on the left; vertical: before on top).
 */
export const beforeAfterVariants = cva("group/before-after", {
  variants: {
    orientation: {
      horizontal: "",
      vertical: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

/** "Before" / "After" tags over the images. */
export const beforeAfterLabelVariants = cva(
  "pointer-events-none absolute z-10 rounded-md px-2 py-1 text-xs font-semibold tracking-wide uppercase shadow-sm",
  {
    variants: {
      tone: {
        default: "bg-background/90 text-foreground",
        primary: "bg-primary text-primary-foreground",
        inverted: "bg-foreground/85 text-background",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
)

/** Grid of comparisons (BeforeAfterGrid). */
export const beforeAfterGridVariants = cva("grid gap-8", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: {
    columns: 2,
  },
})

export type BeforeAfterVariants = VariantProps<typeof beforeAfterVariants>
export type BeforeAfterLabelVariants = VariantProps<
  typeof beforeAfterLabelVariants
>
export type BeforeAfterGridVariants = VariantProps<
  typeof beforeAfterGridVariants
>
