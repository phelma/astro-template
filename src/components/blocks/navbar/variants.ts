import { cva, type VariantProps } from "class-variance-authority"

/**
 * Navbar root bar. `--navbar-height` drives the bar height and, for
 * `transparent`, the negative bottom margin that pulls the next element (a
 * hero) up underneath the bar. The centred layout is two rows on desktop.
 */
export const navbarVariants = cva(
  "z-40 w-full text-foreground [--navbar-height:var(--header-height,4rem)]",
  {
    variants: {
      /** `start`: brand left, nav + actions right. `center`: brand centred, nav below (desktop). */
      layout: {
        start: "",
        center: "md:[--navbar-height:7rem]",
      },
      variant: {
        solid: "bg-background",
        blurred:
          "bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75",
        // Sits over the next element (e.g. a hero image). The scrim keeps
        // text legible on any image; it turns solid once scrolled (CSS
        // scroll-driven animation, or `data-scrolled` from the script).
        transparent:
          "-mb-(--navbar-height) bg-transparent bg-linear-to-b from-background/90 via-background/80 via-60% to-transparent transition-[background-color,border-color,box-shadow] data-scrolled:bg-background data-scrolled:shadow-sm",
      },
      sticky: {
        true: "sticky top-0",
        false: "relative",
      },
      bordered: {
        true: "border-b",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "transparent",
        bordered: true,
        class: "border-transparent data-scrolled:border-border",
      },
    ],
    defaultVariants: {
      layout: "start",
      variant: "blurred",
      sticky: true,
      bordered: true,
    },
  }
)

/** Grid inside the bar: areas `lead` (centre only), `start`, `nav`, `end`. */
export const navbarContainerVariants = cva(
  "grid min-h-(--navbar-height) grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 [grid-template-areas:'start_end']",
  {
    variants: {
      layout: {
        start:
          "md:grid-cols-[auto_minmax(0,1fr)_auto] md:[grid-template-areas:'start_nav_end']",
        center:
          "md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:grid-rows-[4rem_minmax(3rem,auto)] md:[grid-template-areas:'lead_start_end'_'nav_nav_nav']",
      },
    },
    defaultVariants: {
      layout: "start",
    },
  }
)

/** Top-level link / dropdown trigger in the desktop nav. */
export const navbarLinkVariants = cva(
  "inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground aria-[current]:text-foreground data-active:text-foreground"
)

/** Link inside a dropdown panel. */
export const navbarDropdownLinkVariants = cva(
  "flex min-h-9 items-center rounded-md px-3 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground aria-[current]:bg-accent aria-[current]:font-medium aria-[current]:text-accent-foreground"
)

/** Mobile menu panel (a native popover). */
export const navbarMobileMenuVariants = cva(
  "m-0 hidden h-dvh max-h-none max-w-none flex-col gap-6 overflow-y-auto bg-background p-4 text-foreground open:flex md:open:hidden",
  {
    variants: {
      menu: {
        fullscreen: "inset-0 w-full",
        // Slides in from the right; motion is removed under
        // prefers-reduced-motion by the global rule in global.css.
        sheet:
          "inset-y-0 right-0 left-auto w-[min(22rem,calc(100vw-3rem))] translate-x-full border-l shadow-xl transition-[translate,display,overlay] transition-discrete duration-300 ease-out backdrop:bg-background/70 backdrop:backdrop-blur-sm open:translate-x-0 starting:open:translate-x-full",
      },
    },
    defaultVariants: {
      menu: "fullscreen",
    },
  }
)

/** Square icon button used for the mobile menu open/close controls. */
export const navbarIconButtonVariants = cva(
  "inline-flex size-11 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
)

/** Click-to-call link. `display` controls when the number text is shown. */
export const navbarPhoneVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
  {
    variants: {
      display: {
        /** Icon + number at every size. */
        full: "min-h-9 px-2",
        /** Icon-only (44px target) on small screens, number from `lg`. */
        responsive: "size-11 lg:size-auto lg:min-h-9 lg:px-2",
        /** Icon only. */
        icon: "size-11 md:size-9",
      },
    },
    defaultVariants: {
      display: "responsive",
    },
  }
)

/** Thin utility bar above the navbar. */
export const navbarTopBarVariants = cva("w-full text-sm", {
  variants: {
    tone: {
      muted: "bg-muted text-muted-foreground",
      default: "bg-background text-muted-foreground",
      primary:
        "bg-primary text-primary-foreground [--muted-foreground:var(--primary-foreground)]",
      secondary: "bg-secondary text-secondary-foreground",
    },
    bordered: {
      true: "border-b",
      false: "",
    },
  },
  defaultVariants: {
    tone: "muted",
    bordered: false,
  },
})

export type NavbarVariants = VariantProps<typeof navbarVariants>
export type NavbarMobileMenuVariants = VariantProps<
  typeof navbarMobileMenuVariants
>
export type NavbarPhoneVariants = VariantProps<typeof navbarPhoneVariants>
export type NavbarTopBarVariants = VariantProps<typeof navbarTopBarVariants>
