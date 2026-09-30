#!/usr/bin/env node
/**
 * Make the site's share (Open Graph) image from its config and theme.
 *
 *   pnpm og                                 the site's name on its theme
 *   pnpm og --tagline "Bakers since 1952"   with a line under the name
 *   pnpm og --image images/shopfront.jpg    a photo, cropped to 1200x630
 *
 * Writes a 1200x630 image to `public/` at `seo.ogImage` (`/og-default.png`)
 * and prints what it drew. Then describe it in `seo.ogImageAlt`, look at it,
 * and run `pnpm build` so `dist/` has it.
 *
 * A card is a PNG, which keeps its flat colours and text sharp; a photo is a
 * JPEG, a tenth of the size (a PNG photo is about 2 MB, too big for some link
 * previews). If `seo.ogImage` has the other extension, it writes the file
 * with the right one (`/og-default.jpg`) and says to point `seo.ogImage` at
 * it. With `--out`, the extension picks the format.
 *
 * - Text: `name` from `src/site.config.ts` (or `--title`) in the theme's
 *   heading font, weight and tracking, and `--tagline` in its body font.
 *   `public/icon.svg` sits above them (`--no-icon` leaves it out).
 * - Colours: the tokens of `theme.default` in `src/styles/themes/<name>.css`,
 *   light or dark as `colorMode.default` (or `--mode`) says. `--tone default`
 *   is `--foreground` on `--background` with a `--primary` bar; `--tone
 *   primary` is `--primary-foreground` on `--primary`.
 * - Fonts: the ones the theme's tokens name in `astro.config.ts`, as TTFs
 *   from Fontsource (which has every Google font), cached in
 *   `node_modules/.cache/og-fonts/`. A font it can't get falls back to a
 *   system sans-serif, with a warning.
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import module from "node:module"
import { dirname, relative, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { parseArgs } from "node:util"

import sharp from "sharp"

const WIDTH = 1200
const HEIGHT = 630
const PAD = 80
const FONT_CACHE = "node_modules/.cache/og-fonts"
const FETCH_TIMEOUT = 15_000

const root = fileURLToPath(new URL("../", import.meta.url))
const at = (...parts) => resolve(root, ...parts)

const { values: args } = parseArgs({
  // pnpm passes on the `--` of `pnpm og -- --tagline ...`.
  args: process.argv.slice(2).filter((arg) => arg !== "--"),
  options: {
    title: { type: "string" },
    tagline: { type: "string" },
    image: { type: "string" },
    theme: { type: "string" },
    mode: { type: "string" },
    tone: { type: "string", default: "default" },
    "no-icon": { type: "boolean", default: false },
    out: { type: "string" },
    help: { type: "boolean", short: "h", default: false },
  },
})

if (args.help) {
  console.log(`pnpm og [options]

  --title <text>    Text to draw (default: name in src/site.config.ts)
  --tagline <text>  A smaller line under the title (default: none)
  --image <path>    Use this photo, cropped to 1200x630, instead of text
  --theme <name>    Theme for colours and fonts (default: theme.default)
  --mode <mode>     light or dark (default: colorMode.default; light for system)
  --tone <tone>     default (on the background colour) or primary
  --no-icon         Leave out public/icon.svg
  --out <path>      Where to write, .png or .jpg (default: public/ +
                    seo.ogImage, as .jpg for --image and .png otherwise)`)
  process.exit(0)
}

const siteConfig = await loadSiteConfig()
const ogImage = args.out ? undefined : ogImagePath(siteConfig.seo.ogImage)
const out = args.out ? resolve(args.out) : at("public", `.${ogImage}`)
const jpeg = /\.jpe?g$/i.test(out)
if (!jpeg && !/\.png$/i.test(out)) fail("--out is a .png or .jpg file")
const encode = (pipeline) =>
  jpeg
    ? pipeline.jpeg({ quality: 82, mozjpeg: true })
    : pipeline.png({ compressionLevel: 9 })

let image
let summary
if (args.image) {
  image = await encode(
    sharp(resolve(args.image)).rotate().resize(WIDTH, HEIGHT, {
      fit: "cover",
      position: sharp.strategy.attention,
    })
  ).toBuffer()
  summary = `${args.image}, cropped to fill it`
} else {
  ;({ image, summary } = await drawCard())
}

await mkdir(dirname(out), { recursive: true })
await writeFile(out, image)
console.log(`Wrote ${relative(root, out)} (${WIDTH}x${HEIGHT}): ${summary}.`)
if (ogImage && ogImage !== siteConfig.seo.ogImage) {
  const old = at("public", `.${siteConfig.seo.ogImage}`)
  const remove = existsSync(old) ? `, and delete ${relative(root, old)}` : ""
  console.log(`Set seo.ogImage in src/site.config.ts to "${ogImage}"${remove}.`)
}
console.log(
  `Look at it, describe it in seo.ogImageAlt (now "${siteConfig.seo.ogImageAlt}"), and run pnpm build.`
)

/** The title (and tagline) on the theme's colours, in its fonts. */
async function drawCard() {
  const themeName = args.theme ?? siteConfig.theme.default
  const mode =
    args.mode ?? (siteConfig.colorMode.default === "dark" ? "dark" : "light")
  if (mode !== "light" && mode !== "dark") fail("--mode is light or dark")
  if (args.tone !== "default" && args.tone !== "primary") {
    fail("--tone is default or primary")
  }
  const tokens = themeTokens(themeName, mode)
  const colour = (name, fallback) => {
    const value = tokens.resolve(name)
    const hex = value && toHex(value)
    if (value && !hex) warn(`can't read ${name}: ${value}; using ${fallback}`)
    return hex ?? fallback
  }

  const primary = colour("--primary", "#171717")
  const tone =
    args.tone === "primary"
      ? {
          background: primary,
          foreground: colour("--primary-foreground", "#ffffff"),
          muted: colour("--primary-foreground", "#ffffff"),
        }
      : {
          background: colour("--background", "#ffffff"),
          foreground: colour("--foreground", "#0a0a0a"),
          muted: colour("--muted-foreground", "#737373"),
          bar: primary,
        }

  const headingWeight = cssWeight(tokens.resolve("--heading-weight"), 700)
  const fonts = await themeFonts(tokens, headingWeight)
  const title = args.title ?? siteConfig.name
  const width = WIDTH - 2 * PAD
  const layers = []
  let bottom = HEIGHT - PAD

  if (tone.bar) {
    layers.push({
      input: svgRect(WIDTH, 16, tone.bar),
      top: HEIGHT - 16,
      left: 0,
    })
    bottom -= 8
  }

  if (args.tagline) {
    const line = await paragraph(args.tagline, {
      font: fonts.body,
      sizes: [36, 32, 28],
      weight: 400,
      colour: tone.muted,
      width,
      maxHeight: 100,
    })
    bottom -= line.info.height
    layers.push({ input: line.data, top: bottom, left: PAD })
    bottom -= 28
  }

  const heading = await paragraph(title, {
    font: fonts.heading,
    sizes: [112, 104, 96, 88, 80, 72, 64, 56, 48],
    weight: headingWeight,
    tracking: parseEm(tokens.resolve("--heading-tracking")),
    colour: tone.foreground,
    width,
    maxHeight: 300,
  })
  bottom -= heading.info.height
  layers.push({ input: heading.data, top: bottom, left: PAD })

  const icon = at("public/icon.svg")
  const iconSize = Math.min(112, bottom - PAD - 32)
  if (!args["no-icon"] && existsSync(icon) && iconSize >= 48) {
    layers.push({
      input: await sharp(icon, { density: 600 })
        .resize(iconSize, iconSize, { fit: "contain", background: "#0000" })
        .png()
        .toBuffer(),
      top: PAD,
      left: PAD,
    })
  }

  const image = await encode(
    sharp(svgRect(WIDTH, HEIGHT, tone.background))
      .composite(layers)
      .flatten()
  ).toBuffer()

  const families = [
    ...new Set([fonts.heading, fonts.body].filter(Boolean).map((f) => f.name)),
  ]
  const tagline = args.tagline ? ` and "${args.tagline}"` : ""
  return {
    image,
    summary: `"${title}"${tagline} on the ${themeName} theme (${mode}, ${args.tone} tone) in ${families.join(" and ") || "a system sans-serif"}`,
  }
}

