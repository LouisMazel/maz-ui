import type { Logger } from './logger'
import { exec } from 'node:child_process'
import { logger as defaultLogger } from './logger'

export async function execPromise(command: string, logger?: Logger): Promise<{ stdout: string, stderr: string }> {
  const internalLogger = logger ?? defaultLogger
  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line sonarjs/os-command
    exec(command, (error, stdout, stderr) => {
      if (stdout) {
        internalLogger.log(`🟡 [${command}]:`, stdout)
      }

      if (stderr) {
        internalLogger.warn(`🟡 [${command}]:`, stderr)
      }

      if (error) {
        internalLogger.error(`🔴 [${command}] Execution failed - ${error.message}.`, error.message)
        reject(error)
      }
      else {
        internalLogger.success(`🟢 [${command}] Execution success`)
        resolve({ stdout, stderr })
      }
    })
  })
}
