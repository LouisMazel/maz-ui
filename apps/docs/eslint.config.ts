// @ts-check

import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig(
  {
    formatters: true,
    vue: true,
    tailwindcss: {
      entryPoint: '.vitepress/theme/main.css',
      detectComponentClasses: true,
      tsconfig: './tsconfig.json',
      preset: 'recommended',
      noArbitraryPx: {
        baseFontSize: 14,
        severity: 'error',
        unit: 'rem',
      },
    },
    sonarjs: false,
    vueAccessibility: false,
    markdown: true,
  },
  {
    ignores: ['src/**/*.md'],
  },
)
