import type { FAQPage, WithContext } from "schema-dts"

export interface FaqEntry {
  question: string
  /**
   * Plain-text answer. Blank lines split paragraphs. Omit it and pass rich
   * content through FaqItem's slot instead (then it's left out of JSON-LD).
   */
  answer?: string
}

/**
 * schema.org FAQPage for the questions shown on the page. Only mark up
 * questions that are visible on that page, with the same wording, and use it
 * on one FAQ per page. Google currently only shows FAQ rich results for
 * well-known government and health sites, but the markup is still valid and
 * read by other consumers (Bing, AI assistants).
 */
export function faqPageSchema(items: FaqEntry[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items
      .filter((item) => item.answer)
      .map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer ?? "" },
      })),
  }
}

/** Split a plain-text answer into paragraphs on blank lines. */
export function answerParagraphs(answer: string): string[] {
  return answer
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
