/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ['node_modules/**/*', 'dist/**/*'],

  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-tailwindcss',
  ],

  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
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
