/**
 * Third-party embed providers: the name shown in the privacy notice, the
 * provider's privacy policy and the origin its iframe loads from.
 *
 * Adding a provider (Fresha, OpenTable, SimplyBook.me, a YouTube video...):
 * 1. Add an entry here (or pass `providerName` / `privacyUrl` to the
 *    component for a one-off).
 * 2. Add its `origin` to `frame-src` in `security.csp.directives` in
 *    `astro.config.ts`, otherwise the browser blocks the iframe.
 * 3. Mention it in the site's privacy policy.
 */
export interface EmbedProvider {
  /** Company named in the notice: "Loads content from <name>." */
  name: string
  privacyUrl: string
  /** Origin the iframe is served from (for `frame-src`). */
  origin: string
}

export const embedProviders = {
  "google-maps": {
    name: "Google",
    privacyUrl: "https://policies.google.com/privacy",
    origin: "https://www.google.com",
  },
  calendly: {
    name: "Calendly",
    privacyUrl: "https://calendly.com/legal/privacy-notice",
    origin: "https://calendly.com",
  },
} as const satisfies Record<string, EmbedProvider>

export type EmbedProviderId = keyof typeof embedProviders

/** localStorage key that remembers "always load" for a provider. */
export const embedConsentKey = (provider: string) => `embed-consent:${provider}`
