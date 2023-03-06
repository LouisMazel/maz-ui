import chalk from 'chalk'
import { Command } from 'commander'
import { clearAndPrintBanner } from './utils/print-banner'
import { version } from '../package.json'
import { createFilesCommand } from './commands/create-files'
import { generateComponentsDocumentationCommand } from './commands/generate-components-docs'

const name = 'maz-cli'
const program = new Command()

const options = program.opts()

if (!options.silent) {
  clearAndPrintBanner()
}

program.version(`${name} ${version}`).usage('<command> [options]')

program.arguments('[command]').action((cmd) => {
  program.outputHelp()
  if (cmd) {
    console.log()
    console.log(chalk.red(`⛔️ Unknown command ${chalk.bold.keyword('dodgerblue')(cmd)}.`))
    console.log()
  }
})

program.option('-s, --silent', 'Disable CLI banner log', false)

program.on('--help', () => {
  console.log()
  console.log(
    `  Run ${chalk.bold.keyword('dodgerblue')(
      `${name} <command> --help`,
    )} for detailed usage of given command.`,
  )
  console.log()
})

program.addCommand(createFilesCommand())
program.addCommand(generateComponentsDocumentationCommand())

program.parse(process.argv)
