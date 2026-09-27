/**
 * Astro integration: after the build, write a Markdown copy of every
 * indexable page next to its HTML (/about -> /about.md, / -> /index.md)
 * and concatenate them into /llms-full.txt, so agents get clean content
 * without the page chrome.
 *
 * The Markdown is converted from each page's built `<main>`, so it can't
 * drift from the HTML. Pages whose robots meta says `noindex` are skipped
 * (BaseLayout only links a Markdown copy for indexable pages). Inside
 * `<main>`, breadcrumbs, hidden and `aria-hidden` content, SVGs, scripts
 * and anything marked `data-markdown-ignore` are dropped; links and images
 * become absolute URLs.
 *
 * Build-only: `astro dev` serves no .md files or llms-full.txt.
 *
 * Relative imports only: this module is imported by `astro.config.ts`.
 */
import { readdir, readFile, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import type { AstroIntegration } from "astro"
import type { Element, ElementContent, Root } from "hast"
import { matches, select, selectAll } from "hast-util-select"
import rehypeParse from "rehype-parse"
import rehypeRemark from "rehype-remark"
import remarkGfm from "remark-gfm"
import remarkStringify from "remark-stringify"
import { unified } from "unified"

import { siteConfig } from "../site.config"

/** Elements inside <main> that aren't content. */
const ignoreSelector = [
  "script",
  "style",
  "template",
  "noscript",
  "svg",
  "[hidden]",
  '[aria-hidden="true"]',
  'nav[aria-label="Breadcrumb"]',
  "[data-markdown-ignore]",
].join(", ")

interface MarkdownPage {
  path: string
  url: string
  title: string
  description: string
  body: string
}

const htmlParser = unified().use(rehypeParse)
const markdownProcessor = unified()
  .use(rehypeRemark)
  .use(remarkGfm)
  .use(remarkStringify, { bullet: "-", emphasis: "_", rule: "-" })

function textContent(node: Element | undefined): string {
  if (!node) return ""
  return node.children
    .map((child) =>
      child.type === "text"
        ? child.value
        : child.type === "element"
          ? textContent(child)
          : ""
    )
    .join("")
    .trim()
}

function attribute(node: Element | undefined, name: string): string {
  const value = node?.properties[name]
  return Array.isArray(value) ? value.join(" ") : String(value ?? "")
}

const isBlank = (node: ElementContent | undefined) =>
  node?.type === "text" && node.value.trim() === ""

/**
 * Drop non-content elements, and trim the whitespace an icon leaves inside
 * a link (it would otherwise swallow the space before the next link).
 */
function prune(node: Element): void {
  node.children = node.children.filter(
    (child: ElementContent) =>
      child.type !== "comment" &&
      !(child.type === "element" && matches(ignoreSelector, child))
  )
  if (node.tagName === "a") {
    while (isBlank(node.children[0])) node.children.shift()
    while (isBlank(node.children.at(-1))) node.children.pop()
    const first = node.children[0]
    const last = node.children.at(-1)
    if (first?.type === "text") first.value = first.value.trimStart()
    if (last?.type === "text") last.value = last.value.trimEnd()
  }
  for (const child of node.children) {
    if (child.type === "element") prune(child)
  }
}

async function toMarkdownPage(html: string): Promise<MarkdownPage | undefined> {
  const tree = htmlParser.parse(html)
  const robots = attribute(select('meta[name="robots"]', tree), "content")
  const main = select("main", tree)
  if (!main || robots.includes("noindex")) return undefined

  const url = attribute(select('link[rel~="canonical"]', tree), "href")
  prune(main)
  for (const link of selectAll("a[href]", main)) {
    link.properties.href = new URL(attribute(link, "href"), url).href
  }
  for (const image of selectAll("img[src]", main)) {
    image.properties.src = new URL(attribute(image, "src"), url).href
  }

  const root: Root = { type: "root", children: main.children }
  const mdast = await markdownProcessor.run(root)
  return {
    path: new URL(url).pathname,
    url,
    title: textContent(select("title", tree)),
    description: attribute(select('meta[name="description"]', tree), "content"),
    body: markdownProcessor.stringify(mdast).trim(),
  }
}

/** Page order for llms-full.txt: nav, then footer, then the rest by path. */
function byNavOrder(a: MarkdownPage, b: MarkdownPage): number {
  const order = [...siteConfig.nav, ...siteConfig.footer].map((l) => l.href)
  const rank = (page: MarkdownPage) => {
    const index = order.indexOf(page.path)
    return index === -1 ? order.length : index
  }
  return rank(a) - rank(b) || a.path.localeCompare(b.path)
}

export function markdownExport(): AstroIntegration {
  return {
    name: "markdown-export",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir)
        const files = (await readdir(outDir, { recursive: true })).filter(
          (file) => file.endsWith(".html")
        )

        const pages: MarkdownPage[] = []
        for (const file of files) {
          const html = await readFile(`${outDir}/${file}`, "utf8")
          const page = await toMarkdownPage(html)
          if (!page) continue

          const frontmatter = [
            "---",
            `title: ${JSON.stringify(page.title)}`,
            `description: ${JSON.stringify(page.description)}`,
            `url: ${page.url}`,
            "---",
          ].join("\n")
          await writeFile(
            `${outDir}/${file.replace(/\.html$/, ".md")}`,
            `${frontmatter}\n\n${page.body}\n`
          )
          pages.push(page)
        }

        if (pages.length === 0) return
        pages.sort(byNavOrder)
        const full = [
          `# ${siteConfig.name}`,
          "",
          `> ${siteConfig.description}`,
          ...pages.flatMap((page) => [
            "",
            "---",
            "",
            `URL: ${page.url}`,
            "",
            page.body,
          ]),
        ].join("\n")
        await writeFile(`${outDir}/llms-full.txt`, `${full}\n`)
        logger.info(`Wrote ${pages.length} Markdown pages and llms-full.txt`)
      },
    },
  }
}
