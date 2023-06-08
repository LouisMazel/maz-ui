module.exports = {
  customSyntax: 'postcss-html',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-tailwindcss',
  ],
  // https://stylelint.io/user-guide/configurationg
  rules: {
    'selector-class-pattern': undefined,
    'no-descending-specificity': undefined,
    'function-no-unknown': [true, { ignoreFunctions: ['v-bind'] }],
  },
}
