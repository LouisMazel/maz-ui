/* eslint-disable unicorn/prefer-module */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  plugins: ['vue', 'prettier', 'unicorn', 'sonarjs'],
  extends: [
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-prettier',
    '@vue/eslint-config-typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ],
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    // unicorn
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
        ignore: ['\\.vue$'],
      },
    ],
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-array-for-each': 'warn',
    'unicorn/no-array-reduce': 'warn',
    'unicorn/prefer-dom-node-dataset': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-export-from': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-useless-undefined': 'off',
    // sonar
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/cognitive-complexity': 'warn',
  },
}
