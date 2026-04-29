import type { StylelintConfig, StylelintRules } from '../types'

/**
 * Stylelint plugin that flags physical CSS properties (`top`/`right`/`left`/
 * `bottom`, `margin-left`, `padding-right`, `border-left-color`, …) and
 * suggests their logical counterparts (`inset-block`, `margin-inline-start`,
 * …). Critical for any design system that supports RTL.
 *
 * @see https://github.com/Jordan-Hall/stylelint-use-logical-spec
 */
export const LOGICAL_PLUGIN: StylelintConfig['plugins'] = ['stylelint-use-logical-spec']

/**
 * Flag every physical property/value that has a logical equivalent.
 * `liberty/use-logical-spec` is the rule name exposed by the plugin.
 *
 * The third argument `except` is intentionally empty — we want a clean
 * baseline. Teams that need to allow specific physical props (e.g. they
 * deliberately compute `top: 0` for a fixed header that can't be flipped)
 * can override the rule in their own config.
 */
export const logicalRules: StylelintRules = {
  'liberty/use-logical-spec': ['always'],
}
