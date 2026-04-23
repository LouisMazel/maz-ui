/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ['node_modules/**/*', '.DS_Store', '.nuxt/**/*', '.output/**/*'],

  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
  ],

  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'at-rule-no-unknown': [true, { ignoreAtRules: ['theme', 'utility', 'source', 'custom-variant', 'variant', 'reference', 'apply', 'layer', 'tailwind'] }],
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    // Tailwind v4 only parses the `prefix(...)` directive on the bare-string
    // form of @import; wrapping in url() swallows it and breaks the build.
    'import-notation': 'string',
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
