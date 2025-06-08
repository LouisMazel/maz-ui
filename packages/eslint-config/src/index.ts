// @ts-check
import type { Rules } from '@antfu/eslint-config'
import type { MazESLintConfig, MazESLintOptions, MazESLintUserConfig } from './types'
import antfu from '@antfu/eslint-config'

import sonarjs from 'eslint-plugin-sonarjs'
import tailwind from 'eslint-plugin-tailwindcss'
import vueA11y from 'eslint-plugin-vuejs-accessibility'

import { baseRules } from './configs/base'
import { sonarjsRules, sonarjsTestRules } from './configs/sonarjs'
import { tailwindcssRules } from './configs/tailwindcss'
import { testRules } from './configs/test'
import { vueRules } from './configs/vue'

/**
 * Default configuration options
 */
const defaultOptions: MazESLintOptions = {
  formatters: true,
  typescript: true,
  sonarjs: true,
  tailwindcss: false,
  ignores: ['dist/**', 'node_modules/**'],
  rules: {},
}

/**
 * Create ESLint configuration for Maz-UI and JavaScript/TypeScript projects
 *
 * @param options Configuration options
 * @returns ESLint flat config array
 *
 * @example
 * ```js
 * import { defineConfig } from '@maz-ui/eslint-config'
 *
 * export default defineConfig({
 *   env: 'production',
 *   rules: {
 *     'no-console': 'error'
 *   }
 * })
 * ```
 */
export function defineConfig(options: MazESLintOptions = {}, ...userConfigs: MazESLintUserConfig[]): Promise<MazESLintConfig> {
  const opts = { ...defaultOptions, ...options }

  const env = opts.env || process.env.NODE_ENV || 'development'

  // Merge all rules
  let allRules: Partial<Rules> = {
    ...baseRules(env === 'production'),
    ...opts.rules,
  }

  if (opts.vue || opts.formatters) {
    allRules = {
      ...allRules,
      ...vueRules,
    }
  }

  const additionalConfigs: MazESLintUserConfig[] = []

  if (opts.sonarjs || opts.formatters) {
    additionalConfigs.push(sonarjs.configs.recommended)

    additionalConfigs.push({
      rules: {
        ...sonarjs.configs.recommended.rules,
      },
    })

    // Special rules for test files
    additionalConfigs.push({
      files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.js', '**/*.test.js'],
      rules: sonarjsTestRules,
    })
  }

  if (opts.vueAccessibility || opts.formatters) {
    additionalConfigs.push(vueA11y.configs['flat/recommended'])
  }

  if (opts.tailwindcss || opts.formatters) {
    // @ts-expect-error - tailwind.configs['flat/recommended'] is not typed correctly
    additionalConfigs.push(...tailwind.configs['flat/recommended'])
    additionalConfigs.push({
      rules: tailwindcssRules,
    })
  }

  additionalConfigs.push({
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.js', '**/*.test.js'],
    rules: testRules,
  })

  return antfu({
    formatters: opts.formatters,
    ...opts,
    rules: allRules,
  }, ...userConfigs, ...additionalConfigs)
}

// Export types
export type { MazESLintConfig, MazESLintOptions }

// Export individual configs for advanced usage
export { baseRules, sonarjsRules, sonarjsTestRules, tailwindcssRules, vueRules }
