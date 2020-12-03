#!/usr/bin/env node

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const path = require('path')
const { Command } = require('commander')

const VERSION = require('../package').version
const NAME = require('../package').name
const generateRootCss = require('./lib/index.js')

const program = new Command()

clear()
console.log(
  chalk.bold.keyword('dodgerblue')(
    figlet.textSync(NAME, { horizontalLayout: 'full' })
  )
)
console.log()
console.log(chalk.bold.keyword('dodgerblue')(`${NAME} v${VERSION}`))
console.log()

program
  .version(`${NAME} ${VERSION}`)
  .usage('<command> [options]')

program
  .arguments('[command]')
  .action((cmd) => {
    program.outputHelp()
    if (cmd) {
      console.log()
      console.log(
        chalk.red(`  ⛔️ Unknown command ${chalk.bold.keyword('dodgerblue')(cmd)}.`)
      )
      console.log()
    }
  })

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.bold.keyword('dodgerblue')('maz <command> --help')} for detailed usage of given command.`)
  console.log()
})

program
  .command('get-theme')
  .description('Generate css variables')
  .action(async () => {
    const configPath = path.resolve(process.env.PWD, './maz-ui.config.js')
    const config = require(configPath)
    const output = config.output
    delete config.output
    generateRootCss(config, output)
    process.exit(0)
  })

program.parse(process.argv)