import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  formatters: true,
  typescript: true,
  sonarjs: true,
}, {
  rules: {
    'sonarjs/no-os-command-from-path': 'off',
    'sonarjs/os-command': 'off',
  },
})
