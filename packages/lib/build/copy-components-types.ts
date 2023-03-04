import { copyFileSync, readdirSync, renameSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { logger } from './utils/logger'
import { replaceInFile } from 'replace-in-file'

const INPUT_COMPONENT_DIR = resolve(__dirname, './../generated-types/components')
const OUTPUT_TYPES_FILES = resolve(__dirname, './../dist/components')
const COMPONENTS_TYPE_PATH = resolve(__dirname, './../dist/components/index.d.ts')

function copyRecursive() {
  try {
    for (const childItemName of readdirSync(INPUT_COMPONENT_DIR)) {
      if (childItemName.endsWith('.d.ts')) {
        copyFileSync(
          join(INPUT_COMPONENT_DIR, childItemName),
          join(OUTPUT_TYPES_FILES, childItemName),
        )
      } else {
        continue
      }
    }
  } catch (error) {
    throw new Error(`[copy-components-types](copyRecursive) ${error}`)
  }
}

function renameAllFiles() {
  const componentsTypesList = readdirSync(OUTPUT_TYPES_FILES).filter((name) =>
    name.endsWith('.vue.d.ts'),
  )
  for (const name of componentsTypesList) {
    const componentName = name.split('.')[0]
    renameSync(`${OUTPUT_TYPES_FILES}/${name}`, `${OUTPUT_TYPES_FILES}/${componentName}.d.ts`)
  }
}

const replaceTypesExtensions = () => {
  const options = {
    files: COMPONENTS_TYPE_PATH,
    from: /vue';/g,
    to: "js';",
  }

  return replaceInFile(options)
}

export function copyAndTransformComponentsTypesFiles() {
  try {
    copyRecursive()
    renameAllFiles()
    replaceTypesExtensions()

    logger.success('[copy-components-types] ✅')
  } catch (error) {
    logger.error(
      '[copy-components-types](launch) 🔴 Error occurred while copying component type files',
      error,
    )
  }
}
