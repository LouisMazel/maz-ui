import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  formatters: true,
  typescript: true,
  sonarjs: true,
  e18e: false,
  ignores: ['results/**', 'fixture/**'],
}, {
  rules: {
    'no-console': 'off',
    'sonarjs/no-nested-template-literals': 'off',
  },
})
