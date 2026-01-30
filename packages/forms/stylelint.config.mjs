/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ['node_modules/**/*', '.DS_Store', 'dist/**/*', 'types/**/*', 'coverage/**/*'],
  plugins: ['stylelint-scss'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-tailwindcss',
  ],

  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-unknown': [true, { ignoreAtRules: ['screen', 'layer', 'tailwind', 'each', 'for', 'use'] }],
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['screen', 'layer', 'tailwind', 'each', 'for', 'use'] }],
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep'] }],
    'selector-class-pattern': undefined,
    'no-descending-specificity': undefined,
    'function-no-unknown': [true, { ignoreFunctions: ['v-bind'] }],
  },

  overrides: [
    {
      files: [
        '**/*.vue',
        '**/*.html',
      ],
      customSyntax: 'postcss-html',
    },
  ],
}
