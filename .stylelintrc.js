module.exports = {
  extends: 'stylelint-config-standard',
  plugins: [
    'stylelint-scss',
    'stylelint-order'
  ],
  rules: {
    'color-hex-case': 'upper',
    'string-quotes': 'single',
    'no-empty-source': null,
    'unit-case': 'lower',
    'property-case': 'lower',
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'at-rule-no-unknown': null,
    'order/order': [
      'custom-properties',
      'declarations'
    ],
    'no-descending-specificity': null,
    'indentation': 2,
    'no-duplicate-selectors': true,
    'color-hex-length': 'short',
    'color-named': 'always-where-possible',
    'selector-combinator-space-after': 'always',
    'selector-attribute-quotes': 'always',
    'selector-attribute-operator-space-before': 'never',
    'selector-attribute-operator-space-after': 'always',
    'selector-attribute-brackets-space-inside': 'never',
    'declaration-block-trailing-semicolon': 'always',
    'declaration-colon-space-before': 'never',
    'declaration-colon-space-after': 'always',
    'number-leading-zero': 'never',
    'function-url-quotes': 'always',
    'font-family-name-quotes': 'always-where-recommended',
    'comment-whitespace-inside': 'always',
    'comment-empty-line-before': 'always',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'media-feature-range-operator-space-before': 'always',
    'media-feature-range-operator-space-after': 'always',
    'media-feature-parentheses-space-inside': 'never',
    'media-feature-colon-space-after': 'always'
  }
}