/**
 * Renders wrapped text with Pango at the first of `sizes` (px, largest
 * first) whose height fits `maxHeight`.
 */
async function paragraph(content, options) {
  const {
    font,
    sizes,
    weight,
    tracking = 0,
    colour,
    width,
    maxHeight,
  } = options
  const family = font ? ` font_family="${escapeMarkup(font.family)}"` : ""
  let result
  for (const px of sizes) {
    const spacing = Math.round(tracking * px * 1024)
    result = await sharp({
      text: {
        text: `<span${family} weight="${weight}" letter_spacing="${spacing}" foreground="${colour}">${escapeMarkup(content)}</span>`,
        font: `sans-serif ${px}px`,
        width,
        wrap: "word",
        spacing: Math.round(px * 0.15),
        rgba: true,
        dpi: 72,
      },
    })
      .png()
      .toBuffer({ resolveWithObject: true })
    if (result.info.height <= maxHeight) break
  }
  return result
}

/**
 * The theme's tokens for `mode`. The dark block falls back to the light one
 * for tokens it doesn't set (the fonts, usually).
 */
function themeTokens(name, mode) {
  const file = at(`src/styles/themes/${name}.css`)
  if (!existsSync(file)) fail(`there's no ${relative(root, file)}`)
  const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "")
  const block = (selector) => {
    const vars = new Map()
    const rule = new RegExp(`${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`, "g")
    for (const [, body] of css.matchAll(rule)) {
      for (const [, key, value] of body.matchAll(
        /(--[\w-]+)\s*:\s*([^;]+);/g
      )) {
        vars.set(key, value.replace(/\s+/g, " ").trim())
      }
    }
    return vars
  }
  const light = block(`[data-theme="${name}"]`)
  const dark = block(`[data-theme="${name}"].dark`)
  const raw = (key) =>
    mode === "dark" ? (dark.get(key) ?? light.get(key)) : light.get(key)
  const resolveToken = (key, depth = 0) => {
    const value = raw(key)
    const ref = value?.match(/^var\(\s*(--[\w-]+)\s*(?:,.*)?\)$/)
    if (ref && raw(ref[1]) !== undefined && depth < 10) {
      return resolveToken(ref[1], depth + 1)
    }
    return value
  }
  return { raw, resolve: resolveToken }
}

