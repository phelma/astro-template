import { cva, type VariantProps } from "class-variance-authority"

/**
 * Content-page header. `banded` is set automatically when a non-default
 * Section tone is used: the header gets its own padding and a gap before
 * the page content. `align` centres the text (and puts the image below).
 */
export const pageHeaderVariants = cva("group/page-header", {
  variants: {
    banded: {
      true: "mb-10 py-12 md:mb-12 md:py-16",
      false: "pt-10 pb-8",
    },
  },
  defaultVariants: {
    banded: false,
  },
})

export const pageHeaderContainerVariants = cva("", {
  variants: {
    align: {
      start: "",
      center: "",
    },
    hasImage: {
      true: "grid items-center gap-8",
      false: "",
    },
  },
  compoundVariants: [
    {
      align: "start",
      hasImage: true,
      class: "md:grid-cols-2 md:gap-12",
    },
  ],
  defaultVariants: {
    align: "start",
    hasImage: false,
  },
})

export type PageHeaderVariants = VariantProps<typeof pageHeaderVariants>
export type PageHeaderAlign = NonNullable<
  VariantProps<typeof pageHeaderContainerVariants>["align"]
>
