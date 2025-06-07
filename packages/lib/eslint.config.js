// @ts-check

import antfu from '@antfu/eslint-config'
// import pluginOxlint from 'eslint-plugin-oxlint's
import sonarjs from 'eslint-plugin-sonarjs'
import tailwind from 'eslint-plugin-tailwindcss'
import vueA11y from 'eslint-plugin-vuejs-accessibility'

export default antfu(
  {
    formatters: true,
    vue: true,
    rules: {
      'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'warn'],
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
      'vue/no-undef-components': [
        'error',
        {
          ignorePatterns: ['RouterView', 'RouterLink'],
        },
      ],
    },
    ignores: ['**/*.md'],
  },
  ...vueA11y.configs['flat/recommended'],
  // ...pluginOxlint.configs['flat/recommended'],
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
