import { defineConfig } from '@maz-ui/eslint-config'
import pluginOxlint from 'eslint-plugin-oxlint'

export default defineConfig(
  {
    formatters: true,
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
    sonarjs: true,
    tailwindcss: true,
    typescript: true,
    vue: true,
  },
  ...pluginOxlint.configs['flat/recommended'],
)
