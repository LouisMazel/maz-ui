import { defineConfig } from '@maz-ui/eslint-config/src/index.js'

export default defineConfig({
  formatters: true,
  vue: true,
  sonarjs: true,
  rules: {
    'ts/ban-ts-comment': 'off',
  },
})
