import type { Linter } from 'eslint'
import type { MazTailwindcssOptions, TailwindcssPreset } from '../types'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

const TAILWINDCSS_FILES = ['**/*.{js,jsx,cjs,mjs,ts,mts,cts,tsx,vue,html,svelte,astro,astrojs,css,scss}']

/**
 * Files where Tailwind classes commonly live. Exposed for users who want to
 * compose their own config.
 */
export const TAILWINDCSS_DEFAULT_FILES = TAILWINDCSS_FILES

/**
 * Build the flat-config block(s) that wire up
 * `eslint-plugin-better-tailwindcss`. The plugin already ships preset
 * objects with `plugins` + `rules`; we spread them and add `files` plus
 * `settings['better-tailwindcss']` so the user's options reach the plugin.
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

  return [{
    ...presetConfig,
    files: TAILWINDCSS_FILES,
    settings: {
      'better-tailwindcss': tailwindSettings,
    },
    rules: {
      ...presetConfig.rules,
      'better-tailwindcss/no-unknown-classes': 'off',
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
    },
  }]
}
