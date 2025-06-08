import type { Rules } from '@antfu/eslint-config'

export const vueRules = {
  'vue/custom-event-name-casing': ['error', 'kebab-case'],
} satisfies Partial<Rules>
