import { cva, type VariantProps } from "class-variance-authority"

/**
 * Lazy-loaded embed frame.
 *
 * `variant` sets the frame (card: border, radius, shadow; bare: edge to edge).
 * `aspect` sets the size: ratio presets write `--embed-aspect`, so a call site
 * can pass any ratio as a class, `class="[--embed-aspect:5/2]"` (works with
 * breakpoint variants and merges with cn(); inline `style` suits values
 * computed from data). `tall` is a fixed minimum height (`--embed-height`,
 * default 44rem) for booking widgets that need room rather than a ratio;
 * `fill` stretches to its grid/flex parent.
 */
export const embedVariants = cva("relative isolate w-full text-foreground", {
  variants: {
    variant: {
      card: "rounded-xl border bg-card shadow-sm",
      outline: "rounded-lg border bg-muted",
      bare: "bg-muted",
    },
    aspect: {
      video: "aspect-(--embed-aspect) [--embed-aspect:16/9]",
      wide: "aspect-(--embed-aspect) [--embed-aspect:21/9]",
      classic: "aspect-(--embed-aspect) [--embed-aspect:4/3]",
      square: "aspect-(--embed-aspect) [--embed-aspect:1/1]",
      portrait: "aspect-(--embed-aspect) [--embed-aspect:3/4]",
      tall: "min-h-(--embed-height) [--embed-height:44rem]",
      fill: "h-full min-h-(--embed-height) [--embed-height:20rem]",
    },
  },
  defaultVariants: {
    variant: "card",
    aspect: "video",
  },
})

export type EmbedVariants = VariantProps<typeof embedVariants>
