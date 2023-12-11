import { Command } from 'commander'
import { exit } from 'node:process'
import chalk from 'chalk'
import { execPromise } from '../../utils/exec-promise'

export function generateComponentsDocumentationCommand(): Command {
  const createFiles = new Command('generate-components-docs')

  createFiles
    .description('Generate components documentation in markdown files')
    .option('-w, --watch', 'Optional: use it to watch changes and generate docs automatically')
    .action(async (options: { watch?: boolean }) => {
      try {
        if (options.watch) {
          await execPromise('vue-docgen -w')

          console.log('')
          console.log(chalk.bold.green('Is watching for components documentation generating'))
          console.log('')
        } else {
          const { stdout, stderr } = await execPromise('vue-docgen')
          console.log('stdout', stdout)
          console.log('stderr', stderr)

          console.log('')
          console.log(chalk.bold.green('Components documentation generated'))
          console.log('')
        }
      } catch {
        exit(1)
      }
    })

  return createFiles
}
