import type { LogLevel } from './logger.js'
import { exec } from 'node:child_process'
import { logger as defaultLogger } from './logger.js'
import { redactError, redactSecrets } from './redactSecrets.js'

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
    timeout,
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
    /**
     * Maximum time in milliseconds the command is allowed to run before it is
     * killed and the promise rejects. No timeout by default.
     */
    timeout?: number
  } = {},
): Promise<{ stdout: string, stderr: string }> {
  if (logLevel) {
    defaultLogger.setLevel(logLevel)
  }

  const internalLogger = logger ?? defaultLogger
  const packageNameStr = packageName ? `[${packageName}]: ` : ''

  const safeCommand = redactSecrets(command)

  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line sonarjs/os-command
    exec(command, { cwd, timeout }, (error, stdout, stderr) => {
      if (stdout) {
        internalLogger.debug(`${safeCommand} - stdout output:`, redactSecrets(stdout))
      }

      if (stderr) {
        internalLogger.debug(`${safeCommand} - stderr output:`, redactSecrets(stderr))
      }

      if (stdout && !noStdout) {
        internalLogger.log(`${packageNameStr}stdout -`, redactSecrets(stdout.trim()))
      }

      if (stderr && !noStderr) {
        internalLogger.log(`${packageNameStr}stderr -`, redactSecrets(stderr.trim()))
      }

      if (error) {
        const safeError = redactError(error)
        if (!noError) {
          const reason = error.killed && timeout ? `timed out after ${timeout}ms` : 'failed'
          internalLogger.error(`${packageNameStr}${safeCommand} ${reason}`, safeError)
        }
        reject(safeError)
      }
      else {
        if (!noSuccess) {
          internalLogger.info(`${packageNameStr}${safeCommand} - Success!`)
        }
        resolve({ stdout, stderr })
      }
    })
  })
}
