/* eslint-disable no-console */

import {
  renameSync,
  existsSync,
  statSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
} from 'node:fs'
import { resolve, join } from 'node:path'
import { logger } from './logger'

const INPUT_COMPONENT_DIR = resolve(__dirname, './../types/components')
const OUTPUT_TYPES_FILES = resolve(__dirname, './../dist/components')

function copyRecursiveSync(inputPath: string, outputPah: string) {
  const exists = existsSync(inputPath)
  const stats = statSync(inputPath)
  const isDirectory = exists && stats.isDirectory()

  if (isDirectory) {
    const destDirExists = existsSync(outputPah)
    if (!destDirExists) {
      mkdirSync(outputPah)
    }
    for (const childItemName of readdirSync(inputPath)) {
      copyRecursiveSync(
        join(inputPath, childItemName),
        join(outputPah, childItemName),
      )
    }
  } else {
    copyFileSync(inputPath, outputPah)
  }
}

function renameAllFiles() {
  const componentsTypesList = readdirSync(OUTPUT_TYPES_FILES).filter((name) =>
    name.endsWith('.vue.d.ts'),
  )
  for (const name of componentsTypesList) {
    const componentName = name.split('.')[0]
    renameSync(
      `${OUTPUT_TYPES_FILES}/${name}`,
      `${OUTPUT_TYPES_FILES}/${componentName}.d.ts`,
    )
  }
}

const launch = () => {
  try {
    copyRecursiveSync(INPUT_COMPONENT_DIR, OUTPUT_TYPES_FILES)
    renameAllFiles()

    logger.success('[CopyComponentsTypes] ✅')
  } catch (error) {
    logger.error(
      '[CopyComponentsTypes] 🔴 Error occurred while copying component type files',
      error,
    )
  }
}

launch()
