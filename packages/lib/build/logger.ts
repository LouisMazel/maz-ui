/* eslint-disable no-console */
import chalk from 'chalk'

const log = console.log

export const logger = {
  success: (message: string) => log(chalk.green(message)),
  error: (message: string, error: unknown) => log(chalk.red(message, error)),
}
