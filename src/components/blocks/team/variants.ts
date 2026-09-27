import { cva, type VariantProps } from "class-variance-authority"

/** Team list: photo grid (framed or plain) or a compact two-column list. */
export const teamListVariants = cva("grid", {
  variants: {
    variant: {
      cards: "gap-6",
      plain: "gap-x-6 gap-y-10",
      compact: "gap-x-10 gap-y-6 md:grid-cols-2",
    },
    columns: {
      2: "",
      3: "",
      4: "",
    },
  },
  compoundVariants: [
    { variant: ["cards", "plain"], columns: 2, class: "sm:grid-cols-2" },
    {
      variant: ["cards", "plain"],
      columns: 3,
      class: "sm:grid-cols-2 lg:grid-cols-3",
    },
    {
      variant: ["cards", "plain"],
      columns: 4,
      class: "grid-cols-2 lg:grid-cols-4",
    },
  ],
  defaultVariants: {
    variant: "cards",
    columns: 3,
  },
})

export const teamMemberVariants = cva("flex", {
  variants: {
    variant: {
      cards:
        "h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
      plain: "flex-col gap-4",
      compact: "items-start gap-4",
    },
  },
  defaultVariants: {
    variant: "cards",
  },
})

export type TeamListVariants = VariantProps<typeof teamListVariants>
export type TeamMemberVariants = VariantProps<typeof teamMemberVariants>
