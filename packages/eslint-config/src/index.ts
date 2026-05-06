import type { Logger } from './configs/logger'
import type { MazESLintConfig, MazESLintOptions, MazESLintUserConfig, MazTailwindcssOptions, TailwindcssPreset } from './types'
import { readFileSync } from 'node:fs'

import { join } from 'node:path'
import antfu from '@antfu/eslint-config'
import { configs as sonarConfigs } from 'eslint-plugin-sonarjs'

import vueA11y from 'eslint-plugin-vuejs-accessibility'
import { baseRules } from './configs/base'
import { GLOBAL_IGNORES } from './configs/global'
import { createLogger } from './configs/logger'
import { markdown } from './configs/markdown'
import { sonarjsRules, sonarjsTestRules } from './configs/sonarjs'
import { tailwindcssConfigs } from './configs/tailwindcss'
import { testRules } from './configs/test'
import { vueRules, vueSfcOnlyRules } from './configs/vue'

const TAG = '[@maz-ui/eslint-config]'

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

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

function getPackageJson(): PackageJson | undefined {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8')) as PackageJson
  }
  catch {
    return undefined
  }
}

function hasDependency(pkg: PackageJson | undefined, ...names: string[]): boolean {
  if (!pkg)
    return false
  const buckets = [pkg.dependencies, pkg.devDependencies, pkg.peerDependencies]
  return names.some(name => buckets.some(bucket => bucket && name in bucket))
}

type Source = 'explicit' | 'auto-detected' | 'default'

interface Resolution {
  typescript: boolean
  formatters: boolean
  unicorn: boolean
  sonarjs: boolean
  vue: boolean
  vueSource: Source
  vueAccessibility: boolean
  tailwindcss: { preset: TailwindcssPreset, settings: MazTailwindcssOptions } | false
  tailwindcssSource: Source
  env: 'development' | 'production'
}

function resolveVue(option: MazESLintOptions['vue']): { value: boolean, source: Source } {
  if (option === true)
    return { value: true, source: 'explicit' }
  if (option === false)
    return { value: false, source: 'explicit' }
  return { value: hasDependency(getPackageJson(), 'vue', 'nuxt'), source: 'auto-detected' }
}

function resolveTailwindcss(
  option: MazESLintOptions['tailwindcss'],
): { value: { preset: TailwindcssPreset, settings: MazTailwindcssOptions } | false, source: Source } {
  if (option === undefined)
    return { value: false, source: 'default' }
  if (option === false)
    return { value: false, source: 'explicit' }
  if (option === true)
    return { value: { preset: 'recommended', settings: {} }, source: 'explicit' }
  if (typeof option === 'string')
    return { value: { preset: option, settings: {} }, source: 'explicit' }
  return { value: { preset: option.preset ?? 'recommended', settings: option }, source: 'explicit' }
}

function resolveOptions(opts: MazESLintOptions, env: 'development' | 'production'): Resolution {
  const vue = resolveVue(opts.vue)
  const tailwind = resolveTailwindcss(opts.tailwindcss)
  return {
    typescript: opts.typescript !== false,
    formatters: opts.formatters !== false,
    unicorn: opts.unicorn !== false,
    sonarjs: opts.sonarjs !== false,
    vue: vue.value,
    vueSource: vue.source,
    vueAccessibility: opts.vueAccessibility === true,
    tailwindcss: tailwind.value,
    tailwindcssSource: tailwind.source,
    env,
  }
}

function formatSourceTag(source: Source): string {
  if (source === 'auto-detected')
    return ' (auto-detected)'
  if (source === 'default')
    return ' (default)'
  return ''
}

