import { logger } from '@maz-ui/utils/src/helpers/logger.ts'
import clear from 'clear'
import figlet from 'figlet'

export function clearAndPrintBanner(_clear?: boolean): void {
  if (_clear) {
    clear()
  }

  logger.brand((figlet.textSync('maz-ui', { horizontalLayout: 'full', font: 'Standard', verticalLayout: 'full' })))
}
