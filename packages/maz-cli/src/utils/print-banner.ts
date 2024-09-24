import clear from 'clear'
import { blueBright, bold } from 'colorette'
import figlet from 'figlet'
import { logger } from './logger'

export function clearAndPrintBanner(_clear?: boolean): void {
  if (_clear) {
    clear()
  }

  logger.message(bold(blueBright(figlet.textSync('maz', { horizontalLayout: 'full' }))))
}
