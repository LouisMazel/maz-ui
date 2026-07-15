import type { Linter } from 'eslint'
import type { MazTailwindcssOptions, TailwindcssPreset } from '../types'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'
import { mazPlugin } from '../plugin'

const TAILWINDCSS_FILES = ['**/*.{js,jsx,cjs,mjs,ts,mts,cts,tsx,vue,html,svelte,astro,astrojs,css,scss}']

/**
 * Files where Tailwind classes commonly live. Exposed for users who want to
 * compose their own config.
 */
export const TAILWINDCSS_DEFAULT_FILES = TAILWINDCSS_FILES

interface NoArbitraryPxResolved {
  severity: 'off' | 'warn' | 'error'
  options: { baseFontSize: number, unit: 'rem' | 'em' }
}

function resolveNoArbitraryPx(setting: MazTailwindcssOptions['noArbitraryPx']): NoArbitraryPxResolved {
  if (setting === false)
    return { severity: 'off', options: { baseFontSize: 16, unit: 'rem' } }
  if (setting === undefined || setting === true) {
    return { severity: 'error', options: { baseFontSize: 16, unit: 'rem' } }
  }
  return {
    severity: setting.severity ?? 'error',
    options: {
      baseFontSize: setting.baseFontSize ?? 16,
      unit: setting.unit ?? 'rem',
    },
  }
}

/**
 * Build the flat-config block(s) that wire up
 * `eslint-plugin-better-tailwindcss` AND the custom `maz/tailwind-*`
 * rules shipped by this package. The plugin already ships preset
 * objects with `plugins` + `rules`; we spread them and add `files` plus
 * `settings['better-tailwindcss']` so the user's options reach the
 * plugin.
 */
export function tailwindcssConfigs(
  preset: TailwindcssPreset,
  settings: MazTailwindcssOptions,
): Linter.Config[] {
  const presetConfig = betterTailwindcss.configs[preset]

  const tailwindSettings: Record<string, unknown> = {}
  if (settings.entryPoint)
    tailwindSettings.entryPoint = settings.entryPoint
  if (settings.tailwindConfig)
    tailwindSettings.tailwindConfig = settings.tailwindConfig
  if (settings.detectComponentClasses !== undefined)
    tailwindSettings.detectComponentClasses = settings.detectComponentClasses
  if (settings.cwd)
    tailwindSettings.cwd = settings.cwd
  if (settings.tsconfig)
    tailwindSettings.tsconfig = settings.tsconfig

  const noArbitraryPx = resolveNoArbitraryPx(settings.noArbitraryPx)

  return [{
    ...presetConfig,
    files: TAILWINDCSS_FILES,
    plugins: {
      ...presetConfig.plugins,
      maz: mazPlugin,
    },
    settings: {
      'better-tailwindcss': tailwindSettings,
    },
    rules: {
      ...presetConfig.rules,
      'better-tailwindcss/no-unknown-classes': 'off',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'maz/tailwind-no-arbitrary-px': [noArbitraryPx.severity, noArbitraryPx.options],
    },
  }]
}
