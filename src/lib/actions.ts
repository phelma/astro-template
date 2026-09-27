import type { VariantProps } from "class-variance-authority"

import type { buttonVariants } from "@/components/ui/button"

/**
 * A call-to-action link: label, href and an optional decorative icon. Used
 * by the `actions` props of Hero, Cta, the footer CTA band and ServiceArea.
 * Blocks render it as a button (`buttonVariants`, or their own variants);
 * for anything custom, use the block's slot instead.
 */
export interface ActionLink {
  label: string
  href: string
  /** Button style, for blocks that render with `buttonVariants`. */
  variant?: VariantProps<typeof buttonVariants>["variant"]
  /** astro-icon name, e.g. "lucide:phone". Decorative. */
  icon?: string
  /** Icon before or after the label (Hero, Cta: default "end"). */
  iconPosition?: "start" | "end"
}
