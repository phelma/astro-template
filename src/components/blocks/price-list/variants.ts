import { cva, type VariantProps } from "class-variance-authority"

/** Wrapper around the groups: one column, or two on medium screens and up. */
export const priceListVariants = cva("grid gap-12", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "gap-x-16 md:grid-cols-2",
    },
    variant: {
      plain: "",
      leader: "",
      cards: "",
    },
  },
  compoundVariants: [{ variant: "cards", class: "gap-6 md:gap-6" }],
  defaultVariants: {
    columns: 1,
    variant: "plain",
  },
})

/** One group (e.g. "Cuts", "Colour"): bare, or framed as a card. */
export const priceListGroupVariants = cva("flex flex-col gap-4", {
  variants: {
    variant: {
      plain: "",
      leader: "",
      cards: "rounded-xl border bg-card p-6 text-card-foreground shadow-xs",
    },
  },
  defaultVariants: {
    variant: "plain",
  },
})

/** Items inside a group: ruled rows, or unruled with dotted leaders. */
export const priceListItemsVariants = cva("flex flex-col", {
  variants: {
    variant: {
      plain: "divide-y border-t",
      leader: "",
      cards: "divide-y",
    },
  },
  defaultVariants: {
    variant: "plain",
  },
})

export type PriceListVariants = VariantProps<typeof priceListVariants>
export type PriceListGroupVariants = VariantProps<typeof priceListGroupVariants>
