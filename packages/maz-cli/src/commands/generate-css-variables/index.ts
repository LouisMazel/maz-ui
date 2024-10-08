import { exit } from 'node:process'
import { intro, log, outro } from '@clack/prompts'
import { green, red } from 'colorette'
import { Command } from 'commander'
import { loadConfig } from '../../utils'
import { generateCssFile } from './generate-css-file'

export function generateCssVariables(): Command {
  const command = new Command('generate-css-vars')

  command.description('Generate CSS variables file for maz-ui library').action(async () => {
    try {
      intro('Genating CSS variables file <> Maz-UI')

      const { config, filepath, isEmpty } = await loadConfig()

      if (isEmpty) {
        throw new Error('maz-ui config file is empty')
      }

      if (!config.outputCssFilePath) {
        throw new Error('Property "outputCssFilePath" not provided in config file maz-ui')
      }

      log.success(`Config file found in ${filepath}`)

      const { outputPath } = await generateCssFile({
        config,
        outputCssFilePath: config.outputCssFilePath,
      })

      outro(`CSS file generated in ${green(outputPath)}`)
    }
    catch (error: any) {
      log.error('An error occured while generating CSS file')
      log.error(red((error.message ?? error) as string))
      log.error('')
      exit(1)
    }
  })

  return command
}
