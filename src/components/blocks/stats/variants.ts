import { cva, type VariantProps } from "class-variance-authority"

/**
 * The stats row. `dividers` is a single row split by rules (stacks on small
 * screens); the others are grids sized by `columns`.
 */
export const statsListVariants = cva("", {
  variants: {
    variant: {
      plain: "grid gap-x-8 gap-y-10",
      cards: "grid gap-4 md:gap-6",
      band: "grid gap-x-8 gap-y-10",
      dividers:
        "flex flex-col divide-y in-data-[tone=primary]:divide-current/30 sm:flex-row sm:divide-x sm:divide-y-0",
    },
    columns: {
      2: "",
      3: "",
      4: "",
    },
  },
  compoundVariants: [
    {
      variant: ["plain", "cards", "band"],
      columns: 2,
      class: "grid-cols-2",
    },
    {
      variant: ["plain", "cards", "band"],
      columns: 3,
      class: "grid-cols-2 md:grid-cols-3",
    },
    {
      variant: ["plain", "cards", "band"],
      columns: 4,
      class: "grid-cols-2 lg:grid-cols-4",
    },
  ],
  defaultVariants: {
    variant: "plain",
    columns: 4,
  },
})

export const statItemVariants = cva("flex flex-col gap-1", {
  variants: {
    variant: {
      plain: "",
      cards:
        "rounded-xl border bg-card p-5 text-card-foreground shadow-xs sm:p-6",
      band: "items-center text-center",
      dividers: "flex-1 items-center py-6 text-center sm:px-6 sm:py-2",
    },
  },
  defaultVariants: {
    variant: "plain",
  },
})

export const statValueVariants = cva(
  "-order-1 font-heading leading-none font-semibold tracking-tight tabular-nums",
  {
    variants: {
      size: {
        default: "text-4xl sm:text-5xl",
        sm: "text-3xl sm:text-4xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export type StatsListVariants = VariantProps<typeof statsListVariants>
export type StatItemVariants = VariantProps<typeof statItemVariants>
