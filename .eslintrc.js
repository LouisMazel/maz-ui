module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "plugin:vue/strongly-recommended",
    "eslint:recommended",
    "@vue/prettier"
  ],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    semi: ["error", "never"],
    quotes: ["error", "single"],
    "vue/attributes-order": "error",
    "vue/no-confusing-v-for-v-if": "error",
    "vue/no-v-html": "error",
    "vue/order-in-components": "error",
    "vue/this-in-template": "error",
    "vue/script-indent": "error",
    "prettier/prettier": {
      tabWidth: 2,
      singleQuote: true,
      trailingComma: "none",
      semi: false
    },
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false
      }
    ],
    "func-style": "error",
    "no-param-reassign": ["warn", { props: false }],
    "vue/script-indent": ["error", 2, { baseIndent: 0 }],
    "vue/component-name-in-template-casing": ['error', 'PascalCase']
  }
};

// 'generator-star-spacing': 0,
// 'arrow-parens': 0,
// 'prefer-const': 2,
// 'no-trailing-spaces': 'error',
// 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
// 'no-extra-semi': 'error',
// 'semi': ['error', 'never'],
// 'no-var': 'error',
// 'vue/attributes-order': 'error',
// 'vue/no-confusing-v-for-v-if': 'error',
// 'vue/no-v-html': 'error',
// 'vue/order-in-components': 'error',
// 'vue/this-in-template': 'error',
// 'vue/script-indent': 'error',
// 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
// 'no-unused-vars': [
//   'error',
//   {
//     vars: 'all',
//     args: 'after-used',
//     ignoreRestSiblings: false
//   }
// ],
// 'func-style': 'error',
// 'no-param-reassign': [
//   'warn',
//   { props: false }
// ],
// 'max-len': [
//   'warn',
//   {
//     code: 200
//   }
// ],
// 'no-undef': ['error', { typeof: true }],
// 'no-loop-func': 'warn',
// indent: ['error', 2, {
//   ignoredNodes: ['TemplateLiteral']
// }],
// 'template-curly-spacing': 'off'
// },
// overrides: [
//   {
//     files: ['*.vue'],
//     rules: {
//       indent: 'off',
//       'vue/script-indent': ['error', 2, { baseIndent: 1 }],
//       'vue/component-name-in-template-casing': ['error', 'PascalCase']
//     }
//   }
// ]
