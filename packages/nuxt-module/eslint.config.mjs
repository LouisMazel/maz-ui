import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    standalone: true,
    typescript: {
      strict: true,
    },
    stylistic: true,
    tooling: true,
  },
}).overrideRules({
  'vue/multi-word-component-names': 'off',
})
