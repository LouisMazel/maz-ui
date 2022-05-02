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
      { ignoreAtRules: ['screen', 'layer', 'tailwind'] },
    ],
    'selector-class-pattern': null,
  },
}
