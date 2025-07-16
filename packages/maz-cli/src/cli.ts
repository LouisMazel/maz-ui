import { createRequire } from 'node:module'
import { logger } from '@maz-ui/node/index.ts'
import { bgRed, blueBright, bold, white } from 'colorette'

import { Command } from 'commander'

import { commands } from './commands'
import { clearAndPrintBanner } from './utils'

const nodeRequire = createRequire(import.meta.url)

const { version } = nodeRequire('../package.json')

const name = 'maz'
const program = new Command()

const argv = process.argv.slice(2)

const hasSilentOption = argv?.find(argument => ['-s', '--silent'].includes(argument))

if (!hasSilentOption) {
  clearAndPrintBanner(true)
}

program.option('-s --silent', 'Disable CLI banner log', false)

program.version(`${name} ${version}`).usage('<command> [options]')

program.arguments('[command]').action((cmd) => {
  program.outputHelp()
  if (cmd) {
    const info = bgRed(white(` ${cmd} `))
    logger.error(`⛔️ Unknown command ${info}`)
  }
})

program.on('--help', () => {
  logger.eot()
  const info = bold(blueBright(`${name} <command> --help`))
  logger.log(`  Run ${info} for detailed usage of given command`)
})

for (const command of commands) {
  program.addCommand(command())
}

program.parse()

export * from './define-config'
export * from './types'
