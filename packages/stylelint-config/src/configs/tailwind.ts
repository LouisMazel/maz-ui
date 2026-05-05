import type { Plugin } from 'stylelint'
import type { StylelintRules } from '../types'
import {
  noApplyPlugin,
  noArbitraryValuePlugin,
  noAtomicClassPlugin,
  noCssLayerPlugin,
  noImportDirectivePlugin,
  noInvalidApplyPlugin,
  noInvalidThemeFunctionPlugin,
  noScreenDirectivePlugin,
  noTailwindDirectivePlugin,
  noThemeFunctionPlugin,
} from 'stylelint-plugin-tailwindcss'

type StylelintPluginInstance = string | Plugin

/**
 * Tailwind v4 at-rules. New ones can be added without bumping a major
 * version since the rule treats unknown at-rules as warnings, not errors,
 * but we still prefer to keep this list current.
 *
 * Source: https://tailwindcss.com/docs (v4 directives)
 */
export const TAILWIND_AT_RULES = [
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
] as const

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

/**
 * No plugin rules. `'minimal'` only ships the at-rule whitelist + a couple
 * of CSS-level rules (`import-notation`, `at-rule-no-deprecated`) — no
 * runtime Tailwind validation.
 *
 * Why empty: the plugin's validation rules (`no-invalid-apply`,
 * `no-invalid-theme-function`) auto-resolve the project's Tailwind runtime
 * from the linted file's path. Projects with a v4 prefix (`maz:`),
 * non-standard entry CSS, or workspace layouts where Tailwind isn't where
 * the plugin expects produce floods of false positives. Loading these
 * rules without a way to scope them is hostile by default.
 *
 * Opt in to `'recommended'` if your project lives in the plugin's happy
 * path.
 */
export const tailwindPluginMinimal: StylelintRules = {}

const tailwindPluginMinimalInstances: StylelintPluginInstance[] = []

/**
 * Plugin's recommended preset — `no-invalid-apply` and
 * `no-invalid-theme-function` (validation), plus policies that discourage
 * utility-first patterns inside authored CSS (`.flex { … }`, `@apply`,
 * arbitrary values).
 *
 * Opt-in only: the validation rules need to resolve your Tailwind runtime
 * from the linted file's path; if your project has a custom prefix, an
 * unusual entry CSS or sits in a monorepo, expect false positives.
 */
export const tailwindPluginRecommended: StylelintRules = {
  'tailwindcss/no-invalid-apply': true,
  'tailwindcss/no-invalid-theme-function': true,
  'tailwindcss/no-atomic-class': true,
  'tailwindcss/no-apply': true,
  'tailwindcss/no-arbitrary-value': true,
}

const tailwindPluginRecommendedInstances: StylelintPluginInstance[] = [
  noInvalidApplyPlugin as StylelintPluginInstance,
  noInvalidThemeFunctionPlugin as StylelintPluginInstance,
  noAtomicClassPlugin as StylelintPluginInstance,
  noApplyPlugin as StylelintPluginInstance,
  noArbitraryValuePlugin as StylelintPluginInstance,
]

/**
 * Plugin's strict preset — adds architecture-level checks on top of
 * recommended (no `theme()`, no `@screen`, no `@tailwind`, no `@import`,
 * no `@layer`). Suited to projects that strictly separate utility tokens
 * from authored CSS.
 */
export const tailwindPluginStrict: StylelintRules = {
  ...tailwindPluginRecommended,
  'tailwindcss/no-theme-function': true,
  'tailwindcss/no-screen-directive': true,
  'tailwindcss/no-tailwind-directive': true,
  'tailwindcss/no-import-directive': true,
  'tailwindcss/no-css-layer': true,
}

const tailwindPluginStrictInstances: StylelintPluginInstance[] = [
  ...tailwindPluginRecommendedInstances,
  noThemeFunctionPlugin as StylelintPluginInstance,
  noScreenDirectivePlugin as StylelintPluginInstance,
  noTailwindDirectivePlugin as StylelintPluginInstance,
  noImportDirectivePlugin as StylelintPluginInstance,
  noCssLayerPlugin as StylelintPluginInstance,
]

/**
 * Plugin instances for each Tailwind policy level. Stylelint accepts both
 * package-name strings and plugin instance objects in `config.plugins` —
 * `stylelint-plugin-tailwindcss` only ships the latter form.
 */
export const TAILWIND_POLICY_PLUGINS: Record<'minimal' | 'recommended' | 'strict', StylelintPluginInstance[]> = {
  minimal: tailwindPluginMinimalInstances,
  recommended: tailwindPluginRecommendedInstances,
  strict: tailwindPluginStrictInstances,
}
