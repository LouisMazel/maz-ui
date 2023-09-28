import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import { version } from '../../package.json'

export const clearAndPrintBanner = (): void => {
  clear()
  console.log(
    chalk.bold.keyword('dodgerblue')(figlet.textSync('cli', { horizontalLayout: 'full' })),
  )
  console.log()
  console.log(chalk.bold.keyword('dodgerblue')(`cli v${version}`))
  console.log()
}
