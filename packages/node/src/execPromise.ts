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
    noError = false,
    logLevel,
    cwd,
  }: {
    logger?: CustomLogger
    packageName?: string
    /**
     * Don't log success message
     */
    noSuccess?: boolean
    /**
     * Don't log stdout
     */
    noStdout?: boolean
    /**
     * Don't log stderr
     */
    noStderr?: boolean
    /**
     * Don't log error
     */
    noError?: boolean
    logLevel?: LogLevel
    cwd?: string
  } = {},
): Promise<{ stdout: string, stderr: string }> {
  if (logLevel) {
    defaultLogger.setLevel(logLevel)
  }

  const internalLogger = logger ?? defaultLogger
  const packageNameStr = packageName ? `[${packageName}]: ` : ''

  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line sonarjs/os-command
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (stdout) {
        internalLogger.debug(`${command} - stdout output:`, stdout)
      }

      if (stderr) {
        internalLogger.debug(`${command} - stderr output:`, stderr)
      }

      if (stdout && !noStdout) {
        internalLogger.log(`${packageNameStr}stdout -`, stdout.trim())
      }

      if (stderr && !noStderr) {
        internalLogger.log(`${packageNameStr}stderr -`, stderr.trim())
      }

      if (error) {
        if (!noError) {
          internalLogger.error(`${packageNameStr}${command} failed`, error)
        }
        reject(error)
      }
      else {
        if (!noSuccess) {
          internalLogger.info(`${packageNameStr}${command} - Success!`)
        }
        resolve({ stdout, stderr })
      }
    })
  })
}
