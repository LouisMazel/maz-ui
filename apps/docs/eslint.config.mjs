// @ts-check

import { defineConfig } from '@maz-ui/eslint-config/src/index.ts'

export default defineConfig(
  {
    formatters: true,
    vue: true,
    sonarjs: true,
    tailwindcss: true,
    vueAccessibility: true,
  },
)
