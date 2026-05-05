import type { StylelintRules } from '../types'
import { TAILWIND_AT_RULES } from './tailwind'

/**
 * Native SCSS at-rules that should never be flagged by `at-rule-no-unknown`
 * even when authored inside a plain CSS file (e.g. before SCSS is parsed).
 */
const SCSS_AT_RULES: string[] = [
  'use',
  'forward',
  'mixin',
  'include',
  'function',
  'return',
  'if',
  'else',
  'each',
  'for',
  'while',
  'extend',
  'at-root',
  'debug',
  'warn',
  'error',
  'content',
]

/**
 * Rules applied when SCSS support is enabled. Mirrors the at-rule whitelist
 * so projects that use SCSS *and* Tailwind don't get false positives from
 * `scss/at-rule-no-unknown`.
 */
export function scssRules(includeTailwind: boolean): StylelintRules {
  return {
    'scss/at-rule-no-unknown': [true, {
      ignoreAtRules: [
        ...SCSS_AT_RULES,
        ...(includeTailwind ? TAILWIND_AT_RULES : []),
      ],
    }],
    /**
     * SCSS `@use` is forbidden by default in some configs because it must be
     * at the very top of the file. We trust authors here — the SCSS compiler
     * itself enforces the placement.
     */
    'scss/at-use-no-unnamespaced': null,
  }
}
