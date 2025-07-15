import type { Logger } from './logger.js'
import { exec } from 'node:child_process'
import { logger as defaultLogger } from './logger.js'

export async function execPromise(command: string, { logger, packageName, noSuccess, noStdout, noStderr }: { logger?: Logger, packageName?: string, noSuccess?: boolean, noStdout?: boolean, noStderr?: boolean } = {}): Promise<{ stdout: string, stderr: string }> {
  const internalLogger = logger ?? defaultLogger
  const packageNameStr = packageName ? `[${packageName}]` : ''

  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line sonarjs/os-command
    exec(command, (error, stdout, stderr) => {
      if (stdout && !noStdout) {
        internalLogger.log(`🟡 ${packageNameStr}(${command})`, stdout)
      }

      if (stderr && !noStderr) {
        internalLogger.warn(`🟡 ${packageNameStr}(${command})`, stderr)
      }

      if (error) {
        internalLogger.error(`🔴 ${packageNameStr}(${command}) Execution failed - ${error.message}.`, error.message)
        reject(error)
      }
      else {
        if (!noSuccess) {
          internalLogger.success(`🟢 ${packageNameStr}(${command}) Execution success`)
        }
        resolve({ stdout, stderr })
      }
    })
  })
}
