// @ts-check

import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig(
  {
    formatters: true,
    vue: true,
    sonarjs: false,
    tailwindcss: true,
    vueAccessibility: false,
  },
  {
    ignores: ['docs/**/*.md'],
    // rules: {
    //   'no-console': 'off',
    //   'vue/no-unused-refs': 'off',
    //   'style/max-statements-per-line': 'off',
    // },
  },
)
