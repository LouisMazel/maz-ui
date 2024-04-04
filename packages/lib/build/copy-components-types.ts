import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'node:fs'
import path from 'node:path'
import { logger } from './utils/logger'
import replace from 'replace-in-file'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))
const INPUT_COMPONENT_DIR = path.resolve(_dirname, './../dist/types/components')
const OUTPUT_TYPES_FILES = path.resolve(_dirname, './../dist/components')
const COMPONENTS_TYPE_PATH = path.resolve(_dirname, './../dist/components/index.d.ts')

function copyRecursive(inputPath: string, outputPath: string) {
  try {
    const exists = existsSync(inputPath)
    const stats = statSync(inputPath)
    const isDirectory = exists && stats.isDirectory()

    if (isDirectory) {
      const destDirExists = existsSync(outputPath)
      if (!destDirExists) {
        mkdirSync(outputPath)
      }
      for (const childItemName of readdirSync(inputPath)) {
        copyRecursive(path.join(inputPath, childItemName), path.join(outputPath, childItemName))
      }
    } else {
      copyFileSync(inputPath, outputPath)
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

  return replace(options)
}

export function copyAndTransformComponentsTypesFiles() {
  try {
    copyRecursive(INPUT_COMPONENT_DIR, OUTPUT_TYPES_FILES)
    renameAllFiles()
    replaceTypesExtensions()

    logger.success('[copy-components-types] declaration types files copied ✅')
  } catch (error) {
    logger.error(
      '[copy-components-types] 🔴 Error occurred while copying component type files',
      error,
    )
  }
}
