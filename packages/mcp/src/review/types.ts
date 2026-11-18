import type { Knowledge } from '../knowledge/load'

export type Severity = 'error' | 'warning' | 'info'

export const SEVERITY_ORDER: Record<Severity, number> = { error: 0, warning: 1, info: 2 }

export type RuleId
  = | 'unknown-component'
    | 'unknown-prop'
    | 'invalid-prop-value'
    | 'boolean-prop-string'
    | 'unknown-model'
    | 'unknown-event'
    | 'unknown-slot'
    | 'unknown-icon'
    | 'unregistered-icon-names'
    | 'prefer-maz-component'
    | 'inline-svg'
    | 'icon-button-label'
    | 'internal-prefix'
    | 'theme-colors'
    | 'hardcoded-color'
    | 'tailwind-v3'
    | 'root-import'
    | 'internal-import'
    | 'prefer-ecosystem'
    | 'manual-dark-mode'
    | 'prefer-utils'
    | 'nuxt-auto-import'
    | 'missing-reference'
    | 'pale-brand-color'
    | 'type-scale'
    | 'arbitrary-font-size'
    | 'multiple-primary-actions'
    | 'raw-icon-tag'

export interface Finding {
  rule: RuleId
  severity: Severity
  message: string
  line: number
  column: number
  /** Concrete fix */
  suggestion?: string
}

export type Framework = 'vue' | 'nuxt'

export interface IconNames {
  /** The names an `icon` prop accepts: the icons of maz-ui and of the project (`x-mark`, `app:hero`) */
  names: ReadonlySet<string>
  /** `MazUi()` of @maz-ui/vite-plugin or @maz-ui/nuxt registers the names: without it, a name renders the fallback */
  registered: boolean
}

export interface ReviewOptions {
  knowledge: Knowledge
  /** Used to pick the parser (`.vue`, `.ts`, `.css`...) */
  filename?: string
  /** `nuxt` reports explicit imports of auto-imported components and composables */
  framework?: Framework
  /** The icon names of the project, the ones of maz-ui by default */
  icons?: IconNames
}

export interface ReviewContext extends ReviewOptions {
  report: (finding: Omit<Finding, 'line' | 'column'>, offset: number) => void
  /** Components imported by the SFC: local name -> maz-ui name, `undefined` for the components of the project */
  localComponents?: Map<string, string | undefined>
  /** Icons imported as SVG strings from `@maz-ui/icons/raw`: local names */
  rawIcons?: Set<string>
  /** The names of `icons`, or of maz-ui */
  iconNames?: ReadonlySet<string>
  /** `unregistered-icon-names` is reported once per file */
  reportedUnregisteredIcons?: boolean
}
