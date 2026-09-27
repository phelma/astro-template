import { cva, type VariantProps } from "class-variance-authority"

/**
 * Arrangement of testimonial items: a responsive grid of cards, one (or a
 * few) large featured quotes, or a horizontally scrolling, snap-aligned row.
 */
export const testimonialsListVariants = cva("", {
  variants: {
    layout: {
      grid: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
      featured: "mx-auto flex max-w-3xl flex-col gap-12",
      scroll:
        "flex gap-6 *:w-[85%] *:shrink-0 *:snap-start sm:*:w-[calc((100%-1.5rem)/2)] lg:*:w-[calc((100%-3rem)/3)]",
    },
  },
  defaultVariants: {
    layout: "grid",
  },
})

/** One testimonial: framed card or unframed quote, default or large text. */
export const testimonialCardVariants = cva("flex flex-col gap-4", {
  variants: {
    variant: {
      card: "h-full rounded-xl border bg-card p-6 text-card-foreground shadow-xs",
      plain: "",
    },
    size: {
      default: "",
      lg: "items-center gap-6 text-center",
    },
  },
  defaultVariants: {
    variant: "card",
    size: "default",
  },
})

/** Quote text size, paired with the card `size`. */
export const testimonialQuoteVariants = cva("", {
  variants: {
    size: {
      default: "text-base",
      lg: "font-heading text-2xl leading-snug sm:text-3xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export const starRatingVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      sm: "[&_svg]:size-4",
      default: "[&_svg]:size-5",
      lg: "[&_svg]:size-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export type TestimonialsListVariants = VariantProps<
  typeof testimonialsListVariants
>
export type TestimonialCardVariants = VariantProps<
  typeof testimonialCardVariants
>
export type StarRatingVariants = VariantProps<typeof starRatingVariants>
