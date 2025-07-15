import type { antfu, OptionsConfig, Rules, TypedFlatConfigItem } from '@antfu/eslint-config'
import type { Linter } from 'eslint'

export type MazESLintUserConfig = TypedFlatConfigItem | TypedFlatConfigItem[] | Linter.Config | Linter.Config[]

export interface MazESLintOptions extends OptionsConfig {
  /**
   * Enable Tailwind CSS support
   * @default true
   */
  tailwindcss?: boolean

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
}

export type MazESLintConfig = ReturnType<typeof antfu>
