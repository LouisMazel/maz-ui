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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (message: string, error?: any) => {
    console.log()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.warn(yellow(message), error ? yellow(error?.message ?? error) : '')
    console.log()
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: string, error?: any) => {
    console.log()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.error(red(message), error ? red(error?.message ?? error) : '')
    console.log()
  },
}