function formatResolutionBox(r: Resolution): string {
  const tailwindLabel = r.tailwindcss === false ? 'off' : r.tailwindcss.preset
  const rows: Array<[string, string]> = [
    ['typescript', String(r.typescript)],
    ['vue', `${r.vue}${formatSourceTag(r.vueSource)}`],
    ['vueAccessibility', String(r.vueAccessibility)],
    ['sonarjs', String(r.sonarjs)],
    ['tailwindcss', `${tailwindLabel}${formatSourceTag(r.tailwindcssSource)}`],
    ['formatters', String(r.formatters)],
    ['unicorn', String(r.unicorn)],
    ['env', r.env],
  ]
  const labelWidth = Math.max(...rows.map(([k]) => k.length))
  return rows.map(([k, v]) => `${k.padEnd(labelWidth)}  ${v}`).join('\n')
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
  const log: Logger = createLogger()
  // Auto-silence when stdout isn't a TTY (CI, pipes, JSON formatters, …) —
  // ESLint's JSON / SARIF output goes to stdout and would be corrupted by the
  // resolution box. Users keep full control via `logLevel`.
  const defaultLogLevel = process.stdout.isTTY ? 'default' : 'silent'
  log.setLevel(options.logLevel ?? defaultLogLevel)

  const opts = { ...defaultOptions, ...options, ignores: [...GLOBAL_IGNORES, ...(options.ignores || [])] }
  const env = (opts.env || process.env.NODE_ENV || 'production') as 'development' | 'production'
  const resolved = resolveOptions(opts, env)

  log.box({
    title: '@maz-ui/eslint-config',
    message: formatResolutionBox(resolved),
    style: { borderColor: 'cyan', padding: 1 },
  })

  const additionalConfigs: MazESLintUserConfig[] = []

  if (resolved.vue) {
    additionalConfigs.push({
      files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}'],
      rules: vueRules,
    })
    additionalConfigs.push({
      files: ['**/*.vue'],
      rules: vueSfcOnlyRules,
    })
    log.debug(`${TAG} Vue: applied vueRules to JS/TS/Vue files + SFC-only overrides to *.vue`)
  }

  if (resolved.sonarjs) {
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
    log.debug(`${TAG} SonarJS: applied recommended preset + ${Object.keys(sonarjsRules).length} extra rules + test-file relaxations`)
  }

  if (resolved.vueAccessibility) {
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
    log.debug(`${TAG} Vue a11y: applied ${fixedConfigs.length} flat-config block(s) from eslint-plugin-vuejs-accessibility`)
  }

  if (resolved.tailwindcss) {
    const blocks = tailwindcssConfigs(resolved.tailwindcss.preset, resolved.tailwindcss.settings) as MazESLintUserConfig[]
    additionalConfigs.push(...blocks)
    const settingKeys = Object.keys(resolved.tailwindcss.settings).filter(k => k !== 'preset')
    const settingsHint = settingKeys.length > 0 ? ` with settings (${settingKeys.join(', ')})` : ''
    log.debug(`${TAG} Tailwind: loaded "${resolved.tailwindcss.preset}" preset${settingsHint}`)
  }

  additionalConfigs.push({
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.spec.js', '**/*.test.js'],
    rules: testRules,
  })
  log.debug(`${TAG} Tests: relaxed rules applied to *.spec.{ts,js} / *.test.{ts,js}`)

  if (options.rules && Object.keys(options.rules).length > 0)
    log.debug(`${TAG} User: merged ${Object.keys(options.rules).length} rule override(s)`)
  if (userConfigs.length > 0)
    log.debug(`${TAG} User: appended ${userConfigs.length} flat-config argument(s)`)

  log.verbose(`${TAG} Final config block count: ${additionalConfigs.length + userConfigs.length + 1} (additional: ${additionalConfigs.length}, user: ${userConfigs.length}, +markdown)`)
  log.verbose(`${TAG} Ignore globs: ${opts.ignores.length}`)

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

// Export individual configs for advanced usage
export { baseRules } from './configs/base'

export { sonarjsRules, sonarjsTestRules } from './configs/sonarjs'
export { TAILWINDCSS_DEFAULT_FILES, tailwindcssConfigs } from './configs/tailwindcss'
export { vueRules, vueSfcOnlyRules } from './configs/vue'
// Export types
export type { MazESLintConfig, MazESLintOptions, MazTailwindcssOptions, TailwindcssPreset } from './types'
