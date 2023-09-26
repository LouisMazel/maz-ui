module.exports = {
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'comma-dangle': ['error', 'always-multiline'],
    // VUE
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ],
    // TYPESCRIPT
    '@typescript-eslint/consistent-type-imports': 'error',
  },
}
