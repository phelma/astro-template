import { cva, type VariantProps } from "class-variance-authority"

/** Wrapper of the full opening hours block: card or bare, spacing. */
export const openingHoursVariants = cva("flex flex-col gap-4", {
  variants: {
    variant: {
      card: "rounded-xl border bg-card p-4 text-card-foreground shadow-sm sm:p-6",
      bare: "",
    },
  },
  defaultVariants: {
    variant: "card",
  },
})

/**
 * The week list. `density="full"` has one row per day; `"compact"` groups
 * days with the same hours ("Mon–Fri"). `orientation="horizontal"` lays the
 * rows out as columns from `md` up (days across the top).
 */
export const openingHoursListVariants = cva("grid", {
  variants: {
    orientation: {
      vertical: "grid-cols-1",
      horizontal: "grid-cols-1 md:auto-cols-fr md:grid-flow-col md:gap-2",
    },
    density: {
      full: "",
      compact: "text-sm",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    density: "full",
  },
})

/** One day (or group of days). `data-today` is set client-side. */
export const openingHoursRowVariants = cva(
  "flex gap-4 rounded-md data-today:bg-muted data-today:font-semibold",
  {
    variants: {
      orientation: {
        vertical:
          "items-baseline justify-between border-b px-2 last:border-b-0",
        horizontal:
          "items-baseline justify-between border-b px-2 last:border-b-0 md:flex-col md:items-center md:gap-1 md:border-b-0 md:px-2 md:py-3 md:text-center",
      },
      density: {
        full: "py-2",
        compact: "py-1.5",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      density: "full",
    },
  }
)

/**
 * "Open now · closes 5:30pm". The state (`data-state`: unknown, open,
 * closing-soon, opens-later, closed) is set client-side; the dot colour and
 * icon follow it via `group-data-[state=…]/status`.
 */
export const openingHoursStatusVariants = cva(
  "group/status inline-flex max-w-full items-center gap-x-2 gap-y-0.5 font-medium",
  {
    variants: {
      variant: {
        badge: "rounded-4xl bg-muted px-3 py-1 text-foreground",
        outline: "rounded-4xl border px-3 py-1",
        plain: "",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      density: {
        full: "",
        compact:
          "**:data-[slot=opening-hours-status-detail]:hidden **:data-[slot=opening-hours-status-separator]:hidden",
      },
    },
    defaultVariants: {
      variant: "badge",
      size: "md",
      density: "full",
    },
  }
)

/**
 * Status dot: token colours per state (primary open, destructive closed).
 * On a primary band (`data-tone="primary"`) the open dot uses the band's
 * foreground so it stays visible.
 */
export const openingHoursStatusDotVariants = cva(
  "inline-block size-2 shrink-0 rounded-full bg-muted-foreground group-data-[state=closed]/status:bg-destructive group-data-[state=closing-soon]/status:bg-primary group-data-[state=open]/status:bg-primary group-data-[state=unknown]/status:hidden in-data-[tone=primary]:group-data-[state=closing-soon]/status:bg-primary-foreground in-data-[tone=primary]:group-data-[state=open]/status:bg-primary-foreground motion-safe:group-data-[state=closing-soon]/status:animate-pulse forced-colors:bg-[CanvasText]"
)

export type OpeningHoursVariants = VariantProps<typeof openingHoursVariants>
export type OpeningHoursListVariants = VariantProps<
  typeof openingHoursListVariants
>
export type OpeningHoursStatusVariants = VariantProps<
  typeof openingHoursStatusVariants
>
