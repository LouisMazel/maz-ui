import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  formatters: true,
  typescript: true,
  sonarjs: true,
  vue: true,
  rules: {
    'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'warn'],
  },
})
