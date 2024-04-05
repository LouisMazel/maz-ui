module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: [
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
    '@nuxt/eslint-config',
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'no-duplicate-imports': 'error',
    // '@typescript-eslint/consistent-type-imports': [
    //   'error',
    //   {
    //     fixStyle: 'inline-type-imports',
    //   },
    // ],
    'unicorn/import-style': [
      'error',
      {
        styles: {
          'node:path': {
            named: true,
            default: false,
          },
        },
      },
    ],
  },
}
