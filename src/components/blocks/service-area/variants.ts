import { cva, type VariantProps } from "class-variance-authority"

/**
 * How the towns are listed: `chips` (wrapped pills), `columns` (multi-column
 * list with markers) or `inline` (one sentence: "London, Islington and
 * Camden").
 */
export const serviceAreaListVariants = cva("", {
  variants: {
    variant: {
      chips: "flex flex-wrap gap-2",
      columns: "columns-2 gap-x-6 sm:columns-3 lg:columns-4",
      inline: "text-lg text-pretty",
    },
    align: {
      start: "",
      center: "justify-center text-center",
    },
  },
  defaultVariants: {
    variant: "chips",
    align: "start",
  },
})

export const serviceAreaItemVariants = cva("", {
  variants: {
    variant: {
      chips:
        "inline-flex min-h-8 items-center gap-1.5 rounded-4xl border bg-card px-3 py-1 text-sm font-medium text-card-foreground",
      columns: "flex break-inside-avoid items-center gap-2 py-1",
      inline: "",
    },
  },
  defaultVariants: {
    variant: "chips",
  },
})

export type ServiceAreaListVariants = VariantProps<
  typeof serviceAreaListVariants
>
