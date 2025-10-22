/* eslint-disable no-console */
import type { ConsolaInstance, ConsolaOptions, ConsolaReporter, InputLogObject } from 'consola'
import process from 'node:process'
import { blueBright } from 'colorette'
import { createConsola } from 'consola'

const LogLevelMap = {
  silent: Number.NEGATIVE_INFINITY,
  error: 0,
  warning: 1,
  normal: 2,
  default: 3,
  debug: 4,
  trace: 5,
  verbose: Number.POSITIVE_INFINITY,
} satisfies Record<string, number>

export function createLogger(options?: LoggerOptions) {
  const consola = createConsola({
    ...options,
    level: options?.level ?? LogLevelMap.default,
  }) as ConsolaInstance

  return {
    start: (message: InputLogObject | any, ...args: any[]) => consola.start(message, ...args),
    log: (message: InputLogObject | any, ...args: any[]) => consola.log(message, ...args),
    warn: (message: InputLogObject | any, ...args: any[]) => consola.warn(message, ...args),
    error: (message: InputLogObject | any, ...args: any[]) => consola.error(message, ...args),
    box: (message: InputLogObject | any, ...args: any[]) => consola.box(message, ...args),
    fail: (message: InputLogObject | any, ...args: any[]) => consola.fail(message, ...args),
    success: (message: InputLogObject | any, ...args: any[]) => consola.success(message, ...args),
    info: (message: InputLogObject | any, ...args: any[]) => consola.info(message, ...args),
    debug: (message: InputLogObject | any, ...args: any[]) => consola.debug(message, ...args),
    trace: (message: InputLogObject | any, ...args: any[]) => consola.trace(message, ...args),
    verbose: (message: InputLogObject | any, ...args: any[]) => consola.verbose(message, ...args),
    fatal: (message: InputLogObject | any, ...args: any[]) => consola.fatal(message, ...args),
    ready: (message: InputLogObject | any, ...args: any[]) => consola.ready(message, ...args),
    silent: (message: InputLogObject | any, ...args: any[]) => consola.silent(message, ...args),
    divider: (character: string = '=') => console.log(character.repeat(process.stdout.columns ?? 20)),
    eot: () => console.log(),
    brand: (message: string) => console.log(blueBright(message)),
    clear: () => console.clear(),
    addReporter: (reporter: ConsolaReporter) => consola.addReporter(reporter),
    removeReporter: (reporter: ConsolaReporter) => consola.removeReporter(reporter),
    setLevel: (level: LogLevel) => {
      consola.level = LogLevelMap[level]
    },
    getLevel: () => consola.level,
  }
}

export const logger = createLogger() as Logger

export type { ConsolaOptions }
export type LoggerOptions = Partial<ConsolaOptions>
export type LogLevel = keyof typeof LogLevelMap
export type Logger = ReturnType<typeof createLogger>
