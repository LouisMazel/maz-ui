import { exec } from 'node:child_process'
import { logger } from './logger'

export async function execPromise(command: string): Promise<{ stdout: string; stderr: string }> {
  return await new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`🔴 [cli](${command}) Execution failed - ${error.message}.`, error)
        reject(error)
      } else {
        logger.success(`🟢 [cli](${command}) Execution success`)
        resolve({ stdout, stderr })
      }
    })
  })
}
