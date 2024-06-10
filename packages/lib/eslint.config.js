// @ts-check

import antfu from '@antfu/eslint-config'
import vueA11y from 'eslint-plugin-vuejs-accessibility'
import tailwind from 'eslint-plugin-tailwindcss'
import sonarjs from 'eslint-plugin-sonarjs'

export default antfu(
  {
    formatters: true,
    vue: true,
    rules: {
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
    },
  },
  {
    ignores: ['components_tmp/**/*'],
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
