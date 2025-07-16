/* eslint-disable no-console */
import { getErrorMessage } from '@maz-ui/utils/helpers/getErrorMessage'
import { blueBright, green, red, yellow } from 'colorette'

const log = console.log

export const logger = {
  divider: () => log('----------------------------------------'),
  eot: () => log(),
  brand: (message: string) => log(blueBright(message)),
  log: (...message: unknown[]) => log(...message),
  success: (...message: string[]) => log(...message.map(m => green(m))),
  error: (message: string, error?: unknown) => {
    const errorMessage = error ? getErrorMessage(error) : ''
    log(red(message), errorMessage ? red(errorMessage) : '')
  },
  warn: (message: string, error?: unknown) => {
    const errorMessage = error ? getErrorMessage(error) : ''
    log(yellow(message), errorMessage ? yellow(errorMessage) : '')
  },
}

export type Logger = typeof logger
