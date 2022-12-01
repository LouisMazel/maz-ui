/* eslint-disable unicorn/prefer-module */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-recommended-vue',
    'stylelint-config-standard-scss',
    'stylelint-config-tailwindcss',
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['screen', 'layer', 'tailwind', 'each', 'for'] },
    ],
    'scss/at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['screen', 'layer', 'tailwind', 'each'] },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['deep'] },
    ],
    'selector-class-pattern': undefined,
    'no-descending-specificity': undefined,
    'string-quotes': 'single',
  },
}
