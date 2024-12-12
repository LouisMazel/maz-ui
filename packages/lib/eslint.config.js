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
    ignores: ['src/components_tmp/**/*'],
  },
  ...vueA11y.configs['flat/recommended'],
  ...tailwind.configs['flat/recommended'],
  sonarjs.configs.recommended,
  {
    rules: {
      ...sonarjs.configs.recommended.rules,
      'tailwindcss/no-custom-classname': 'off',
      'node/prefer-global/process': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'prefer-regex-literals': 'off',
      'sonarjs/class-name': 'off',
      'sonarjs/no-vue-bypass-sanitization': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/sonar-no-unused-vars': 'off',
      'require-await': 'error',
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-hardcoded-credentials': 'off',
    },
  },
)