/**
 * The theme's heading and body fonts: the Fonts API variable each token ends
 * at (`--heading-font: var(--font-sans)`, `--font-sans: var(--font-inter,
 * ...)`), that font's `name` in `astro.config.ts`, and a TTF of it. The
 * built site's fonts are WOFF2, which sharp's FreeType can't read.
 */
async function themeFonts(tokens, headingWeight) {
  const fontVariable = (key, depth = 0) => {
    const ref = tokens.raw(key)?.match(/var\(\s*(--[\w-]+)/)
    if (!ref || depth > 10) return undefined
    return tokens.raw(ref[1]) === undefined
      ? ref[1]
      : fontVariable(ref[1], depth + 1)
  }
  const names = astroFontNames()
  const find = async (key, weight) => {
    const variable = fontVariable(key)
    if (!variable) return undefined
    const name = names.get(variable)
    if (!name) {
      warn(`no font in astro.config.ts has cssVariable "${variable}"`)
      return undefined
    }
    try {
      return await fontsourceTtf(name, weight)
    } catch (error) {
      warn(`couldn't get ${name} from Fontsource: ${error.message}`)
      return undefined
    }
  }
  const heading = await find("--heading-font", headingWeight)
  const body = await find("--font-sans", 400)
  useFonts()
  return { heading, body }
}

/** `cssVariable` to `name` for each font in `astro.config.ts`. */
function astroFontNames() {
  const config = readFileSync(at("astro.config.ts"), "utf8")
  const names = new Map()
  for (const m of config.matchAll(/cssVariable\s*:\s*["'](--[\w-]+)["']/g)) {
    // The object literal the cssVariable is in.
    const entry = config.slice(
      config.lastIndexOf("{", m.index),
      config.indexOf("}", m.index)
    )
    const name = entry.match(/\bname\s*:\s*["']([^"']+)["']/)?.[1]
    if (name) names.set(m[1], name)
  }
  return names
}

/** A TTF of font `name` at the weight nearest `weight`, from Fontsource. */
async function fontsourceTtf(name, weight) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const cache = at(FONT_CACHE)
  const cached = existsSync(cache)
    ? readdirSync(cache).find((f) => f.startsWith(`${id}.${weight}.`))
    : undefined
  let file = cached && resolve(cache, cached)
  if (!file) {
    const response = await fetch(`https://api.fontsource.org/v1/fonts/${id}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    })
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${id}`)
    const font = await response.json()
    const nearest = [...font.weights].sort(
      (a, b) => Math.abs(a - weight) - Math.abs(b - weight)
    )[0]
    const variant = font.variants?.[nearest]?.normal ?? {}
    const url = (variant.latin ?? Object.values(variant)[0])?.url?.ttf
    if (!url) throw new Error(`it has no TTF of ${id} ${nearest}`)
    const ttf = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT) })
    if (!ttf.ok) throw new Error(`HTTP ${ttf.status} for ${url}`)
    await mkdir(cache, { recursive: true })
    file = resolve(cache, `${id}.${weight}.${nearest}.ttf`)
    await writeFile(file, Buffer.from(await ttf.arrayBuffer()))
  }
  // Pango finds a font by the family name inside it, which for some static
  // instances isn't `name` ("Space Grotesk Light" for the bold one).
  return { name, family: ttfFamily(readFileSync(file)) ?? name, file }
}

