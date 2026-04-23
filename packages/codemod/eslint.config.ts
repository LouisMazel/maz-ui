import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig(
  {
    formatters: true,
    typescript: true,
    sonarjs: true,
    ignores: ['README.md', 'LICENSE', 'dist'],
    rules: {
      // CLI output is the tool's interface, not accidental debug logging.
      'no-console': 'off',
    },
  },
  {
    // Codemod regexes are intentionally complex (they parse Tailwind token
    // syntax). Super-linear-backtracking / useless-non-capturing warnings
    // don't apply to a dev-time CLI run against the consumer's own source.
    files: ['src/**/*.ts'],
    rules: {
      'sonarjs/slow-regex': 'off',
      'sonarjs/regex-complexity': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/no-misleading-capturing-group': 'off',
      'regexp/no-useless-non-capturing-group': 'off',
    },
  },
)
