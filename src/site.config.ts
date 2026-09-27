/**
 * Site-wide brand and content configuration.
 *
 * This is the single place to change the site's name, contact details, nav,
 * theme and SEO defaults. It is validated with zod at build time, so a typo
 * fails the build instead of shipping broken metadata.
 *
 * Keep imports in this file relative (no `@/` alias, no `astro:*` modules)
 * so it can also be imported from `astro.config.ts`.
 *
 * The canonical site URL is NOT configured here: set `site` in
 * `astro.config.ts` and read it via `Astro.site` / `context.site`.
 */
import { z } from "astro/zod"

import { themeNames } from "./styles/themes"

const link = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  /** Open in a new tab (adds rel="noopener noreferrer"). Defaults to external detection. */
  external: z.boolean().optional(),
})

const social = z.object({
  /** Human label, also used as the accessible name of icon-only links. */
  label: z.string().min(1),
  href: z.url(),
  /** astro-icon name, e.g. "lucide:github". */
  icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/),
})

const themeName = z.enum(themeNames)

const siteConfigSchema = z
  .object({
    /** Full site / brand name. Used in titles, OG site_name, JSON-LD. */
    name: z.string().min(1),
    /** Short name for tight spaces (web manifest short_name, mobile header). */
    shortName: z.string().min(1).max(12),
    /** Default meta description (pages can override). ~150-160 chars. */
    description: z.string().min(1),
    /** Title template; `%s` is replaced by the page title. */
    titleTemplate: z.string().includes("%s"),
    /** BCP 47 locale for og:locale etc. (use underscore form via helper). */
    locale: z.string().default("en-GB"),
    /** `<html lang>` value. */
    lang: z.string().default("en"),

    /** Organisation details for JSON-LD Organization. */
    organisation: z.object({
      name: z.string().min(1),
      legalName: z.string().optional(),
      /** Path (relative to site root) or absolute URL of the logo. */
      logo: z.string().min(1),
      /** Profile URLs. Defaults to `contact.socials` hrefs when omitted. */
      sameAs: z.array(z.url()).optional(),
    }),

    contact: z.object({
      email: z.email().optional(),
      /** Display format, e.g. "+44 20 7946 0000". */
      phone: z.string().optional(),
      address: z
        .object({
          streetAddress: z.string(),
          addressLocality: z.string(),
          addressRegion: z.string().optional(),
          postalCode: z.string(),
          addressCountry: z.string().length(2),
        })
        .optional(),
      socials: z.array(social).default([]),
    }),

    /** Primary header navigation. */
    nav: z.array(link),
    /** Footer link list (legal, secondary pages). */
    footer: z.array(link),

    seo: z.object({
      /**
       * Default Open Graph / Twitter image: a path in `public/` or absolute URL.
       * Recommended 1200x630.
       */
      ogImage: z.string().min(1),
      ogImageAlt: z.string().min(1),
      /** Twitter/X handle including "@", or omit. */
      twitterHandle: z
        .string()
        .regex(/^@\w{1,15}$/)
        .optional(),
    }),

    robots: z.object({
      /** When false, robots.txt disallows known AI training/crawling bots. */
      allowAiCrawlers: z.boolean(),
      /** When true, robots.txt disallows everything (e.g. staging). */
      disallowAll: z.boolean(),
    }),

    /** Values for /.well-known/security.txt (RFC 9116). */
    security: z.object({
      /** mailto: or https: URI(s). */
      contact: z.array(z.string().regex(/^(mailto:|https:\/\/)/)).min(1),
      /** Months until the Expires field; security.txt must expire < 1 year. */
      expiresInMonths: z.number().int().min(1).max(12).default(12),
      preferredLanguages: z.string().default("en"),
      policy: z.url().optional(),
    }),

    theme: z.object({
      /** Theme applied by default (and without JS). */
      default: themeName,
      /** Themes the runtime switcher may offer. Must include `default`. */
      available: z.array(themeName).min(1),
      /** Render the <ThemeSwitcher /> in the header. */
      switcher: z.boolean(),
    }),

    colorMode: z.object({
      /** Initial colour mode before the visitor picks one. */
      default: z.enum(["light", "dark", "system"]),
    }),

    /** Enable native cross-document view transitions (@view-transition). */
    viewTransitions: z.boolean(),
  })
  .refine((c) => c.theme.available.includes(c.theme.default), {
    message: "theme.available must include theme.default",
    path: ["theme", "available"],
  })

export type SiteConfig = z.output<typeof siteConfigSchema>
export type SiteConfigInput = z.input<typeof siteConfigSchema>
export type NavLink = z.output<typeof link>
export type SocialLink = z.output<typeof social>
export type ColorMode = SiteConfig["colorMode"]["default"]

const config = {
  name: "Acme Studio",
  shortName: "Acme",
  description:
    "Acme Studio builds fast, accessible websites. This is placeholder copy from the Astro template: replace it in src/site.config.ts.",
  titleTemplate: "%s | Acme Studio",
  locale: "en-GB",
  lang: "en",

  organisation: {
    name: "Acme Studio",
    legalName: "Acme Studio Ltd",
    logo: "/icon-512.png",
  },

  contact: {
    email: "hello@example.com",
    phone: "+44 20 7946 0000",
    address: {
      streetAddress: "1 Example Street",
      addressLocality: "London",
      postalCode: "EC1A 1AA",
      addressCountry: "GB",
    },
    socials: [
      {
        label: "GitHub",
        href: "https://github.com/example",
        icon: "lucide:github",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/example",
        icon: "lucide:linkedin",
      },
    ],
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footer: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
  ],

  seo: {
    ogImage: "/og-default.png",
    ogImageAlt: "Acme Studio",
    twitterHandle: "@example",
  },

  robots: {
    allowAiCrawlers: true,
    disallowAll: false,
  },

  security: {
    contact: ["mailto:security@example.com"],
    expiresInMonths: 12,
    preferredLanguages: "en",
  },

  theme: {
    default: "default",
    available: ["default", "bold"],
    switcher: false,
  },

  colorMode: {
    default: "light",
  },

  viewTransitions: false,
} satisfies SiteConfigInput

export const siteConfig: SiteConfig = siteConfigSchema.parse(config)

export default siteConfig
