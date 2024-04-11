/* eslint-disable no-console */
import chalk from 'chalk'

const log = console.log

export const logger = {
  divider: () => log('----------------------------------------'),
  eot: () => log(),
  brand: (message: string) => log(chalk.bold.hex('#1e90ff')(message)),
  log: (message: string | string[]) => log(message),
  success: (message: string | string[]) => log(chalk.green(message)),
  error: (message: string, error?: unknown) => log(chalk.red(message, error)),
}
