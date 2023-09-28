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
  },
}
