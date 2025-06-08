import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig(
  {
    formatters: true,
    vue: true,
    vueAccessibility: true,
    tailwindcss: true,
    sonarjs: true,
  },
)
