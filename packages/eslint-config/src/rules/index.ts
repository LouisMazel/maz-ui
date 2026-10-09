import type { Rule } from 'eslint'
import tailwindNoArbitraryPx from './tailwind/no-arbitrary-px'

/**
 * Registry of all custom rules shipped by `@maz-ui/eslint-config`.
 *
 * Keys here are the final rule names exposed by the `maz` plugin, so a
 * file in `src/rules/tailwind/no-arbitrary-px.ts` becomes
 * `maz/tailwind-no-arbitrary-px` when wired through the plugin.
 *
 * Add new rules by dropping a file in the matching category folder
 * (`tailwind/`, `js/`, …) and registering it below.
 */
export const rules: Record<string, Rule.RuleModule> = {
  'tailwind-no-arbitrary-px': tailwindNoArbitraryPx,
}
