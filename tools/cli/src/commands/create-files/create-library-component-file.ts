import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exit } from 'node:process'
import { fileURLToPath } from 'node:url'
import { logger } from '@maz-ui/node'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createLibraryComponentFile({
  filename,
  filenameKebab,
}: {
  filename: string
  filenameKebab: string
}): Promise<void> {
  const COMPONENT_FILE_OUTPUT = resolve(_dirname, `../../../../../packages/lib/src/components/${filename}.vue`)

  const componentTemplate = `<template>
  <div class="m-${filenameKebab.split('-')[1]} m-reset-css">${filename}</div>
</template>
`

  try {
    await writeFile(COMPONENT_FILE_OUTPUT, componentTemplate)
  }
  catch (error) {
    logger.error(`Error: Failed to create file "${filename}".`, error)
    exit(1)
  }
}
