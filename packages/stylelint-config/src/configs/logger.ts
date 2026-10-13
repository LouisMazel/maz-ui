import { createConsola } from 'consola'

/**
 * Mirror of `@maz-ui/node`'s LogLevel — kept inline here to avoid making this
 * preset depend on `@maz-ui/node`, which would create a build cycle (the
 * `eslint.config.ts` of `@maz-ui/node` imports `@maz-ui/eslint-config`, which
 * itself depends on `@maz-ui/node` for the same logger). Direct usage of
 * `consola` keeps the dependency graph acyclic.
 */
export type LogLevel = 'silent' | 'error' | 'warning' | 'normal' | 'default' | 'debug' | 'trace' | 'verbose'

const LEVELS: Record<LogLevel, number> = {
  silent: Number.NEGATIVE_INFINITY,
  error: 0,
  warning: 1,
  normal: 2,
  default: 3,
  debug: 4,
  trace: 5,
  verbose: Number.POSITIVE_INFINITY,
}

interface BoxOptions {
  title: string
  message: string
  style?: { borderColor?: string, padding?: number }
}

export interface Logger {
  setLevel: (level: LogLevel) => void
  info: (message: string) => void
  debug: (message: string) => void
  verbose: (message: string) => void
  box: (options: BoxOptions) => void
}

export function createLogger(): Logger {
  const consola = createConsola()
  return {
    setLevel: (level) => {
      consola.level = LEVELS[level]
    },
    info: msg => consola.info(msg),
    debug: msg => consola.debug(msg),
    verbose: msg => consola.verbose(msg),
    box: opts => consola.box(opts),
  }
}
