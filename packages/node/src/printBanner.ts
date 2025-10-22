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
  }
}) {
  options = {
    horizontalLayout: 'full',
    font: 'ANSI Shadow',
    clear: true,
    ...options,
  }
  if (options.clear)
    process.stdout.write('\x1B[2J')

  const banner = figlet.textSync(name, options)
  logger.brand(banner)

  if (version) {
    logger.brand(version)
    logger.eot()
  }

  logger.divider()
  logger.eot()
}