/** The family name (name ID 1) in a TrueType font's `name` table. */
function ttfFamily(buf) {
  const tables = buf.readUInt16BE(4)
  for (let i = 0; i < tables; i++) {
    const entry = 12 + i * 16
    if (buf.toString("latin1", entry, entry + 4) !== "name") continue
    const table = buf.readUInt32BE(entry + 8)
    const count = buf.readUInt16BE(table + 2)
    const strings = table + buf.readUInt16BE(table + 4)
    for (let j = 0; j < count; j++) {
      const record = table + 6 + j * 12
      const platform = buf.readUInt16BE(record)
      const nameId = buf.readUInt16BE(record + 6)
      if (nameId !== 1 || (platform !== 0 && platform !== 3)) continue
      const start = strings + buf.readUInt16BE(record + 10)
      const utf16 = buf.subarray(start, start + buf.readUInt16BE(record + 8))
      return Buffer.from(utf16).swap16().toString("utf16le")
    }
  }
  return undefined
}

/**
 * Points fontconfig, which Pango uses to find fonts, at the downloaded fonts
 * as well as the system's. Must run before the first text is drawn. On macOS
 * Pango uses CoreText, which never reads fonts.conf, unless it's told to use
 * fontconfig instead; macOS has no fontconfig of its own to say which font
 * "sans-serif" is, so this says.
 */
