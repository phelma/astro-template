import { cva, type VariantProps } from "class-variance-authority"

import type { SectionVariants } from "../section/variants"

/**
 * Call-to-action panel inside the section. The root is a `group/cta` with
 * `data-variant`, so parts adapt with `group-data-[variant=...]/cta:`.
 *
 * - band: full-width band, text left and actions right (the default).
 * - card: an inset, rounded box; `tone` colours the box, not the section.
 * - split: text and actions beside an image.
 * - centered: centred text with actions below.
 */
export const ctaVariants = cva("", {
  variants: {
    variant: {
      band: "flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between",
      card: "flex flex-col items-start gap-6 rounded-2xl border p-8 shadow-lg md:flex-row md:items-center md:justify-between md:p-12",
      split: "grid items-center gap-10 lg:grid-cols-2 lg:gap-12",
      centered:
        "mx-auto flex max-w-3xl flex-col items-center gap-6 text-center",
    },
  },
  defaultVariants: {
    variant: "band",
  },
})

export type CtaVariants = VariantProps<typeof ctaVariants>
export type CtaVariant = NonNullable<CtaVariants["variant"]>
export type CtaTone = NonNullable<SectionVariants["tone"]>

/** Tone used when none is passed, per variant. */
export const ctaDefaultTone: Record<CtaVariant, CtaTone> = {
  band: "muted",
  card: "primary",
  split: "muted",
  centered: "primary",
}

/**
 * Outline buttons paint `bg-background` with inherited text, which is
 * illegible on the primary tone. Add this to outline links on a primary
 * band/card to make them transparent in the band's text colour.
 */
export const ctaOnPrimaryOutline =
  "border-current! bg-transparent! text-current! hover:bg-current/15!"
