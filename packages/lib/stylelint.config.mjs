/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ['components_tmp/**/*', 'node_modules/**/*', '.DS_Store', 'dist/**/*', 'types/**/*', 'coverage/**/*'],

  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-standard-scss',
    'stylelint-config-tailwindcss',
  ],

  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-unknown': [true, { ignoreAtRules: ['screen', 'layer', 'tailwind', 'each', 'for'] }],
    'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['screen', 'layer', 'tailwind', 'each'] }],
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep'] }],
    'selector-class-pattern': undefined,
    'no-descending-specificity': undefined,
    'function-no-unknown': [true, { ignoreFunctions: ['v-bind'] }],
  },

  overrides: [
    {
      files: [
        '**/*.vue',
      ],
      customSyntax: 'postcss-html',
    },
  ],
}
