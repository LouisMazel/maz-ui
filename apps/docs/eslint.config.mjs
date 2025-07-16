// @ts-check

import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig(
  {
    formatters: true,
    vue: true,
    tailwindcss: true,
    sonarjs: false,
    vueAccessibility: false,
    markdown: true,
  },
  {
    ignores: ['docs/**/*.md'],
  },
)
