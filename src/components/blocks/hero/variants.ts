import { cva, type VariantProps } from "class-variance-authority"

/**
 * Hero root: layout, height and (overlay only) the scrim tone. The root sets
 * `data-layout`, `data-size`, `data-align` and `data-scrim` and is a
 * `group/hero`, so every part adapts with `group-data-[layout=...]/hero:`
 * utilities and needs no layout prop of its own.
 *
 * - split: text beside the image (image right on large screens).
 * - centered: centred text, optional image below.
 * - overlay: full-bleed background photo behind a token-coloured scrim.
 * - stacked: text, then a wide cropped image.
 * - minimal: text only.
 */
export const heroVariants = cva(
  "group/hero relative isolate flex flex-col justify-center overflow-hidden",
  {
    variants: {
      layout: {
        split: "",
        centered: "",
        overlay: "",
        stacked: "",
        minimal: "",
      },
      size: {
        sm: "py-10 md:py-14",
        md: "py-16 md:py-24",
        lg: "py-20 md:min-h-[36rem] md:py-28",
        // Fills the viewport below the sticky header.
        screen: "min-h-[calc(100svh-var(--header-height,4rem))] py-16 md:py-24",
      },
      // Scrim over the overlay photo. Each keeps text >= 4.5:1 over any
      // pixel (70% foreground or 80% background over pure white/black).
      // dim: a dark scrim with light text in both modes (foreground in
      // light mode, background in dark). foreground/background: follow the
      // token in both modes, so the scrim flips with the colour mode.
      scrim: {
        dim: "",
        foreground: "",
        background: "",
      },
    },
    compoundVariants: [
      {
        layout: "overlay",
        scrim: "dim",
        class: "text-background dark:text-foreground",
      },
      { layout: "overlay", scrim: "foreground", class: "text-background" },
      { layout: "overlay", scrim: "background", class: "text-foreground" },
    ],
    defaultVariants: {
      layout: "split",
      size: "md",
      scrim: "dim",
    },
  }
)

/** Inner column: arranges content and media per layout. */
export const heroContainerVariants = cva(
  "mx-auto w-full max-w-6xl px-4 sm:px-6",
  {
    variants: {
      layout: {
        split: "grid items-center gap-10 lg:grid-cols-2 lg:gap-12",
        centered: "flex flex-col items-center gap-10 md:gap-14",
        overlay: "flex flex-col",
        stacked: "flex flex-col gap-10 md:gap-14",
        minimal: "flex flex-col",
      },
    },
    defaultVariants: {
      layout: "split",
    },
  }
)

/**
 * Extra classes for `buttonVariants({ variant: "outline" })` links in a hero.
 * The outline button paints `bg-background`/`bg-input` with inherited text,
 * which is illegible over the overlay scrim; on overlays this makes it a
 * transparent button in the scrim's text colour. No effect in other layouts.
 */
export const heroOverlayOutline =
  "group-data-[layout=overlay]/hero:border-current! group-data-[layout=overlay]/hero:bg-transparent! group-data-[layout=overlay]/hero:text-current! group-data-[layout=overlay]/hero:hover:bg-current/15!"

export type HeroVariants = VariantProps<typeof heroVariants>
export type HeroLayout = NonNullable<HeroVariants["layout"]>

/** Content alignment; `centered` always centres, `split` always starts. */
export type HeroAlign = "start" | "center"

/** Heading level for the hero title: 1 on pages, 2-3 inside showcases. */
export type HeroHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
