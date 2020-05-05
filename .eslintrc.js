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
    "@vue/prettier",
    "prettier/vue"
  ],
  plugins: ["vue"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    // ESLINT RULES
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "arrow-parens": 0,
    semi: ["error", "never"],
    quotes: ["error", "single"],
    "func-style": "error",
    "max-len": [
      "warn",
      {
        code: 200
      }
    ],
    "no-unused-vars": ["error"],
    "no-undef": ["error", { typeof: true }],
    "no-loop-func": "warn",
    indent: ['error', 2, {
      ignoredNodes: ['TemplateLiteral']
    }],
    'template-curly-spacing': 'off',
    // 'template-curly-spacing': 'off',
    // PRETTIER RULES
    "prettier/prettier": {
      tabWidth: 2,
      singleQuote: true,
      trailingComma: "none",
      semi: false
    },
    // VUE RULES
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 1,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "any"
        }
      }
    ],
    "vue/html-indent": ["error", 2, {
      baseIndent: 1,
    }],
    "vue/script-indent": ["error", 2, { baseIndent: 1 }],
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "vue/attributes-order": "error",
    "vue/no-confusing-v-for-v-if": "error",
    "vue/no-v-html": "error",
    "vue/order-in-components": "error",
    "vue/this-in-template": "error",
    "vue/script-indent": "error"
  }
};

// 'generator-star-spacing': 0,
// 'arrow-parens': 0,
// 'prefer-const': 2,
// 'no-trailing-spaces': 'error',
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
