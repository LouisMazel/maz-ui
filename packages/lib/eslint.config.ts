import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig(
  {
    formatters: true,
    vue: true,
    vueAccessibility: true,
    tailwindcss: true,
  },
  {
    rules: {
      'sonarjs/no-nested-conditional': 'off',
    },
  },
  {
    files: ['src/components/**/*.vue'],
    rules: {
      'import/first': 'off',
    },
  },
)
