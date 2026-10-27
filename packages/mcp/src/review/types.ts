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
    | 'prefer-maz-component'
    | 'inline-svg'
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

export interface ReviewOptions {
  knowledge: Knowledge
  /** Used to pick the parser (`.vue`, `.ts`, `.css`...) */
  filename?: string
  /** `nuxt` reports explicit imports of auto-imported components and composables */
  framework?: Framework
}

export interface ReviewContext extends ReviewOptions {
  report: (finding: Omit<Finding, 'line' | 'column'>, offset: number) => void
}
