import type { ImageMetadata } from "astro"

import type { HeroLayout } from "./variants"

/**
 * Rendered width (CSS px) and `sizes` for the hero image in each layout, so
 * the browser picks a srcset candidate that matches the layout instead of
 * always downloading a full-viewport image. Widths follow the default
 * `max-w-6xl` container; adjust if you change it.
 */
export function heroMediaSizing(
  layout: HeroLayout,
  image: ImageMetadata
): { width: number; sizes: string } {
  const cap = (max: number) => Math.min(image.width, max)
  switch (layout) {
    case "split":
      return { width: cap(800), sizes: "(min-width: 1024px) 560px, 100vw" }
    case "centered":
      return { width: cap(896), sizes: "(min-width: 960px) 896px, 100vw" }
    case "stacked":
      return { width: cap(1104), sizes: "(min-width: 1152px) 1104px, 100vw" }
    case "overlay":
      return { width: cap(1920), sizes: "100vw" }
    default:
      return { width: cap(1600), sizes: "100vw" }
  }
}
