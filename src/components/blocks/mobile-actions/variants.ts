import { cva, type VariantProps } from "class-variance-authority"

/**
 * Bottom action bar. `variant`: `bar` (full-width primary bar), `floating`
 * (pill above the bottom edge) or `split` (first action as a wide primary
 * button, the rest as outline buttons). `position="fixed"` pins it to the
 * viewport below `md` (hidden from `md` up); `"static"` renders it in flow at
 * every width (previews, or placing it yourself).
 */
export const mobileActionsVariants = cva("z-40 print:hidden", {
  variants: {
    variant: {
      bar: "border-t border-primary-foreground/20 bg-primary text-primary-foreground",
      floating:
        "mx-auto max-w-md rounded-4xl bg-primary p-1 text-primary-foreground shadow-lg",
      split:
        "border-t bg-background/95 p-2 text-foreground backdrop-blur supports-backdrop-filter:bg-background/80",
    },
    position: {
      fixed: "fixed md:hidden",
      static: "relative",
    },
  },
  compoundVariants: [
    {
      position: "fixed",
      variant: "bar",
      class: "inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]",
    },
    {
      position: "fixed",
      variant: "split",
      class: "inset-x-0 bottom-0 pb-[calc(0.5rem+env(safe-area-inset-bottom))]",
    },
    {
      position: "fixed",
      variant: "floating",
      class: "inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]",
    },
  ],
  defaultVariants: {
    variant: "bar",
    position: "fixed",
  },
})

export const mobileActionsListVariants = cva("", {
  variants: {
    variant: {
      bar: "grid auto-cols-fr grid-flow-col",
      floating: "grid auto-cols-fr grid-flow-col gap-1",
      split: "flex gap-2",
    },
  },
  defaultVariants: {
    variant: "bar",
  },
})

/** Each action: >= 44px tall, icon + visible label. */
export const mobileActionsItemVariants = cva(
  "flex h-full items-center justify-center font-medium whitespace-nowrap transition-colors focus-visible:outline-2 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        bar: "min-h-14 flex-col gap-1 px-2 text-xs hover:bg-primary-foreground/10 focus-visible:-outline-offset-4 focus-visible:outline-primary-foreground",
        floating:
          "min-h-12 gap-2 rounded-4xl px-3 text-sm hover:bg-primary-foreground/10 focus-visible:-outline-offset-2 focus-visible:outline-primary-foreground",
        split: "min-h-12 rounded-lg px-2",
      },
      /** Split: the first action is the prominent one. */
      primary: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "split",
        primary: true,
        class:
          "flex-row gap-2 bg-primary text-sm text-primary-foreground hover:bg-primary/90",
      },
      {
        variant: "split",
        primary: false,
        class: "flex-col gap-0.5 border bg-background text-xs hover:bg-muted",
      },
    ],
    defaultVariants: {
      variant: "bar",
      primary: false,
    },
  }
)

export type MobileActionsVariants = VariantProps<typeof mobileActionsVariants>
