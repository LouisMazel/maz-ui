import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { exit } from 'node:process'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createLibraryComponentFile({
  filename,
  filenameKebab,
}: {
  filename: string
  filenameKebab: string
}): Promise<void> {
  const COMPONENT_FILE_OUTPUT = path.resolve(_dirname, `../../../../lib/components/${filename}.vue`)

  const componentTemplate = `<template>
  <div class="m-${filenameKebab.split('-')[1]}">${filename}</div>
</template>
`

  try {
    await writeFile(COMPONENT_FILE_OUTPUT, componentTemplate)
  } catch (error) {
    console.error(`Error: Failed to create file "${filename}".`, error)
    exit(1)
  }
}
