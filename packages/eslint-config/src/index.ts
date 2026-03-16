import type { MazESLintConfig, MazESLintOptions, MazESLintUserConfig } from './types'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

import { join } from 'node:path'
import antfu from '@antfu/eslint-config'
import { configs as sonarConfigs } from 'eslint-plugin-sonarjs'

import tailwind from 'eslint-plugin-tailwindcss'
import vueA11y from 'eslint-plugin-vuejs-accessibility'
import { baseRules } from './configs/base'
import { GLOBAL_IGNORES } from './configs/global'
import { markdown } from './configs/markdown'
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
  unicorn: true,
  ignores: GLOBAL_IGNORES,
  rules: {},
}

function getPackageJson(): Record<string, any> | undefined {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'))
  }
  catch {
    return undefined
  }
}

function getEslintMajorVersion(): number {
  try {
    const _require = createRequire(import.meta.url)
    const eslintPkg = _require('eslint/package.json')
    return Number(eslintPkg.version.split('.')[0])
  }
  catch {
    return 0
  }
}

function isVueOrNuxtProject(): boolean {
  const packageJson = getPackageJson()

  return packageJson?.dependencies?.vue || packageJson?.devDependencies?.vue || packageJson?.peerDependencies?.vue || packageJson?.dependencies?.nuxt || packageJson?.devDependencies?.nuxt || packageJson?.peerDependencies?.nuxt
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
export function defineConfig(options: MazESLintOptions = {}, ...userConfigs: MazESLintUserConfig[]): MazESLintConfig {
  const opts = { ...defaultOptions, ...options, ignores: [...GLOBAL_IGNORES, ...(options.ignores || [])] }

  const env = opts.env || process.env.NODE_ENV || 'production'
  const additionalConfigs: MazESLintUserConfig[] = []

  if (opts.vue || isVueOrNuxtProject()) {
    additionalConfigs.push({
      files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}'],
      rules: vueRules,
    })
  }

  if (opts.sonarjs) {
    const sonarjsFiles = ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}']

    additionalConfigs.push({
      ...sonarConfigs.recommended,
      files: sonarjsFiles,
      rules: {
        ...sonarConfigs.recommended.rules,
        ...sonarjsRules,
      },
    })

    // Special rules for test files
    additionalConfigs.push({
      files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.js', '**/*.test.js'],
      rules: sonarjsTestRules,
    })
  }

  if (opts.vueAccessibility) {
    const vueA11yConfigs = vueA11y.configs['flat/recommended']
    const configsArray = Array.isArray(vueA11yConfigs) ? vueA11yConfigs : [vueA11yConfigs]

    /**
     * Should fix the issue with the globals.
     * @see https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility/issues/1269
     */
    const fixedConfigs = configsArray.map((config: any) => {
      if (config && config.languageOptions && config.languageOptions.globals) {
        const fixedGlobals = { ...config.languageOptions.globals }
        if ('AudioWorkletGlobalScope ' in fixedGlobals) {
          fixedGlobals.AudioWorkletGlobalScope = fixedGlobals['AudioWorkletGlobalScope ']
          delete fixedGlobals['AudioWorkletGlobalScope ']
        }

        return {
          ...config,
          languageOptions: {
            ...config.languageOptions,
            globals: fixedGlobals,
          },
        }
      }
      return config
    })

    additionalConfigs.push(...fixedConfigs)
  }

  if (opts.tailwindcss) {
    // eslint-plugin-tailwindcss uses the removed `context.getSourceCode()` API and is incompatible with ESLint 10+
    // @see https://github.com/francoismassart/eslint-plugin-tailwindcss/issues
    if (getEslintMajorVersion() >= 10) {
      console.warn('[maz-eslint-config] eslint-plugin-tailwindcss is not compatible with ESLint 10+ (uses removed context.getSourceCode API). Tailwind CSS rules are disabled.')
    }
    else {
      // @ts-expect-error - tailwind.configs['flat/recommended'] is not typed correctly
      additionalConfigs.push(...tailwind.configs['flat/recommended'])
      additionalConfigs.push({
        rules: tailwindcssRules,
      })
    }
  }

  additionalConfigs.push({
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.js', '**/*.test.js'],
    rules: testRules,
  })

  return antfu({
    formatters: opts.formatters,
    ...opts,
    rules: {
      ...baseRules(env === 'production'),
      ...opts.rules,
    },
    ignores: (() => {
      return opts.ignores
    }) as any,
  }, ...additionalConfigs, ...userConfigs, markdown) as MazESLintConfig
}

// Export types
export type { MazESLintConfig, MazESLintOptions }

// Export individual configs for advanced usage
export { baseRules, sonarjsRules, sonarjsTestRules, tailwindcssRules, vueRules }
