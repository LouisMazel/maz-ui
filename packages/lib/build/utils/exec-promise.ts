import { exec } from 'node:child_process'
import { logger } from '../utils/logger'

export function execPromise(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error('Execution failed', `${error} - ${stdout}`)
        reject(error)
      }
      else {
        logger.success(stdout)
        resolve({ stdout, stderr })
      }
    })
  })
}
