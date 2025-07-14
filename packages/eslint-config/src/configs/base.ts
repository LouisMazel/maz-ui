import type { Rules } from '@antfu/eslint-config'

/**
 * Base ESLint rules for JavaScript/TypeScript projects
 * Optimized for code quality and consistency
 */
export function baseRules(isProduction: boolean): Partial<Rules> {
  return {
  // Console warnings in development, errors in production
    'no-console': [isProduction ? 'error' : 'warn'],

    // Code quality
    'prefer-regex-literals': 'off',
    'require-await': 'error',

    // Import/export
    'node/prefer-global/process': 'off',

    // Disable overly strict rules
    'no-unused-vars': 'off', // Handled by TypeScript
    'ts/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],

    // Allow reasonable complexity
    'complexity': ['error', { max: 20 }],
    'max-depth': ['error', { max: 4 }],
    'max-nested-callbacks': ['error', { max: 3 }],

    'unicorn/prefer-global-this': 'error',
  }
}
