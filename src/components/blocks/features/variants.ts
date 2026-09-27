import { cva, type VariantProps } from "class-variance-authority"

/**
 * Features list (`<ul>`): variant and column count. The list is a
 * `group/features` with `data-variant`, so items, icons and text adapt with
 * `group-data-[variant=...]/features:` and need no props of their own.
 *
 * - grid: icon above title and text.
 * - list: icon beside title and text.
 * - cards: grid items in bordered cards.
 * - checklist: compact ticks ("Fully insured", "Free quotes").
 */
export const featuresVariants = cva("group/features grid", {
  variants: {
    variant: {
      grid: "gap-x-8 gap-y-10",
      list: "gap-x-10 gap-y-8",
      cards: "gap-6",
      checklist: "gap-x-8 gap-y-4",
    },
    columns: {
      1: "",
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-2 lg:grid-cols-3",
      4: "sm:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: {
    variant: "grid",
    columns: 3,
  },
})

export type FeaturesVariants = VariantProps<typeof featuresVariants>
export type FeaturesVariant = NonNullable<FeaturesVariants["variant"]>

/** One feature/benefit. */
export interface FeatureItem {
  title: string
  description?: string
  /** astro-icon name, e.g. "lucide:shield-check". Decorative. Checklist defaults to a tick. */
  icon?: string
  /** Makes the title a link (the whole card in `cards`). */
  href?: string
}
