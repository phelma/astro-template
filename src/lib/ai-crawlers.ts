/**
 * User agents disallowed in robots.txt when
 * `siteConfig.robots.allowAiCrawlers` is false.
 *
 * Curated to AI model-training crawlers and AI search/assistant fetchers
 * that honour robots.txt. Regular search engines (Googlebot, Bingbot,
 * Applebot) and link-preview fetchers (facebookexternalhit, Slackbot, ...)
 * are deliberately NOT listed, so blocking AI doesn't hurt search or sharing.
 * `Google-Extended` and `Applebot-Extended` are opt-out tokens: they don't
 * crawl, they control whether already-crawled pages are used for AI.
 *
 * robots.txt is advisory. For a fuller, maintained list see
 * https://github.com/ai-robots-txt/ai.robots.txt, and consider Cloudflare's
 * "Block AI bots" / AI Crawl Control for enforcement.
 * User-agent matching is case-insensitive (RFC 9309).
 */

/** Crawlers that collect content for training models / datasets. */
export const aiTrainingCrawlers = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Google-Extended",
  "Google-CloudVertexBot",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Meta-ExternalAgent",
  "FacebookBot",
  "Amazonbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "AI2Bot",
  "Ai2Bot-Dolma",
  "MistralAI-Training",
  "DeepSeekBot",
  "QwenBot",
  "PanguBot",
  "Diffbot",
  "ImagesiftBot",
  "img2dataset",
  "omgili",
  "omgilibot",
  "Timpibot",
  "Kangaroo Bot",
] as const

/** AI search indexers and user-triggered AI assistant fetchers. */
export const aiAssistantCrawlers = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Meta-ExternalFetcher",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
] as const

export const aiCrawlers: readonly string[] = [
  ...aiTrainingCrawlers,
  ...aiAssistantCrawlers,
]
