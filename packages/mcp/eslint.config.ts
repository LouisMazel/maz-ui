import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  formatters: true,
  typescript: true,
  sonarjs: true,
  e18e: false,
}, {
  rules: {
    'antfu/no-top-level-await': 'off',
    'no-console': 'off',
    'sonarjs/no-nested-template-literals': 'off',
  },
}, {
  // The review engine and the docs search parse the source files of the
  // user's own project, locally: the backtracking warnings don't apply.
  files: ['src/**/*.ts'],
  rules: {
    'sonarjs/super-linear-regex': 'off',
    'sonarjs/slow-regex': 'off',
    'sonarjs/regex-complexity': 'off',
    'regexp/no-super-linear-backtracking': 'off',
  },
}, {
  files: ['**/*.spec.ts', '**/*.test.ts'],
  rules: {
    'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'warn'],
    // The tests create git repositories in temporary folders
    'sonarjs/no-os-command-from-path': 'off',
  },
})
