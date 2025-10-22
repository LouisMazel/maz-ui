import type { LogLevel } from './logger.js'
import { exec } from 'node:child_process'
import { logger as defaultLogger } from './logger.js'

interface CustomLogger {
  log: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
}

export async function execPromise(
  command: string,
  {
    logger,
    packageName,
    noSuccess = false,
    noStdout = false,
    noStderr = false,
    silent = false,
    logLevel = 'default',
  }: {
    logger?: CustomLogger
    packageName?: string
    noSuccess?: boolean
    noStdout?: boolean
    noStderr?: boolean
    silent?: boolean
    logLevel?: LogLevel
  } = {},
): Promise<{ stdout: string, stderr: string }> {
  if (logLevel) {
    defaultLogger.setLevel(logLevel)
  }

  const internalLogger = logger ?? defaultLogger
  const packageNameStr = packageName ? `[${packageName}]: ` : ''

  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line sonarjs/os-command
    exec(command, (error, stdout, stderr) => {
      internalLogger.debug(`${command} stdout output:`, stdout)
      internalLogger.debug(`${command} stderr output:`, stderr)

      if (stdout && !noStdout && !silent) {
        internalLogger.log(`${packageNameStr}stdout -`, stdout.trim())
      }

      if (stderr && !noStderr && !silent) {
        internalLogger.log(`${packageNameStr}stderr -`, stderr.trim())
      }

      if (error) {
        internalLogger.error(`${packageNameStr}${command} failed`, error)
        reject(error)
      }
      else {
        if (!noSuccess && !silent) {
          internalLogger.info(`${packageNameStr}${command} success`)
        }
        resolve({ stdout, stderr })
      }
    })
  })
}
