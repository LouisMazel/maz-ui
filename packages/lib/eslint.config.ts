import { defineConfig } from '@maz-ui/eslint-config/src/index.ts'

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
