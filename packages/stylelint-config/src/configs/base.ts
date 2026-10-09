import type { StylelintRules } from '../types'

/**
 * Baseline rules applied on top of `stylelint-config-standard`.
 *
 * The goal is **opinionated but pragmatic**: keep the standard config's
 * idiomatic-CSS rules, soften the few that fight nested component styling
 * (Vue, BEM, Tailwind), and add a couple of universally-good rules that are
 * not in the standard config.
 */
export const baseRules: StylelintRules = {
  /**
   * `selector-class-pattern` enforces kebab-case by default. Component
   * libraries that ship BEM (`m-btn__icon`) or Tailwind-prefixed classes
   * (`maz:flex`) trip over it constantly.
   */
  'selector-class-pattern': null,

  /**
   * `no-descending-specificity` fires false positives in scoped Vue/CSS
   * modules where the nesting depth simply reflects the markup. Off by
   * default; teams that want it can re-enable in their own override.
   */
  'no-descending-specificity': null,

  /**
   * Allow author-time use of Vue's `v-bind()` and the (now widely supported)
   * native `light-dark()` color function.
   */
  'function-no-unknown': [true, {
    ignoreFunctions: ['v-bind', 'light-dark'],
  }],

  /**
   * Native CSS nesting now allows scoping inside another at-rule without an
   * explicit selector — the `& selector` form is valid in 2026 browsers and
   * Tailwind v4 emits it. Disable the warning.
   */
  'nesting-selector-no-missing-scoping-root': null,

  /**
   * Allow `:deep()` (Vue scoped-style descent) and `:global()` (CSS Modules)
   * out of the box.
   */
  'selector-pseudo-class-no-unknown': [true, {
    ignorePseudoClasses: ['deep', 'global', 'slotted', 'where'],
  }],

  /**
   * Custom property names follow kebab-case in our public CSS APIs
   * (`--maz-primary`, `--m-btn-bg`). Standard config already allows this but
   * we make the pattern explicit to surface the convention.
   */
  'custom-property-pattern': [
    '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:--[a-z0-9-]+)?$',
    {
      message: 'Custom properties should be kebab-case (e.g. --my-token, --my-block--variant).',
    },
  ],

  /**
   * Be lenient on shorthand collapsing — `grid-template`/`grid-template-areas`
   * and the `inset` longhands are routinely written long-form for readability.
   */
  'declaration-block-no-redundant-longhand-properties': [true, {
    ignoreShorthands: ['grid-template', 'inset'],
  }],
}
