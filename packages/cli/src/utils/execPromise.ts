import { exec } from 'node:child_process'
import { logger } from './logger'

export async function execPromise(command: string): Promise<{ stdout: string, stderr: string }> {
  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line sonarjs/os-command
    exec(command, (error, stdout, stderr) => {
      if (stdout) {
        logger.log(`🟡 [cli](${command}):`, stdout)
      }

      if (stderr) {
        logger.warn(`🟡 [cli](${command}):`, stderr)
      }

      if (error) {
        logger.error(`🔴 [cli](${command}) Execution failed - ${error.message}.`, error)
        reject(error)
      }
      else {
        logger.success(`🟢 [cli](${command}) Execution success`)
        resolve({ stdout, stderr })
      }
    })
  })
}
