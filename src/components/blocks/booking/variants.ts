import { cva, type VariantProps } from "class-variance-authority"

/**
 * BookingCta frame. `card`: bordered card; `primary`: brand-coloured panel
 * (muted text re-pointed so it stays legible); `inline`: no frame, for use
 * inside another block. `layout` stacks or puts the actions beside the copy.
 */
export const bookingCtaVariants = cva("flex gap-6", {
  variants: {
    variant: {
      card: "rounded-xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8",
      primary:
        "rounded-xl bg-primary p-6 text-primary-foreground shadow-md [--muted-foreground:color-mix(in_oklch,var(--primary-foreground),transparent_20%)] sm:p-8",
      muted: "rounded-xl bg-muted p-6 text-foreground sm:p-8",
      inline: "",
    },
    layout: {
      stacked: "flex-col items-start",
      row: "flex-col items-start md:flex-row md:items-center md:justify-between",
      centered: "flex-col items-center text-center",
    },
  },
  defaultVariants: {
    variant: "card",
    layout: "row",
  },
})

export type BookingCtaVariants = VariantProps<typeof bookingCtaVariants>
