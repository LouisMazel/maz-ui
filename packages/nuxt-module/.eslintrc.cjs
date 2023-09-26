module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['eslint:recommended', '@nuxt/eslint-config'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
  },
}
