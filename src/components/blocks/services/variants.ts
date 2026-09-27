import { cva, type VariantProps } from "class-variance-authority"

/** Arrangement of services. `rows` alternates image and text. */
export const servicesListVariants = cva("grid", {
  variants: {
    variant: {
      icon: "gap-6",
      image: "gap-6",
      list: "gap-x-12 gap-y-8",
      rows: "gap-16 md:gap-24",
    },
    columns: {
      2: "",
      3: "",
      4: "",
    },
  },
  compoundVariants: [
    { variant: ["icon", "image"], columns: 2, class: "sm:grid-cols-2" },
    {
      variant: ["icon", "image"],
      columns: 3,
      class: "sm:grid-cols-2 lg:grid-cols-3",
    },
    {
      variant: ["icon", "image"],
      columns: 4,
      class: "sm:grid-cols-2 lg:grid-cols-4",
    },
    { variant: "list", columns: [2, 3, 4], class: "sm:grid-cols-2" },
    { variant: "list", columns: [3, 4], class: "lg:grid-cols-3" },
  ],
  defaultVariants: {
    variant: "icon",
    columns: 3,
  },
})

/** One service in a grid: icon card, image card, or compact list item. */
export const serviceCardVariants = cva("group/service relative flex gap-4", {
  variants: {
    variant: {
      icon: "h-full flex-col rounded-xl border bg-card p-6 text-card-foreground shadow-xs",
      image:
        "h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs",
      list: "flex-row items-start",
    },
    interactive: {
      true: "transition-shadow has-[a:hover]:shadow-md",
      false: "",
    },
  },
  compoundVariants: [
    { variant: "list", interactive: true, class: "has-[a:hover]:shadow-none" },
  ],
  defaultVariants: {
    variant: "icon",
    interactive: false,
  },
})

/** Icon badge used by icon cards and list items. */
export const serviceIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
  {
    variants: {
      size: {
        default: "size-11 [&_svg]:size-5",
        sm: "size-9 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export type ServicesListVariants = VariantProps<typeof servicesListVariants>
export type ServiceCardVariants = VariantProps<typeof serviceCardVariants>
