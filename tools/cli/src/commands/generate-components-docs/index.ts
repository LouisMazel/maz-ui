import { readdirSync } from 'node:fs'
import { exit } from 'node:process'
import { execPromise, logger } from '@maz-ui/node/index.js'
import { Command } from 'commander'

export function generateComponentsDocumentationCommand(): Command {
  const createFiles = new Command('generate-components-docs')

  createFiles
    .description('Generate components documentation in markdown files')
    .option('-w, --watch', 'Optional: use it to watch changes and generate docs automatically')
    .action(async (options: { watch?: boolean }) => {
      try {
        if (options.watch) {
          await execPromise('vue-docgen -w')

          logger.eot()
          logger.success('Is watching for components documentation generating')
          logger.eot()
        }
        else {
          await execPromise('vue-docgen')
          logger.eot()
          const files = readdirSync('./../../apps/docs/.vitepress/generated-docs')
          logger.success(`${files.length} components documentation generated`)
          logger.eot()
        }
      }
      catch {
        exit(1)
      }
    })

  return createFiles
}
