import chalk from 'chalk'
import { exec } from 'node:child_process'

export async function execPromise(command: string): Promise<{ stdout: string; stderr: string }> {
  return await new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(chalk.red(`🔴 [cli](${command}) Execution failed - ${error.message}.`))
        reject(error)
      } else {
        console.log(chalk.green(`🟢 [cli](${command}) Execution success`))
        resolve({ stdout, stderr })
      }
    })
  })
}
