import clear from 'clear'
import figlet from 'figlet'
import { createRequire } from 'node:module'
import { logger } from '../../../lib/build/utils/logger'

const nodeRequire = createRequire(import.meta.url)

const { version } = nodeRequire('../../package.json')

export function clearAndPrintBanner() {
  clear()
  logger.brand(figlet.textSync('cli', { horizontalLayout: 'full' }))
  logger.eot()
  logger.brand(`cli v${version}`)
  logger.eot()
  logger.divider()
  logger.eot()
}
