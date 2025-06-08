/**
 * Tailwind CSS ESLint rules configuration
 */
export const tailwindcssRules = {
  // Allow custom class names (useful for component libraries)
  'tailwindcss/no-custom-classname': 'off',

  // Enforce consistent class ordering
  'tailwindcss/classnames-order': 'warn',

  // Prevent contradicting classes
  'tailwindcss/no-contradicting-classname': 'error',

  // Enforce valid Tailwind syntax
  'tailwindcss/enforces-negative-arbitrary-values': 'error',
  'tailwindcss/enforces-shorthand': 'warn',
} as const
