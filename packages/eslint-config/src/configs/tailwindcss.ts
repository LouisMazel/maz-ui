import type { Linter } from 'eslint'
import type { BaseFontSizeSource, MazTailwindcssOptions, TailwindcssPreset } from '../types'
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

const DEFAULT_BASE_FONT_SIZE = 16

/** Root font size in pixels, from a number, a CSS size (`'13px'`) or a preset (`foundation['base-font-size']`). */
export function resolveBaseFontSize(value: number | string | BaseFontSizeSource | undefined): number {
  if (value === undefined) {
    return DEFAULT_BASE_FONT_SIZE
  }
  const raw = typeof value === 'object'
    ? value.foundation?.['base-font-size']
    : value
  const size = typeof raw === 'number'
    ? raw
    : /^\s*(\d+(?:\.\d+)?)(?:px)?\s*$/.exec(raw ?? '')?.[1]
  const pixels = Number(size)
  if (!size || !Number.isFinite(pixels) || pixels <= 0) {
    throw new Error(`[@maz-ui/eslint-config] noArbitraryPx.baseFontSize must be a number of pixels, a size in px ('13px') or a preset with a 'base-font-size' in px, received ${JSON.stringify(raw ?? value)}`)
  }
  return pixels
}

function resolveNoArbitraryPx(setting: MazTailwindcssOptions['noArbitraryPx']): NoArbitraryPxResolved {
  if (setting === false) {
    return {
      severity: 'off',
      options: { baseFontSize: 16, unit: 'rem' },
    }
  }
  if (setting === undefined || setting === true) {
    return {
      severity: 'error',
      options: { baseFontSize: 16, unit: 'rem' },
    }
  }
  return {
    severity: setting.severity ?? 'error',
    options: {
      baseFontSize: resolveBaseFontSize(setting.baseFontSize),
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

  return [
    {
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
        'better-tailwindcss/no-concatenated-classes': 'off',
        'maz/tailwind-no-arbitrary-px': [noArbitraryPx.severity, noArbitraryPx.options],
      },
    },
  ]
}
