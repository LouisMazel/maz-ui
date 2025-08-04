import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  formatters: true,
  typescript: true,
  sonarjs: true,
  rules: {
    'antfu/no-top-level-await': 'off',
  },
}, {
  files: ['mcp_server.ts'],
  rules: {
    'sonarjs/no-nested-template-literals': 'off',
  },
})
