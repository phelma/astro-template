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

/** A titled list of links (footer columns). */
const linkGroup = z.object({
  title: z.string().min(1),
  links: z.array(link).min(1),
})

/** Header nav item: a link, optionally with one level of child links (dropdown). */
const navItem = link.extend({
  children: z.array(link).optional(),
})

/** Day codes as used by schema.org `openingHours` ("Mo", "Tu", ...). */
const day = z.enum(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"])
/** 24-hour local time, "HH:MM". */
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)
/** ISO date, "YYYY-MM-DD". */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const social = z.object({
  /** Human label, also used as the accessible name of icon-only links. */
  label: z.string().min(1),
  href: z.url(),
  /** astro-icon name, e.g. "lucide:github". */
  icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/),
})

const themeName = z.enum(themeNames)

/**
 * schema.org LocalBusiness subtypes for `business.type`, picked for UK small
 * businesses. Every name must be a real schema.org type known to schema-dts
 * (`LocalBusinessType` in src/lib/seo.ts checks this at compile time).
 */
export const localBusinessTypes = [
  "LocalBusiness",
  // Trades and home services
  "HomeAndConstructionBusiness",
  "Plumber",
  "Electrician",
  "HVACBusiness",
  "RoofingContractor",
  "GeneralContractor",
  "HousePainter",
  "Locksmith",
  "MovingCompany",
  "SelfStorage",
  "DryCleaningOrLaundry",
  // Professional services
  "ProfessionalService",
  "LegalService",
  "Attorney",
  "Notary",
  "AccountingService",
  "FinancialService",
  "InsuranceAgency",
  "RealEstateAgent",
  "EmploymentAgency",
  "TravelAgency",
  // Health and beauty
  "HealthAndBeautyBusiness",
  "HairSalon",
  "BeautySalon",
  "NailSalon",
  "DaySpa",
  "TattooParlor",
  "Dentist",
  "Physician",
  "MedicalClinic",
  "Optician",
  "Physiotherapy",
  "Pharmacy",
  // Food and drink
  "FoodEstablishment",
  "Restaurant",
  "CafeOrCoffeeShop",
  "Bakery",
  "BarOrPub",
  "FastFoodRestaurant",
  "IceCreamShop",
  "Brewery",
  "Winery",
  // Motoring
  "AutomotiveBusiness",
  "AutoRepair",
  "AutoBodyShop",
  "AutoDealer",
  "AutoWash",
  // Shops
  "Store",
  "ClothingStore",
  "Florist",
  "HomeGoodsStore",
  "HardwareStore",
  "GardenStore",
  "FurnitureStore",
  "BookStore",
  "PetStore",
  "JewelryStore",
  "BikeStore",
  // Leisure, care and accommodation
  "ChildCare",
  "SportsActivityLocation",
  "ExerciseGym",
  "EntertainmentBusiness",
  "AnimalShelter",
  "LodgingBusiness",
  "BedAndBreakfast",
  "Hotel",
  "Campground",
] as const

