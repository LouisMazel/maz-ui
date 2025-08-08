import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  formatters: true,
  vue: true,
  sonarjs: true,
  rules: {
    'ts/ban-ts-comment': 'off',
  },
  ignores: ['src/icon-list.ts', 'src/index.ts'],
})
