import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig(
  {
    formatters: true,
    sonarjs: true,
    tailwindcss: true,
    typescript: true,
    vue: true,
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**', 'stats.html'],
  },
)
