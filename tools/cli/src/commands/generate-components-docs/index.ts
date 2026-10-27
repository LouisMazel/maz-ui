import { watch } from 'node:fs'
import { resolve } from 'node:path'
import { exit } from 'node:process'
import { fileURLToPath } from 'node:url'
import { execPromise, logger } from '@maz-ui/node'
import { debounce } from '@maz-ui/utils/helpers/debounce'
import { Command } from 'commander'

const COMPONENTS_DIR = fileURLToPath(new URL('../../../../../packages/lib/src/components', import.meta.url))

async function generate(): Promise<void> {
  await execPromise('pnpm -F docs generate:components-docs')
  logger.success('Components API tables generated in apps/docs/.vitepress/generated-docs')
}

export function generateComponentsDocumentationCommand(): Command {
  const createFiles = new Command('generate-components-docs')

  createFiles
    .description('Generate the API tables of the components documentation (props, events, slots, expose) from their TypeScript sources')
    .option('-w, --watch', 'Optional: use it to watch changes and generate docs automatically')
    .action(async (options: { watch?: boolean }) => {
      try {
        await generate()

        if (options.watch) {
          const regenerate = debounce(() => {
            generate().catch(error => logger.error(error))
          }, 500)

          watch(resolve(COMPONENTS_DIR), { recursive: true }, regenerate)
          logger.success('Watching the components for documentation changes')
        }
      }
      catch {
        exit(1)
      }
    })

  return createFiles
}
