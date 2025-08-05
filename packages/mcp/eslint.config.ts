import { defineConfig } from '@maz-ui/eslint-config/src/index.js'

export default defineConfig({
  formatters: true,
  typescript: true,
  sonarjs: true,
}, {
  rules: {
    'antfu/no-top-level-await': 'off',
    'no-console': 'off',
    'sonarjs/no-nested-template-literals': 'off',
  },
})
