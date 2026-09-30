# Blocks and components

## Blocks

`src/components/blocks/` holds reusable Astro components for local business sites. Browse them at [`/components`](http://localhost:4321/components) (noindex), where each block has a page showing every variant; switch theme and colour mode there to check them. These demo pages are for learning from while you build: a site deletes them before it's finished ([new-site.md](new-site.md)).

| Group   | Blocks                                                                                          |
| ------- | ----------------------------------------------------------------------------------------------- |
| Layout  | `section` (band + container + heading group), `navbar` (header parts), `announcement`, `footer` |
| Heroes  | `hero`, `page-header`, `cta`, `features`                                                        |
| Local   | `opening-hours` (live "Open now"), `map`, `booking`, `service-area`, `mobile-actions`           |
| Forms   | `form` (controls, fields, choice cards, validation, honeypot, sent state): compose any form     |
| Content | `testimonials`, `faq`, `services`, `price-list`, `steps`, `stats`, `team`, `logo-strip`         |
| Media   | `gallery` (lightbox), `before-after`, `embed` (lazy-loaded iframe, used by `map` and `booking`) |

### Customising a block

They work like shadcn components: the code lives in the repo and is yours to edit, and they only use theme tokens, so they restyle with the theme. To make one fit a site:

1. **Change the theme** (tokens, fonts, radius, shadows) and every block follows. See [themes](themes.md).
2. **Pick variants** with props (`layout`, `variant`, `tone`, `size`, ...). Section blocks also take `tone`, `spacing`, `width` and `headingLevel`.
3. **Override at the call site** with `class`, which is merged last, or target a part via its `data-slot`: `<Faq class="**:data-[slot=faq-question]:text-lg" />`. Set fixed custom properties with classes (`[--embed-aspect:5/2]`): they work with breakpoints and `cn()` merging. `style` is fine for values computed from data.
4. **Edit the block**, or its `variants.ts`, when the structure itself should change.

Business data (contact, hours, address, booking link) comes from `src/site.config.ts` by default and can be overridden per instance with props. The header, footer, announcement banner, mobile action bar and `LocalBusiness` JSON-LD are driven entirely by config.

Blocks ship no framework JavaScript. Where they need behaviour (dropdowns, lightbox, form validation, "Open now") it's native HTML plus a small bundled script that the page works without. Third-party embeds (Google Maps, Calendly) are plain iframes with `loading="lazy"`, so they only load as the visitor scrolls to them.

Writing or changing a block: follow the conventions in [`AGENTS.md`, "Blocks"](../AGENTS.md#blocks-srccomponentsblocks) (folder layout, props, `data-slot`, variants, ids, showcase page).

## shadcn/ui

Add components with:

```sh
pnpm dlx shadcn@latest add dialog
```

They land in `src/components/ui/` as React components. Use them directly in `.astro` files **without** a `client:*` directive: they render to static HTML with the token styles and ship no JavaScript.

```astro
---
import { Button } from "@/components/ui/button"
---

<Button variant="outline">Static button</Button>
```

For links styled as buttons, use `buttonVariants`: `<a href="/contact" class={buttonVariants({ size: "lg" })}>`.

Only hydrate (`client:visible`, `client:idle`, ...) when a component needs genuinely complex client-side behaviour (e.g. a combobox or data table). For simple interactivity prefer native HTML: `popover`, `<details>`, `<dialog>`, form validation.

Review diffs to `src/styles/global.css` after `shadcn add`: tokens belong in theme files, not `:root`.
