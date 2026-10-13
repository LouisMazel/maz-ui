import type { Rules } from '@antfu/eslint-config'

export const vueRules = {
  'vue/custom-event-name-casing': ['error', 'kebab-case'],
} satisfies Partial<Rules>

// Rules scoped to .vue SFCs only.
// `no-useless-assignment` is a core ESLint rule that performs flow analysis on
// the script block and has no awareness of <template>. Any const consumed only
// from the template (v-for sources, computed maps, etc.) gets flagged as a
// false positive, so we disable it on SFCs.
export const vueSfcOnlyRules = {
  'no-useless-assignment': 'off',
} satisfies Partial<Rules>
