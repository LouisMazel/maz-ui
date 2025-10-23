import type { FigletOptions } from 'figlet/node'
import figlet from 'figlet'
import { logger } from './logger'

export function printBanner({
  name,
  version,
  options,
}: {
  name: string
  version?: string
  options?: FigletOptions & {
    clear?: boolean
    divider?: boolean
    breakBefore?: boolean
    breakAfter?: boolean
  }
}) {
  options = {
    horizontalLayout: 'full',
    font: 'ANSI Shadow',
    clear: true,
    breakBefore: true,
    breakAfter: true,
    ...options,
  }
  if (options.clear)
    process.stdout.write('\x1B[2J')

  if (options.breakBefore)
    logger.break()

  const banner = figlet.textSync(name, options)
  logger.brand(banner)

  if (version) {
    logger.brand(version)
    logger.break()
  }

  if (options.divider)
    logger.divider()

  if (options.breakAfter)
    logger.break()
}