const siteConfigSchema = z
  .object({
    /** Full site / brand name. Used in titles, OG site_name, JSON-LD. */
    name: z.string().min(1),
    /** Short name for tight spaces (web manifest short_name, mobile header). */
    shortName: z.string().min(1).max(12),
    /** Default meta description (pages can override). ~150-160 chars. */
    description: z.string().min(1),
    /** Title template; `%s` is replaced by the page title. The home page (no `title`) gets just `name`. */
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

    /** Primary header navigation. Items with `children` render as dropdowns. */
    nav: z.array(navItem),
    /** Footer link list (legal, secondary pages). */
    footer: z.array(link),

    /** Site footer options (src/components/layout/Footer.astro). */
    footerOptions: z.object({
      /**
       * `simple`: one row (copyright, `footer` links, socials). `columns`:
       * brand, link columns, contact, hours, legal bar. `centered`: stacked.
       * `cta`: `columns` under a call-to-action band.
       */
      layout: z
        .enum(["simple", "columns", "centered", "cta"])
        .default("simple"),
      /** Band colour. */
      tone: z
        .enum(["default", "muted", "card", "primary", "inverted"])
        .default("default"),
      /** Line under the brand (not `simple`). Defaults to `description`. */
      blurb: z.string().min(1).optional(),
      /** Link columns (`columns`, `cta`). Defaults to one column of `nav`. */
      columns: z.array(linkGroup).optional(),
      /** Heading of the default `nav` column. */
      navTitle: z.string().min(1).default("Explore"),
      /** Heading of the contact column. */
      contactTitle: z.string().min(1).default("Contact"),
      /** Heading of the opening-hours column. */
      hoursTitle: z.string().min(1).default("Opening hours"),
      /**
       * Links in the legal bar (privacy, terms). Defaults to `footer` outside
       * `simple` (where `footer` is already the link row).
       */
      legalLinks: z.array(link).optional(),
      /** Call-to-action band for `layout: "cta"`. */
      cta: z
        .object({
          title: z.string().min(1).default("Need a hand? Get in touch today."),
          text: z.string().min(1).optional(),
          /** Main button. Defaults to `header.cta`. */
          link: link.optional(),
          /** Click-to-call button label; "{phone}" is replaced. */
          callLabel: z.string().min(1).default("Call {phone}"),
        })
        .prefault({}),
    }),

    /** Site header options (src/components/layout/Header.astro). */
    header: z.object({
      /** Brand left + nav right, or brand centred with nav below. */
      layout: z.enum(["start", "center"]).default("start"),
      /** Stick to the top of the viewport while scrolling. */
      sticky: z.boolean().default(true),
      /**
       * Bar background. `transparent` overlaps the first section (use with a
       * full-bleed hero) and turns solid on scroll.
       */
      variant: z.enum(["solid", "blurred", "transparent"]).default("blurred"),
      /** Bottom border on the bar. */
      bordered: z.boolean().default(true),
      /** Mobile menu presentation. */
      mobileMenu: z.enum(["fullscreen", "sheet"]).default("fullscreen"),
      /** Show the click-to-call phone number (contact.phone) in the bar. */
      showPhone: z.boolean().default(false),
      /** Primary call-to-action button at the end of the bar. */
      cta: link.optional(),
      /** Thin utility bar above the header: phone, email, today's hours. */
      topBar: z.boolean().default(false),
    }),

    /**
     * Site-wide announcement banner (closures, offers). Shown only between
     * `from` and `until` (inclusive, checked at build time) when set.
     */
    announcement: z
      .object({
        message: z.string().min(1),
        link: link.optional(),
        from: isoDate.optional(),
        until: isoDate.optional(),
        /** Visitors can dismiss it (remembered per `message`). */
        dismissible: z.boolean().default(true),
      })
      .optional(),

    /** Local business details: LocalBusiness JSON-LD, opening hours, maps. */
    business: z.object({
      /**
       * schema.org LocalBusiness subtype, e.g. "Plumber", "Restaurant",
       * "HairSalon", "Dentist" (see `localBusinessTypes` above; add others
       * from https://schema.org/LocalBusiness as needed).
       */
      type: z.enum(localBusinessTypes).default("LocalBusiness"),
      /** e.g. "££" or "£50-£200". */
      priceRange: z.string().optional(),
      /** Used for the map pin and JSON-LD geo. */
      geo: z
        .object({
          latitude: z.number().min(-90).max(90),
          longitude: z.number().min(-180).max(180),
        })
        .optional(),
      /** IANA time zone the opening hours are in (for "Open now"). */
      timeZone: z.string().default("Europe/London"),
      /** Regular weekly hours. Days not listed are closed. */
      hours: z
        .array(
          z.object({
            days: z.array(day).min(1),
            opens: time,
            closes: time,
          })
        )
        .default([]),
      /** Exceptions (bank holidays, closures). Omit opens/closes for closed. */
      specialHours: z
        .array(
          z.object({
            from: isoDate,
            /** Inclusive; defaults to `from`. */
            until: isoDate.optional(),
            opens: time.optional(),
            closes: time.optional(),
            /** e.g. "Christmas". */
            label: z.string().optional(),
          })
        )
        .default([]),
      /** Towns/areas covered (service-area businesses). */
      areaServed: z.array(z.string().min(1)).default([]),
      /** WhatsApp number in international format, digits only (e.g. "447946000000"). */
      whatsapp: z
        .string()
        .regex(/^\d{7,15}$/)
        .optional(),
      /** Google Business Profile / Maps URL (reviews, directions). */
      googleMapsUrl: z.url().optional(),
      /** Online booking URL (Calendly, Fresha, OpenTable, ...). */
      bookingUrl: z.url().optional(),
    }),

    /** Sticky bottom action bar on small screens. */
    mobileActions: z.object({
      enabled: z.boolean().default(false),
      /** Order matters. Actions whose data is missing are skipped. */
      actions: z
        .array(z.enum(["call", "whatsapp", "email", "directions", "book"]))
        .default(["call", "directions"]),
    }),

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
      /**
       * `Content-Signal` line in robots.txt (contentsignals.org, an IETF
       * aipref draft): what crawlers may do with pages they fetch. Omit to
       * leave it out. Advisory only; `allowAiCrawlers` is the gate.
       */
      contentSignals: z
        .object({
          /** Index for search results. */
          search: z.boolean(),
          /** Use as live input to AI answers (RAG, summaries). */
          aiInput: z.boolean(),
          /** Include in AI training data. */
          aiTrain: z.boolean(),
        })
        .optional(),
    }),

    /**
     * TDMRep (W3C CG): whether you reserve text and data mining rights (EU
     * DSM Directive Art. 4). Emitted as <meta> tags and
     * /.well-known/tdmrep.json. A legal notice, not a crawler block.
     */
    tdm: z.object({
      /** 1 = reserved (miners need permission), 0 = mining allowed. */
      reservation: z.union([z.literal(0), z.literal(1)]),
      /** Licensing policy URL for would-be miners; set it when reserving. */
      policy: z.url().optional(),
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
  .refine(
    (c) => !(c.tdm.reservation === 1 && c.robots.contentSignals?.aiTrain),
    {
      message:
        "tdm.reservation 1 contradicts robots.contentSignals.aiTrain: true",
      path: ["tdm", "reservation"],
    }
  )

export type SiteConfig = z.output<typeof siteConfigSchema>
export type SiteConfigInput = z.input<typeof siteConfigSchema>
export type NavLink = z.output<typeof link>
export type NavItem = z.output<typeof navItem>
export type LinkGroup = z.output<typeof linkGroup>
export type Day = z.output<typeof day>
export type BusinessHours = SiteConfig["business"]["hours"]
export type SpecialHours = SiteConfig["business"]["specialHours"]
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
  footerOptions: {
    layout: "simple",
    tone: "default",
  },

  header: {
    layout: "start",
    sticky: true,
    variant: "blurred",
    bordered: true,
    mobileMenu: "fullscreen",
    showPhone: false,
    topBar: false,
  },

  business: {
    type: "LocalBusiness",
    priceRange: "££",
    geo: { latitude: 51.5202, longitude: -0.0978 },
    timeZone: "Europe/London",
    hours: [
      { days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "09:00", closes: "17:30" },
      { days: ["Sa"], opens: "10:00", closes: "14:00" },
    ],
    specialHours: [],
    areaServed: ["London"],
  },

  mobileActions: {
    enabled: false,
    actions: ["call", "directions"],
  },

  seo: {
    ogImage: "/og-default.png",
    ogImageAlt: "Acme Studio",
    twitterHandle: "@example",
  },

  robots: {
    allowAiCrawlers: true,
    disallowAll: false,
    contentSignals: { search: true, aiInput: true, aiTrain: true },
  },

  tdm: {
    reservation: 0,
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
