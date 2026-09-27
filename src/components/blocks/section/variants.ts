import { cva, type VariantProps } from "class-variance-authority"

/**
 * Page section: background band (`tone`) and vertical rhythm (`spacing`).
 * The inner width lives on `containerVariants` so a full-bleed background can
 * wrap a constrained column.
 */
export const sectionVariants = cva("", {
  variants: {
    tone: {
      default: "bg-background text-foreground",
      muted: "bg-muted text-foreground",
      card: "bg-card text-card-foreground",
      // Re-points muted text and eyebrows at the foreground so they stay
      // legible on the brand colour.
      primary:
        "bg-primary text-primary-foreground [--muted-foreground:color-mix(in_oklch,var(--primary-foreground),transparent_20%)] **:data-[slot=section-eyebrow]:text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
    spacing: {
      none: "",
      sm: "py-8 md:py-12",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-24",
    },
    bordered: {
      true: "border-y",
      false: "",
    },
  },
  defaultVariants: {
    tone: "default",
    spacing: "md",
    bordered: false,
  },
})

export const containerVariants = cva("mx-auto w-full px-4 sm:px-6", {
  variants: {
    width: {
      narrow: "max-w-3xl",
      default: "max-w-6xl",
      wide: "max-w-7xl",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    width: "default",
  },
})

export const sectionHeaderVariants = cva("flex flex-col gap-3", {
  variants: {
    align: {
      start: "items-start text-left",
      center: "mx-auto items-center text-center",
    },
  },
  defaultVariants: {
    align: "start",
  },
})

export type SectionVariants = VariantProps<typeof sectionVariants>
export type ContainerVariants = VariantProps<typeof containerVariants>
export type SectionHeaderVariants = VariantProps<typeof sectionHeaderVariants>

/** Heading level for blocks that render their own heading. */
export type HeadingLevel = 2 | 3 | 4 | 5 | 6
