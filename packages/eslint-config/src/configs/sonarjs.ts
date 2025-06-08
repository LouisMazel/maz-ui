/**
 * SonarJS rules configuration
 * Focused on code quality and maintainability
 */
export const sonarjsRules = {
  // Disable overly strict SonarJS rules
  'sonarjs/no-duplicate-string': 'off',
  'sonarjs/class-name': 'off',
  'sonarjs/no-nested-conditional': 'off',
  'sonarjs/sonar-no-unused-vars': 'off',
  'sonarjs/cognitive-complexity': ['error', 20],

  // Keep useful SonarJS rules
  'sonarjs/no-identical-functions': 'error',
  'sonarjs/no-collapsible-if': 'error',
  'sonarjs/prefer-immediate-return': 'error',
  'sonarjs/prefer-object-literal': 'error',
  'sonarjs/prefer-single-boolean-return': 'error',
} as const

/**
 * SonarJS rules for test files
 */
export const sonarjsTestRules = {
  'sonarjs/no-nested-functions': 'off',
  'sonarjs/cognitive-complexity': 'off',
  'sonarjs/no-hardcoded-credentials': 'off',
  'sonarjs/no-duplicate-string': 'off',
} as const
