import type { antfu, OptionsConfig, Rules, TypedFlatConfigItem } from '@antfu/eslint-config'
import type { Linter } from 'eslint'
import type { LogLevel } from './configs/logger'

export type MazESLintUserConfig = TypedFlatConfigItem | TypedFlatConfigItem[] | Linter.Config | Linter.Config[]

export type TailwindcssPreset = 'recommended' | 'stylistic' | 'correctness'

/**
 * Settings forwarded to `eslint-plugin-better-tailwindcss` under
 * `settings['better-tailwindcss']`. See the plugin docs for the canonical
 * meaning of each field.
 */
export interface MazTailwindcssOptions {
  /**
   * Which preset to load. Each one comes in `*-warn` and `*-error` flavors
   * (defaults match the plugin's defaults: stylistic→warn, correctness→error).
   *
   * @default 'recommended'
   */
  preset?: TailwindcssPreset

  /**
   * Tailwind v4: path to the CSS entry file (the one that does
   * `@import "tailwindcss"`, possibly with `prefix(...)`). Required for the
   * plugin to know about your prefix and `@theme` tokens.
   */
  entryPoint?: string

  /**
   * Tailwind v3: path to `tailwind.config.{js,ts,cjs,mjs}`. Use `entryPoint`
   * for v4 instead.
   */
  tailwindConfig?: string

  /**
   * Tailwind v4: enable detection of custom component classes (`@layer
   * components { … }`) so they are not reported as unknown.
   *
   * @default false
   */
  detectComponentClasses?: boolean

  /**
   * Working directory used to resolve `tailwindcss` and the config files
   * above. Useful in monorepos when ESLint runs from the repo root.
   */
  cwd?: string

  /**
   * Path to a `tsconfig.json` used to resolve `paths` aliases inside the
   * Tailwind config.
   */
  tsconfig?: string
}

export interface MazESLintOptions extends OptionsConfig {
  /**
   * Tailwind CSS support — wires `eslint-plugin-better-tailwindcss`.
   *
   * - `false` *(default)*: disabled.
   * - `true`: load the `'recommended'` preset with default settings.
   * - `'recommended' | 'stylistic' | 'correctness'`: pick a preset, default
   *   settings.
   * - `MazTailwindcssOptions`: pick a preset and pass settings (e.g.
   *   `entryPoint` so the plugin learns your v4 prefix).
   *
   * @default false
   */
  tailwindcss?: boolean | TailwindcssPreset | MazTailwindcssOptions

  /**
   * Enable SonarJS rules for code quality
   * @default true
   */
  sonarjs?: boolean

  /**
   * Enable Vue Accessibility plugin
   * @default false
   */
  vueAccessibility?: boolean

  /**
   * Environment (affects console warnings/errors)
   * @default 'development'
   */
  env?: 'development' | 'production'

  /**
   * Files to ignore
   * @default ['dist/**', 'node_modules/**']
   */
  ignores?: string[]

  /**
   * Additional rules to merge
   */
  rules?: Partial<Rules>

  /**
   * Verbosity of the logs emitted while resolving the config. Defaults to
   * `'default'` so the resolved-configuration box is shown when the preset
   * loads. Set to `'silent'` to hide it, or `'debug'` / `'verbose'` to dig
   * deeper.
   *
   * - `'silent'`: nothing is printed.
   * - `'default'` *(default)*: a titled box summarizing the resolved feature
   *   toggles.
   * - `'debug'`: also logs each plugin / preset / overrides addition.
   * - `'verbose'`: also logs the final shape (config block count, etc.).
   */
  logLevel?: LogLevel
}

export type MazESLintConfig = ReturnType<typeof antfu>
