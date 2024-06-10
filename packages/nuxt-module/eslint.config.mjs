import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
// import eslintConfig from './../lib/eslint.config.js'

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
