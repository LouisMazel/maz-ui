import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { replaceInFile } from 'replace-in-file'
import { logger } from './utils/logger'

const INPUT_COMPONENT_DIR = resolve(__dirname, './../dist/tmp_types/components')
const OUTPUT_TYPES_FILES = resolve(__dirname, './../dist/components')
const COMPONENTS_TYPE_PATH = resolve(__dirname, './../dist/components/index.d.ts')

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
        copyRecursive(join(inputPath, childItemName), join(outputPath, childItemName))
      }
    }
    else {
      copyFileSync(inputPath, outputPath)
    }
  }
  catch (error) {
    throw new Error(`[copy-components-types](copyRecursive) ${error}`)
  }
}

function renameAllFiles() {
  const componentsTypesList = readdirSync(OUTPUT_TYPES_FILES).filter(name =>
    name.endsWith('.vue.d.ts'),
  )
  for (const name of componentsTypesList) {
    const componentName = name.split('.')[0]
    renameSync(`${OUTPUT_TYPES_FILES}/${name}`, `${OUTPUT_TYPES_FILES}/${componentName}.d.ts`)
  }
}

function replaceTypesExtensions() {
  const options = {
    files: COMPONENTS_TYPE_PATH,
    from: /vue';/g,
    to: 'js\';',
  }

  return replaceInFile(options)
}

export function copyAndTransformComponentsTypesFiles() {
  try {
    copyRecursive(INPUT_COMPONENT_DIR, OUTPUT_TYPES_FILES)
    renameAllFiles()
    replaceTypesExtensions()

    logger.success('[copy-components-types] declaration types files copied ✅')
  }
  catch (error) {
    logger.error(
      '[copy-components-types] 🔴 Error occurred while copying component type files',
      error,
    )
  }
}
