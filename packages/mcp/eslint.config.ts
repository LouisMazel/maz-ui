import { defineConfig } from '@maz-ui/eslint-config'

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
}, {
  files: ['**/*.spec.ts', '**/*.test.ts'],
  rules: {
    'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'warn'],
  },
})
