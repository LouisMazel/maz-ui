import type { StylelintRules } from '../types'

/**
 * Tailwind v4 at-rules. New ones can be added without bumping a major
 * version since the rule treats unknown at-rules as warnings, not errors,
 * but we still prefer to keep this list current.
 *
 * Source: https://tailwindcss.com/docs (v4 directives)
 */
export const TAILWIND_AT_RULES: string[] = [
  // v4 core
  'theme',
  'utility',
  'source',
  'variant',
  'custom-variant',
  'reference',
  'apply',
  'layer',
  'screen',
  'starting-style',

  // v3 carryover (still emitted by some Tailwind plugins)
  'tailwind',
  'config',
  'plugin',
  'responsive',
]

/**
 * Rules to whitelist Tailwind's at-rules and relax patterns that conflict
 * with Tailwind-prefixed classes (`maz:flex`, `dark:bg-…`).
 *
 * When SCSS is also enabled, `at-rule-no-unknown` is disabled by
 * `stylelint-config-recommended-scss` in favor of `scss/at-rule-no-unknown`
 * — keep that rule out of this set and merge it in only when SCSS is off.
 */
export const tailwindRules: StylelintRules = {
  'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],

  /**
   * Tailwind v4 only parses the `prefix(...)` modifier on the bare-string
   * `@import "..."` form; wrapping the URL in `url(...)` swallows the modifier
   * and breaks the build. Force the bare-string syntax.
   */
  'import-notation': 'string',
}

/**
 * Tailwind at-rule whitelist for plain CSS contexts (no SCSS).
 *
 * Merged on top of `tailwindRules` only when SCSS support is disabled —
 * with SCSS on, `scss/at-rule-no-unknown` covers both Tailwind and SCSS
 * directives, and `at-rule-no-unknown` itself is disabled by the SCSS
 * recommended config.
 */
export const tailwindAtRuleNoUnknown: StylelintRules = {
  'at-rule-no-unknown': [true, { ignoreAtRules: TAILWIND_AT_RULES }],
}
