module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-prettier',
    'plugin:vuejs-accessibility/recommended',
    '@vue/eslint-config-typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    'no-console': [
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      { allow: ['error', 'warn'] },
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'object-shorthand': ['error', 'always'],
    'no-duplicate-imports': 'error',
    // typescript
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
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'inline-type-imports',
      },
    ],
    // vue
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
      },
    ],
    'vue/attribute-hyphenation': 'error',
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

  overrides: [
    {
      files: ['tests/specs/**'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}
