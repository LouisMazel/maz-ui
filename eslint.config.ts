import { defineConfig } from '@maz-ui/eslint-config/src/index.js'

export default defineConfig(
  {
    formatters: true,
    typescript: true,
    sonarjs: true,
    markdown: true,
  },
  {
    ignores: ['./packages/**/*', './apps/**/*', './tools/**/*'],
  },
)
