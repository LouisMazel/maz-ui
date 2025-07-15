import { resolve } from 'node:path'
import { exit } from 'node:process'
import { fileURLToPath } from 'node:url'
import { cancel, confirm, isCancel, multiselect, spinner, text } from '@clack/prompts'
import { logger } from '@maz-ui/node/index.ts'
import { Command } from 'commander'
import { pascalCaseToKebabCase } from './../../utils/pascal-case-to-kebab-case'
import { createDocumentFile } from './create-documentation-file'
import { createLibraryComponentFile } from './create-library-component-file'
import { createLibraryTestFile } from './create-library-test-file'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export function createFilesCommand(): Command {
  const createFiles = new Command('create-files')

  createFiles
    .description('Create Vue, Tests et Documentations files for a new component')
    .option(
      '-f, --filename <filename>',
      'Optional: Provide the name of the component you want create - Ex: "MazBtn"',
    )
    .action(async (option: { filename?: string }) => {
      try {
        let filename = option.filename
        if (filename) {
          const isGoodFilename = await confirm({
            message: `Are you sure the name of your component is "${filename}"`,
          })

          checkIsCancel(isGoodFilename)

          if (!isGoodFilename) {
            filename = await getComponentName(filename)
          }
        }

        if (!filename) {
          filename = await getComponentName()
        }

        const fileTypes = await multiselect({
          message: 'Select the file types you want to create',
          options: [
            { value: 'all', label: 'All files' },
            { value: 'docs', label: 'Documentation File' },
            { value: 'vue', label: 'Library Vue Component File' },
            { value: 'test', label: 'Library Test Unit File' },
          ],
        })

        checkIsCancel(fileTypes)

        if (Array.isArray(fileTypes)) {
          await runCreateFiles({
            filename,
            fileTypes: fileTypes as string[],
          })
        }
      }
      catch {
        exit(1)
      }
    })

  return createFiles
}

async function getComponentName(initialValue?: string): Promise<string> {
  const componentName = await text({
    message: 'What is your component name?',
    placeholder: 'Not sure',
    initialValue,
    validate(value) {
      if (value.length === 0)
        return 'Value is required!'

      return undefined
    },
  })

  checkIsCancel(componentName)

  return componentName as string
}

function checkIsCancel(value: unknown): void {
  if (isCancel(value)) {
    cancel('Operation cancelled.')
    exit(0)
  }
}

async function runCreateFiles({
  filename,
  fileTypes,
}: {
  filename: string
  fileTypes: string[]
}): Promise<void> {
  const filenameKebab = pascalCaseToKebabCase(filename)

  const spinnerLoader = spinner()
  spinnerLoader.start('File(s) creating')

  const shouldCreateAllFiles = fileTypes.includes('all')

  if (shouldCreateAllFiles || fileTypes.includes('test')) {
    await createLibraryTestFile({
      filename,
    })
  }
  if (shouldCreateAllFiles || fileTypes.includes('vue')) {
    await createLibraryComponentFile({
      filename,
      filenameKebab,
    })

    logger.warn('You should add the component to the entry file manually')
  }

  const shouldCreateDocumentationFile = shouldCreateAllFiles || fileTypes.includes('docs')

  if (shouldCreateDocumentationFile) {
    await createDocumentFile({
      filename,
      filenameKebab,
    })
  }

  spinnerLoader.stop('File(s) created')

  if (shouldCreateDocumentationFile) {
    const componentConfigurationFilePath = resolve(
      _dirname,
      './../../../docs/docs/.vitepress/configs/components.mts',
    )

    logger.eot()
    logger.success(
      `⚠ Now you should add your component reference in the right part in ${componentConfigurationFilePath}`,
    )
    logger.eot()
  }
}
