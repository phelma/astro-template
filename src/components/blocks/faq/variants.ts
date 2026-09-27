import { cva, type VariantProps } from "class-variance-authority"

/** Question list: ruled rows or separate cards. */
export const faqListVariants = cva("flex flex-col", {
  variants: {
    variant: {
      list: "border-y",
      cards: "gap-3",
    },
  },
  defaultVariants: {
    variant: "list",
  },
})

/** One <details> item, matching the list variant. */
export const faqItemVariants = cva("group", {
  variants: {
    variant: {
      list: "border-b last:border-b-0",
      cards:
        "rounded-lg border bg-card px-5 text-card-foreground shadow-xs open:shadow-sm",
    },
  },
  defaultVariants: {
    variant: "list",
  },
})

/** Header placement: above the questions, or beside them on wide screens. */
export const faqLayoutVariants = cva("", {
  variants: {
    layout: {
      stacked: "",
      split:
        "grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16 lg:*:data-[slot=section-header]:sticky lg:*:data-[slot=section-header]:top-[calc(var(--header-height)+2rem)] lg:*:data-[slot=section-header]:mb-0 lg:*:data-[slot=section-header]:self-start",
    },
  },
  defaultVariants: {
    layout: "stacked",
  },
})

export type FaqListVariants = VariantProps<typeof faqListVariants>
export type FaqItemVariants = VariantProps<typeof faqItemVariants>
export type FaqLayoutVariants = VariantProps<typeof faqLayoutVariants>
