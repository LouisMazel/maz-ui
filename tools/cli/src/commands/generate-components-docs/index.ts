import { exit } from 'node:process'
import { execPromise } from '@maz-ui/utils/src/utils/execPromise.ts'
import { logger } from '@maz-ui/utils/src/utils/logger.ts'
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
          logger.success('Components documentation generated')
          logger.eot()
        }
      }
      catch {
        exit(1)
      }
    })

  return createFiles
}
