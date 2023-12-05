import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import { createRequire } from 'node:module'

const nodeRequire = createRequire(import.meta.url)

const { version } = nodeRequire('../../package.json')

export function clearAndPrintBanner() {
  clear()
  console.log(
    chalk.bold.keyword('dodgerblue')(figlet.textSync('cli', { horizontalLayout: 'full' })),
  )
  console.log()
  console.log(chalk.bold.keyword('dodgerblue')(`cli v${version}`))
  console.log()
}
