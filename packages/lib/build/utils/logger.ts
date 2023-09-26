/* eslint-disable no-console */
import chalk from 'chalk'

const log = console.log

export const logger = {
  log: (message: string | string[]) => log(message),
  success: (message: string | string[]) => log(chalk.green(message)),
  error: (message: string, error: unknown) => log(chalk.red(message, error)),
}
