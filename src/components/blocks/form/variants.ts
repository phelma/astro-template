import { cva, type VariantProps } from "class-variance-authority"

/**
 * Form styles. The native controls here (checkbox, radio, switch, file) are
 * styled to match the shadcn Input / Textarea / NativeSelect in
 * src/components/ui: same border (`border-input`), radius, shadow, focus ring
 * and invalid treatment. Invalid is `aria-invalid` (set by the validation
 * script or a server-side `error`) and `:user-invalid` (no-JS fallback).
 */

/** Shared focus / invalid / disabled states for the native box controls. */
const controlStates =
  "shrink-0 cursor-pointer appearance-none border border-input bg-transparent shadow-xs transition-[color,background-color,border-color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 user-invalid:border-destructive dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 forced-colors:appearance-auto"

/** Checkbox box. The tick is an icon overlaid in `Checkbox.astro`. */
export const checkboxVariants = cva(
  [
    controlStates,
    "peer col-start-1 row-start-1 rounded-sm checked:border-primary checked:bg-primary dark:checked:bg-primary",
  ],
  {
    variants: {
      size: {
        default: "size-5",
        sm: "size-4",
      },
    },
    defaultVariants: { size: "default" },
  }
)

/** Radio circle. The dot is an icon overlaid in `Radio.astro`. */
export const radioVariants = cva(
  [
    controlStates,
    "peer col-start-1 row-start-1 rounded-full checked:border-primary checked:bg-primary dark:checked:bg-primary",
  ],
  {
    variants: {
      size: {
        default: "size-5",
        sm: "size-4",
      },
    },
    defaultVariants: { size: "default" },
  }
)

/** Switch track (a checkbox with role="switch"); the thumb is a sibling. */
export const switchVariants = cva(
  [
    controlStates,
    "peer col-start-1 row-start-1 rounded-full border-transparent bg-input checked:bg-primary dark:bg-input/80 dark:checked:bg-primary",
  ],
  {
    variants: {
      size: {
        default: "h-6 w-10",
        sm: "h-5 w-8",
      },
    },
    defaultVariants: { size: "default" },
  }
)

/** Thumb that slides across the switch track. */
export const switchThumbVariants = cva(
  "pointer-events-none relative col-start-1 row-start-1 self-center rounded-full bg-background shadow-sm ring-0 transition-transform peer-checked:bg-primary-foreground peer-disabled:opacity-50 dark:bg-foreground dark:peer-checked:bg-primary-foreground forced-colors:hidden",
  {
    variants: {
      size: {
        default: "ml-0.5 size-5 peer-checked:translate-x-4",
        sm: "ml-0.5 size-4 peer-checked:translate-x-3",
      },
    },
    defaultVariants: { size: "default" },
  }
)

/**
 * One option in a checkbox / radio / switch list. `card` makes the whole
 * option a large selectable tile (e.g. "What do you need?" in a quote form).
 */
export const choiceItemVariants = cva("relative flex gap-3", {
  variants: {
    variant: {
      default: "min-h-6 items-start",
      card: "min-h-11 items-start rounded-lg border border-input bg-card p-4 text-card-foreground shadow-xs transition-[color,background-color,border-color,box-shadow] not-has-disabled:hover:bg-muted/50 has-checked:border-primary has-checked:bg-primary/5 has-user-invalid:border-destructive has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-disabled:opacity-50 has-aria-invalid:border-destructive dark:bg-input/30 dark:has-checked:bg-primary/10",
    },
  },
  defaultVariants: { variant: "default" },
})

/** Layout of the options inside a `ChoiceGroup`. */
export const choiceGroupVariants = cva("grid", {
  variants: {
    layout: {
      stack: "gap-3",
      inline: "flex flex-wrap gap-x-6 gap-y-3",
      grid: "gap-3 sm:grid-cols-2",
      "grid-3": "gap-3 sm:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: { layout: "stack" },
})

/**
 * Text-like controls (Input, Textarea, NativeSelect). `lg` gives 44px
 * controls and 16px text (no iOS zoom), the default for the form blocks.
 */
export const textControlVariants = cva(
  "w-full user-invalid:border-destructive",
  {
    variants: {
      size: {
        default: "",
        lg: "h-11 px-3 text-base md:text-base",
      },
    },
    defaultVariants: { size: "default" },
  }
)

/** A field (label + control + description + error). */
export const formFieldVariants = cva(
  "group/field flex min-w-0 flex-col gap-2",
  {
    variants: {
      /** Column span inside a two-column `formGridVariants` layout. */
      span: {
        auto: "",
        full: "col-span-full",
      },
    },
    defaultVariants: { span: "auto" },
  }
)

/** Grid that lays out a form's fields. */
export const formGridVariants = cva("grid gap-6", {
  variants: {
    layout: {
      stacked: "grid-cols-1",
      "two-column": "grid-cols-1 sm:grid-cols-2 sm:gap-x-4",
    },
  },
  defaultVariants: { layout: "stacked" },
})

/** Surface around a form block. */
export const formSurfaceVariants = cva("flex w-full flex-col gap-6", {
  variants: {
    surface: {
      bare: "",
      card: "rounded-xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8",
      muted: "rounded-xl bg-muted p-6 sm:p-8",
    },
  },
  defaultVariants: { surface: "card" },
})

export type CheckboxVariants = VariantProps<typeof checkboxVariants>
export type RadioVariants = VariantProps<typeof radioVariants>
export type SwitchVariants = VariantProps<typeof switchVariants>
export type ChoiceItemVariants = VariantProps<typeof choiceItemVariants>
export type ChoiceGroupVariants = VariantProps<typeof choiceGroupVariants>
export type TextControlVariants = VariantProps<typeof textControlVariants>
export type FormFieldVariants = VariantProps<typeof formFieldVariants>
export type FormGridVariants = VariantProps<typeof formGridVariants>
export type FormSurfaceVariants = VariantProps<typeof formSurfaceVariants>
