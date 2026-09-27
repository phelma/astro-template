#!/usr/bin/env node
/**
 * Regenerate the raster icon set in public/ from public/icon.svg.
 *
 *   pnpm icons
 *
 * Outputs:
 * - favicon.ico           16x16 + 32x32 (PNG-encoded ICO entries)
 * - apple-touch-icon.png  180x180, opaque (iOS fills transparency with black)
 * - icon-192.png          192x192, transparent corners
 * - icon-512.png          512x512, transparent corners
 * - icon-maskable-512.png 512x512, opaque, mark inside the maskable safe zone
 *
 * The SVG is rasterised by librsvg (via sharp), which ignores
 * `prefers-color-scheme` media queries, so the light-scheme colours are used.
 * Set BACKGROUND to your logo's background colour (used for the opaque icons).
 */
import { writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const BACKGROUND = "#171717"

const publicDir = fileURLToPath(new URL("../public/", import.meta.url))
const source = `${publicDir}icon.svg`

/** Render the SVG to a square PNG buffer. */
function render(size) {
  // High density so small sizes are downsampled from a crisp raster.
  return sharp(source, { density: 1200 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/**
 * Render the SVG at `scale` of `size`, centred on an opaque BACKGROUND square.
 * Maskable icons must keep content within the central 80% circle
 * (https://w3c.github.io/manifest/#icon-masks); scale 0.6 leaves a margin.
 */
async function renderPadded(size, scale) {
  const inner = Math.round(size * scale)
  const offset = Math.round((size - inner) / 2)
  return sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: await render(inner), top: offset, left: offset }])
    .flatten({ background: BACKGROUND })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/** Pack PNG buffers into an ICO container (PNG entries, Vista+). */
function toIco(images) {
  const headerSize = 6
  const entrySize = 16
  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)

  let offset = headerSize + entrySize * images.length
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(entrySize)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2) // palette colours
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // colour planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += data.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)])
}

const outputs = {
  "favicon.ico": async () =>
    toIco(
      await Promise.all(
        [16, 32].map(async (size) => ({ size, data: await render(size) }))
      )
    ),
  "apple-touch-icon.png": () => renderPadded(180, 0.8),
  "icon-192.png": () => render(192),
  "icon-512.png": () => render(512),
  "icon-maskable-512.png": () => renderPadded(512, 0.6),
}

for (const [name, build] of Object.entries(outputs)) {
  const data = await build()
  await writeFile(`${publicDir}${name}`, data)
  console.log(`public/${name} (${data.length} bytes)`)
}