function useFonts() {
  const cache = at(FONT_CACHE)
  mkdirSync(cache, { recursive: true })
  const conf = resolve(cache, "fonts.conf")
  const macSans =
    process.platform === "darwin"
      ? "\n  <alias><family>sans-serif</family><prefer><family>Helvetica Neue</family><family>Helvetica</family></prefer></alias>"
      : ""
  writeFileSync(
    conf,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${escapeMarkup(cache)}</dir>
  <dir>/System/Library/Fonts</dir>
  <dir>/Library/Fonts</dir>
  <cachedir>${escapeMarkup(resolve(cache, "fontconfig"))}</cachedir>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>${macSans}
</fontconfig>
`
  )
  process.env.FONTCONFIG_FILE = conf
  process.env.PANGOCAIRO_BACKEND = "fc"
}

/**
 * A theme colour as hex, which both Pango and librsvg read. Takes hex,
 * rgb(), hsl(), oklch(), oklab() and colour names; not color-mix() or var().
 * Alpha is dropped.
 */
function toHex(value) {
  const v = value.trim().toLowerCase()
  if (/^[a-z]+$/.test(v)) return v
  const hex = v.match(/^#([0-9a-f]{3,8})$/)?.[1]
  if (hex) {
    const full = hex.length <= 4 ? [...hex].map((c) => c + c).join("") : hex
    return `#${full.slice(0, 6)}`
  }
  const fn = v.match(/^(rgba?|hsla?|oklch|oklab)\(([^)]*)\)$/)
  if (!fn) return undefined
  const parts = fn[2]
    .split("/")[0]
    .trim()
    .split(/[\s,]+/)
    .slice(0, fn[1].endsWith("a") && !fn[2].includes("/") ? 3 : undefined)
  if (parts.length !== 3) return undefined
  const num = (s, percentOf = 1) =>
    s === "none"
      ? 0
      : s.endsWith("%")
        ? (Number.parseFloat(s) / 100) * percentOf
        : Number.parseFloat(s)
  // A hue in degrees, 0 to 360; NaN (so no colour) for a unit it doesn't know.
  const degrees = (s) => {
    if (s === "none") return 0
    const [, n, unit] = s.match(/^(-?[\d.]+)([a-z]*)$/) ?? []
    const perUnit = { "": 1, deg: 1, grad: 0.9, rad: 180 / Math.PI, turn: 360 }
    const deg = Number.parseFloat(n) * perUnit[unit]
    return ((deg % 360) + 360) % 360
  }

  let rgb
  if (fn[1].startsWith("rgb")) {
    rgb = parts.map((p) => num(p, 255) / 255)
  } else if (fn[1].startsWith("hsl")) {
    const h = degrees(parts[0])
    const sat = num(parts[1], 100) / 100
    const light = num(parts[2], 100) / 100
    const k = (n) => (n + h / 30) % 12
    const a = sat * Math.min(light, 1 - light)
    rgb = [0, 8, 4].map(
      (n) => light - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
    )
  } else {
    const L = num(parts[0])
    let a = num(parts[1], 0.4)
    let b = num(parts[2], 0.4)
    if (fn[1] === "oklch") {
      const hue = (degrees(parts[2]) * Math.PI) / 180
      ;[a, b] = [a * Math.cos(hue), a * Math.sin(hue)]
    }
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
    rgb = [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map((c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055))
  }
  if (!rgb.every(Number.isFinite)) return undefined
  return `#${rgb
    .map((c) => Math.round(Math.min(1, Math.max(0, c)) * 255))
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`
}

/** Imports `src/site.config.ts` with Node's built-in TypeScript support. */
async function loadSiteConfig() {
  if (!module.registerHooks) fail("it needs Node 22.18 or later")
  // The config imports `./styles/themes` without an extension, as Vite allows.
  module.registerHooks({
    resolve(specifier, context, next) {
      try {
        return next(specifier, context)
      } catch (error) {
        if (!specifier.startsWith(".") || !context.parentURL) throw error
        for (const suffix of [".ts", "/index.ts"]) {
          const url = new URL(specifier + suffix, context.parentURL)
          if (existsSync(fileURLToPath(url))) return next(url.href, context)
        }
        throw error
      }
    },
  })
  try {
    const config = pathToFileURL(at("src/site.config.ts")).href
    return (await import(config)).siteConfig
  } catch (error) {
    fail(`couldn't load src/site.config.ts: ${error.message}`)
  }
}

/**
 * Where in `public/` to write: `seo.ogImage`, with its extension changed to
 * `.jpg` for a photo or `.png` for a card if it's the other.
 */
function ogImagePath(ogImage) {
  if (!ogImage.startsWith("/")) {
    fail(`seo.ogImage (${ogImage}) isn't a path in public/: pass --out`)
  }
  const [, base, ext = ""] = ogImage.match(/^(.*?)(\.[^./]*)?$/)
  if (args.image ? /^\.jpe?g$/i.test(ext) : /^\.png$/i.test(ext)) return ogImage
  return `${base}${args.image ? ".jpg" : ".png"}`
}

function cssWeight(value, fallback) {
  const weight = { normal: 400, bold: 700 }[value] ?? Number.parseInt(value, 10)
  return Number.isFinite(weight) ? weight : fallback
}

function parseEm(value) {
  const em = value?.match(/^(-?[\d.]+)em$/)
  return em ? Number.parseFloat(em[1]) : 0
}

function svgRect(width, height, fill) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="${fill}"/></svg>`
  )
}

function escapeMarkup(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function warn(message) {
  console.warn(`pnpm og: ${message}`)
}

function fail(message) {
  console.error(`pnpm og: ${message}`)
  process.exit(1)
}
