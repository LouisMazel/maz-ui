import { defineConfig } from '@maz-ui/eslint-config/src/index.js'

export default defineConfig(
  {
    formatters: true,
    vue: true,
    vueAccessibility: true,
    tailwindcss: true,
    sonarjs: true,
  },
  {
    rules: {
      'sonarjs/no-nested-conditional': 'off',
    },
  },
)
