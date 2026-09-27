import type { VariantProps } from "class-variance-authority"

import type { buttonVariants } from "@/components/ui/button"

/**
 * A call-to-action link rendered as a button (`buttonVariants`). Used by the
 * `actions` prop of Hero and Cta; for anything custom, use the default slot of
 * `HeroActions` / `CtaActions` instead.
 */
export interface ActionLink {
  label: string
  href: string
  variant?: VariantProps<typeof buttonVariants>["variant"]
  /** astro-icon name, e.g. "lucide:phone". Decorative. */
  icon?: string
  /** Icon before or after the label. Default "end". */
  iconPosition?: "start" | "end"
}
