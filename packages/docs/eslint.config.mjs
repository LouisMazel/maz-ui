// @ts-check

import antfu from '@antfu/eslint-config'
import sonarjs from 'eslint-plugin-sonarjs'
import tailwind from 'eslint-plugin-tailwindcss'
import vueA11y from 'eslint-plugin-vuejs-accessibility'

export default antfu(
  {
    formatters: true,
    vue: true,
    rules: {
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
    },
  },
  {
    ignores: ['docs/**/*.md'],
  },
  ...vueA11y.configs['flat/recommended'],
  ...tailwind.configs['flat/recommended'],
  sonarjs.configs.recommended,
  {
    rules: {
      'tailwindcss/no-custom-classname': 'off',
      'node/prefer-global/process': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'prefer-regex-literals': 'off',
    },
  },
)
