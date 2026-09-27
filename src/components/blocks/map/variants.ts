import { cva, type VariantProps } from "class-variance-authority"

export { embedVariants as mapFrameVariants } from "../embed/variants"

/**
 * Link row under the map ("Get directions", "Open in Google Maps"). For the
 * edge-to-edge `bare` map the row is padded to line up with page content.
 */
export const mapActionsVariants = cva("flex flex-wrap items-center gap-2", {
  variants: {
    variant: {
      card: "",
      outline: "",
      bare: "mx-auto w-full max-w-6xl px-4 sm:px-6",
    },
  },
  defaultVariants: {
    variant: "card",
  },
})

/** MapSection: map beside an address/contact panel. */
export const mapSectionVariants = cva("grid items-stretch gap-6 lg:gap-10", {
  variants: {
    layout: {
      /** Map left (on large screens), panel right. */
      "map-start": "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
      /** Panel left, map right. */
      "map-end": "lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
      /** Panel above map, full width. */
      stacked: "",
    },
  },
  defaultVariants: {
    layout: "map-end",
  },
})

export type MapActionsVariants = VariantProps<typeof mapActionsVariants>
export type MapSectionVariants = VariantProps<typeof mapSectionVariants>
