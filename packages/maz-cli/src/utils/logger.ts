/* eslint-disable no-console */
import { green, red, yellow } from 'colorette'

export const logger = {
  message: (message: string) => {
    console.log()
    console.log(message)
    console.log()
  },
  eol: () => {
    console.log()
  },
  success: (message: string) => {
    console.log()
    console.log(green(message))
    console.log()
  },
  warn: (message: string, error?: any) => {
    console.log()
    console.warn(yellow(message), error ? yellow(error?.message ?? error) : '')
    console.log()
  },
  error: (message: string, error?: any) => {
    console.log()
    console.error(red(message), error ? red(error?.message ?? error) : '')
    console.log()
  },
}
