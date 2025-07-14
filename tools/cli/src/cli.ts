import { createRequire } from 'node:module'
import { logger } from '@maz-ui/utils/src/utils/logger.ts'

import chalk from 'chalk'
import { blueBright, bold } from 'colorette'
import { Command } from 'commander'
import { createFilesCommand } from './commands/create-files'
import { generateComponentsDocumentationCommand } from './commands/generate-components-docs'
import { clearAndPrintBanner } from './utils/print-banner'

const name = 'cli'
const program = new Command()
const nodeRequire = createRequire(import.meta.url)

const { version } = nodeRequire('../package.json')

const options = program.opts()

if (!options.silent) {
  clearAndPrintBanner()
}

program.version(`${name} ${version}`).usage('<command> [options]')

program.arguments('[command]').action((cmd) => {
  if (cmd) {
    logger.error(`⛔️ Unknown command ${chalk.bold.hex('#1e90ff')(cmd)}.`)
    logger.eot()
  }

  program.outputHelp()
})

program.option('-s, --silent', 'Disable CLI banner log', false)

program.on('--help', () => {
  logger.eot()
  const info = bold(blueBright(`${name} <command> --help`))
  logger.log(`  Run ${info} for detailed usage of given command`)

  logger.eot()
})

program.addCommand(createFilesCommand())
program.addCommand(generateComponentsDocumentationCommand())

program.parse(process.argv)
