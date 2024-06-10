import { antfu } from '@antfu/eslint-config'
import sonarjs from 'eslint-plugin-sonarjs'

export default antfu(
  {
    formatters: true,
    vue: true,
    typescript: true,
    ignores: ['components_tmp/**/*'],
    rules: {
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
      'n/prefer-global/process': 'off',
      'no-console': 'off',
    },
  },
  sonarjs.configs.recommended,
)
