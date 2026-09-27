import { cva, type VariantProps } from "class-variance-authority"

/**
 * Step list layout. `horizontal` joins numbers with a connector line from
 * medium screens up (vertical timeline below that); `timeline` is always
 * vertical; `cards` frames each step.
 */
export const stepsListVariants = cva("grid", {
  variants: {
    variant: {
      horizontal: "gap-8 md:gap-6",
      timeline: "mx-auto max-w-2xl gap-0",
      cards: "gap-6",
    },
    columns: {
      2: "",
      3: "",
      4: "",
    },
  },
  compoundVariants: [
    { variant: "horizontal", columns: 2, class: "md:grid-cols-2" },
    { variant: "horizontal", columns: 3, class: "md:grid-cols-3" },
    { variant: "horizontal", columns: 4, class: "md:grid-cols-4" },
    { variant: "cards", columns: 2, class: "sm:grid-cols-2" },
    { variant: "cards", columns: 3, class: "sm:grid-cols-2 lg:grid-cols-3" },
    { variant: "cards", columns: 4, class: "sm:grid-cols-2 lg:grid-cols-4" },
  ],
  defaultVariants: {
    variant: "horizontal",
    columns: 3,
  },
})

/**
 * One step. The connector is drawn by `step-connector`: vertical between
 * numbers in `timeline` (and small-screen `horizontal`), horizontal from `md`.
 */
export const stepItemVariants = cva("relative flex", {
  variants: {
    variant: {
      horizontal: "gap-4 md:flex-col",
      timeline: "gap-5 pb-10 last:pb-0",
      cards:
        "h-full flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-xs",
    },
  },
  defaultVariants: {
    variant: "horizontal",
  },
})

/**
 * The step number. On a primary band (`in-[.bg-primary]:`) it switches to
 * the foreground colour, where `primary` would be invisible.
 */
export const stepNumberVariants = cva(
  "relative z-10 inline-flex shrink-0 items-center justify-center font-heading font-semibold tabular-nums",
  {
    variants: {
      variant: {
        horizontal:
          "size-11 rounded-full bg-primary text-lg text-primary-foreground in-[.bg-primary]:bg-primary-foreground in-[.bg-primary]:text-primary",
        timeline:
          "size-11 rounded-full border-2 border-primary text-lg text-primary in-[.bg-primary]:border-current in-[.bg-primary]:text-current",
        cards: "text-4xl text-primary",
      },
    },
    defaultVariants: {
      variant: "horizontal",
    },
  }
)

export type StepsListVariants = VariantProps<typeof stepsListVariants>
export type StepItemVariants = VariantProps<typeof stepItemVariants>
