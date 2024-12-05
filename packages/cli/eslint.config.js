import { antfu } from '@antfu/eslint-config'
import sonarjs from 'eslint-plugin-sonarjs'

export default antfu(
  {
    formatters: true,
    typescript: true,
    rules: {
      'n/prefer-global/process': 'off',
      'no-console': 'off',
    },
  },
  sonarjs.configs.recommended,
  {
    rules: {
      ...sonarjs.configs.recommended.rules,
    },
  },
)
