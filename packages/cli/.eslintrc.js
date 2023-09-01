/* eslint-disable unicorn/prefer-module */
module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    // 'plugin:prettier/recommended',
    'standard-with-typescript',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'space-before-function-paren': 'off',
    // TYPESCRIPT
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    // SONAR
    'sonarjs/no-duplicate-string': 'off',
    // UNICORN
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prefer-module': 'off',
    // PRETTIER
    // 'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
}
/* eslint-enable unicorn/prefer-module */
