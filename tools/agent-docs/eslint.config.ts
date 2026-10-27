import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  formatters: true,
  typescript: true,
  sonarjs: true,
  e18e: false,
  ignores: ['content/**/*.md'],
}, {
  rules: {
    'no-console': 'off',
    'sonarjs/no-nested-template-literals': 'off',
  },
}, {
  // Build-time generator parsing the markdown, CSS and TypeScript sources of
  // this repository: the backtracking warnings don't apply to trusted inputs.
  files: ['src/**/*.ts'],
  rules: {
    'sonarjs/super-linear-regex': 'off',
    'sonarjs/slow-regex': 'off',
    'sonarjs/regex-complexity': 'off',
    'regexp/no-super-linear-backtracking': 'off',
  },
})
