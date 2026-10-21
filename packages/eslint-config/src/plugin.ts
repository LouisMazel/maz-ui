import type { ESLint } from 'eslint'
import { rules } from './rules'

/**
 * The `maz` ESLint plugin bundling all custom rules shipped by
 * `@maz-ui/eslint-config`. Rules are namespaced by category:
 *
 *   - `maz/tailwind-*` — Tailwind-specific rules
 *   - `maz/js-*` — general JS/TS rules (when added)
 *   - …
 *
 * The plugin is auto-wired by the relevant config block in
 * `src/configs/*.ts`, but it is also exported so users can compose
 * their own flat-config setup.
 */
export const mazPlugin: ESLint.Plugin = {
  meta: {
    name: 'maz',
  },
  rules,
}
