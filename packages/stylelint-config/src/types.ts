import type { Config } from 'stylelint'

export type StylelintConfig = Config
export type StylelintRules = Config['rules']
export type StylelintOverride = NonNullable<Config['overrides']>[number]

/**
 * Property order strategy.
 *
 * - `'recess'`: Recess-based ordering (`stylelint-config-recess-order`).
 *   Pragmatic, widely adopted, groups related properties together.
 * - `'alphabetical'`: Strict A→Z ordering. Easy mental model, slightly worse
 *   diffs than recess.
 * - `false`: Disable ordering rules entirely.
 */
export type StylelintOrderStrategy = 'recess' | 'alphabetical' | false

export interface MazStylelintOptions {
  /**
   * Enable Vue support — extends `stylelint-config-recommended-vue` and
   * registers `postcss-html` for `<style>` blocks in `.vue` files.
   *
   * Auto-detected from `vue` or `nuxt` in the consuming `package.json`
   * unless explicitly set.
   */
  vue?: boolean

  /**
   * Enable HTML support — extends `stylelint-config-html` and registers
   * `postcss-html` for `<style>` blocks in `.html`, `.svg` and similar files.
   *
   * @default false
   */
  html?: boolean

  /**
   * Enable Tailwind CSS support — whitelists the v4 at-rules
   * (`@apply`, `@reference`, `@variant`, `@theme`, `@layer`, `@utility`,
   * `@source`, `@custom-variant`, `@tailwind`, `@screen`, `@starting-style`)
   * and relaxes patterns that conflict with Tailwind's prefixed classes.
   *
   * Auto-detected from `tailwindcss` in the consuming `package.json` unless
   * explicitly set.
   */
  tailwind?: boolean

  /**
   * Enable SCSS support — extends `stylelint-config-recommended-scss` and
   * registers `postcss-scss` for `.scss` files.
   *
   * Auto-detected from `sass` / `sass-embedded` / `node-sass` /
   * `stylelint-scss` in the consuming `package.json` unless explicitly set.
   */
  scss?: boolean

  /**
   * Encourage logical CSS properties (`inset-block`, `margin-inline-start`,
   * `padding-inline`, …) over their physical equivalents (`top`, `margin-left`,
   * `padding-left`, …). Highly recommended for RTL/LTR-aware design systems.
   *
   * @default true
   */
  logical?: boolean

  /**
   * Property order strategy. See {@link StylelintOrderStrategy}.
   *
   * @default 'recess'
   */
  order?: StylelintOrderStrategy

  /**
   * Glob patterns of files Stylelint should ignore, merged with the package's
   * sensible defaults (`node_modules/**`, `dist/**`, `coverage/**`, …).
   */
  ignores?: string[]

  /**
   * Replace the default ignore list with this one (no merge).
   */
  ignoresOverride?: string[]

  /**
   * Custom rules merged on top of the resolved configuration. Use this to
   * tweak severity, disable rules or override their options.
   *
   * @example
   * ```ts
   * defineMazStylelintConfig({
   *   rules: {
   *     'no-descending-specificity': null,
   *     'declaration-block-no-redundant-longhand-properties': [true, {
   *       ignoreShorthands: ['grid-template'],
   *     }],
   *   },
   * })
   * ```
   */
  rules?: StylelintRules

  /**
   * Additional overrides appended to the resolved configuration. Use this to
   * apply rules to specific file globs (legacy code, generated CSS, …).
   *
   * @example
   * ```ts
   * defineMazStylelintConfig({
   *   overrides: [
   *     { files: ['**\/*.legacy.css'], rules: { 'no-descending-specificity': null } },
   *   ],
   * })
   * ```
   */
  overrides?: StylelintOverride[]

  /**
   * Additional plugins merged on top of the resolved configuration.
   */
  plugins?: NonNullable<Config['plugins']>
}
