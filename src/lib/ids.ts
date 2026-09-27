/**
 * Deterministic element ids for blocks that need one when the caller didn't
 * pass `id`. Ids are counted per page render, so the first instance of a
 * prefix gets `prefix` and later ones `prefix-2`, `prefix-3`... Builds stay
 * reproducible (no random ids) and two instances on a page don't clash.
 *
 *   const id = idProp ?? uniqueId(Astro, "gallery")
 */
const counters = new WeakMap<Request, Map<string, number>>()

/** Lowercase kebab-case slug for ids: "Our Services!" -> "our-services". */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** A page-unique id from `prefix` (pass `Astro`, which is per page render). */
export function uniqueId(astro: { request: Request }, prefix: string): string {
  const base = slugify(prefix) || "id"
  let seen = counters.get(astro.request)
  if (!seen) {
    seen = new Map()
    counters.set(astro.request, seen)
  }
  const count = (seen.get(base) ?? 0) + 1
  seen.set(base, count)
  return count === 1 ? base : `${base}-${count}`
}
