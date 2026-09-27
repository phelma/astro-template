/**
 * Native cross-document view transitions, enabled by
 * `siteConfig.viewTransitions`. `@view-transition` is an at-rule, so it can't
 * be toggled by a selector; BaseLayout renders this as an inline <style> only
 * when enabled (and `src/lib/csp.ts` hashes it for CSP).
 * Reduced-motion users get no animation (see global.css).
 */
export const viewTransitionStyle =
  "@media (prefers-reduced-motion: no-preference){@view-transition{navigation:auto}}"
