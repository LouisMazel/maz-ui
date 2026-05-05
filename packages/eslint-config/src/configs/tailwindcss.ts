/**
 * Tailwind CSS ESLint rules configuration.
 *
 * These rules only activate when the user opts in via
 * `defineMazEslintConfig({ tailwindcss: true })` AND is on ESLint 9 +
 * Tailwind v3. The plugin itself does not yet support ESLint 10+ or
 * Tailwind v4 (upstream — uses the removed context.getSourceCode API).
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
