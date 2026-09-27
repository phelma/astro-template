import { cva, type VariantProps } from "class-variance-authority"

/**
 * Footer band colour. Every tone sets `--footer-foreground` (full-contrast
 * text, used for link hover) and re-points `--muted-foreground`, `--border`
 * and `--ring` where needed, so parts stay legible and focus stays visible
 * on any background.
 */
export const footerVariants = cva("text-(--footer-foreground)", {
  variants: {
    tone: {
      default: "border-t bg-background [--footer-foreground:var(--foreground)]",
      muted: "border-t bg-muted [--footer-foreground:var(--foreground)]",
      card: "border-t bg-card [--footer-foreground:var(--card-foreground)]",
      primary:
        "bg-primary [--border:color-mix(in_oklch,var(--primary-foreground),transparent_75%)] [--footer-foreground:var(--primary-foreground)] [--muted-foreground:color-mix(in_oklch,var(--primary-foreground),transparent_20%)] [--ring:var(--primary-foreground)]",
      inverted:
        "bg-foreground [--border:color-mix(in_oklch,var(--background),transparent_75%)] [--footer-foreground:var(--background)] [--muted-foreground:color-mix(in_oklch,var(--background),transparent_25%)] [--ring:var(--background)]",
    },
  },
  defaultVariants: {
    tone: "default",
  },
})

/**
 * Arrangement of the default `Footer` composition. `simple`: one row
 * (copyright, links, socials). `columns`: brand + link columns + contact
 * (+ hours) over a legal bar. `centered`: stacked and centred. `cta`:
 * `columns` under a call-to-action band.
 */
export const footerLayoutVariants = cva("", {
  variants: {
    layout: {
      simple:
        "flex flex-col gap-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between",
      columns:
        "grid gap-x-8 gap-y-10 py-12 sm:grid-cols-2 md:py-16 lg:auto-cols-fr lg:grid-flow-col",
      centered: "flex flex-col items-center gap-6 py-12 text-center",
      cta: "grid gap-x-8 gap-y-10 py-12 sm:grid-cols-2 md:py-16 lg:auto-cols-fr lg:grid-flow-col",
    },
  },
  defaultVariants: {
    layout: "simple",
  },
})

/** Bottom bar under `columns` / `cta` / `centered`: legal line + socials. */
export const footerBarVariants = cva(
  "flex flex-col gap-4 border-t py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between",
  {
    variants: {
      align: {
        between: "",
        center: "items-center text-center md:flex-col md:justify-center",
      },
    },
    defaultVariants: {
      align: "between",
    },
  }
)

/** Text links in the footer (columns, legal, contact). */
export const footerLinkVariants = cva(
  "inline-flex min-h-6 items-center gap-2 underline-offset-4 transition-colors hover:text-(--footer-foreground) hover:underline",
  {
    variants: {
      emphasis: {
        muted: "text-muted-foreground",
        strong: "font-medium text-(--footer-foreground)",
      },
    },
    defaultVariants: {
      emphasis: "muted",
    },
  }
)

/** Link list direction (FooterColumn). */
export const footerLinksVariants = cva("flex text-sm", {
  variants: {
    orientation: {
      vertical: "flex-col gap-2",
      horizontal: "flex-wrap gap-x-4 gap-y-2",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

/** Call-to-action band at the top of the `cta` layout. */
export const footerCtaVariants = cva("", {
  variants: {
    tone: {
      primary:
        "bg-primary text-primary-foreground [--ring:var(--primary-foreground)]",
      secondary: "bg-secondary text-secondary-foreground",
      muted: "border-b bg-muted text-foreground",
      inverted: "bg-foreground text-background [--ring:var(--background)]",
    },
  },
  defaultVariants: {
    tone: "primary",
  },
})

/**
 * Buttons in the CTA band. `primary` contrasts with the band; `secondary`
 * is an outline in the band's text colour.
 */
export const footerCtaActionVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 rounded-md border px-5 text-base font-medium whitespace-nowrap transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        primary: "",
        secondary: "",
        muted: "",
        inverted: "",
      },
      emphasis: {
        primary: "shadow-sm",
        secondary: "border-current bg-transparent hover:bg-current/10",
      },
    },
    compoundVariants: [
      {
        tone: ["primary", "inverted"],
        emphasis: "primary",
        class:
          "border-transparent bg-background text-foreground hover:bg-background/90",
      },
      {
        tone: ["secondary", "muted"],
        emphasis: "primary",
        class:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
      },
    ],
    defaultVariants: {
      tone: "primary",
      emphasis: "primary",
    },
  }
)

export type FooterVariants = VariantProps<typeof footerVariants>
export type FooterLayoutVariants = VariantProps<typeof footerLayoutVariants>
export type FooterBarVariants = VariantProps<typeof footerBarVariants>
export type FooterLinkVariants = VariantProps<typeof footerLinkVariants>
export type FooterLinksVariants = VariantProps<typeof footerLinksVariants>
export type FooterCtaVariants = VariantProps<typeof footerCtaVariants>
export type FooterCtaActionVariants = VariantProps<
  typeof footerCtaActionVariants
>
