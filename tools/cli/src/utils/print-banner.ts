import { createRequire } from 'node:module'
import { logger } from '@maz-ui/node'
import clear from 'clear'
import figlet from 'figlet'

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
