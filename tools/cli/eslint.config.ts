import { defineConfig } from '@maz-ui/eslint-config/src/index.js'

export default defineConfig({
  formatters: true,
  typescript: true,
  sonarjs: true,
  vue: true,
}, {
  rules: {
    'no-console': 'off',
  },
})
