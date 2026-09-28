/**
 * Third-party embed providers: the name shown in the privacy notice and the
 * provider's privacy policy.
 *
 * Adding a provider (Fresha, OpenTable, SimplyBook.me, a YouTube video...):
 * 1. Add an entry here (or pass `providerName` / `privacyUrl` to the
 *    component for a one-off).
 * 2. Mention it in the site's privacy policy.
 */
export interface EmbedProvider {
  /** Company named in the notice: "Loads content from <name>." */
  name: string
  privacyUrl: string
}

export const embedProviders = {
  "google-maps": {
    name: "Google",
    privacyUrl: "https://policies.google.com/privacy",
  },
  calendly: {
    name: "Calendly",
    privacyUrl: "https://calendly.com/legal/privacy-notice",
  },
} as const satisfies Record<string, EmbedProvider>

export type EmbedProviderId = keyof typeof embedProviders

/** localStorage key that remembers "always load" for a provider. */
export const embedConsentKey = (provider: string) => `embed-consent:${provider}`
