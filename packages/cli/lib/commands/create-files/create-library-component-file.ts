import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exit } from 'node:process'

export async function createLibraryComponentFile({
  filename,
  filenameKebab,
}: {
  filename: string
  filenameKebab: string
}): Promise<void> {
  const COMPONENT_FILE_OUTPUT = resolve(__dirname, `../../../../lib/components/${filename}.vue`)

  const componentTemplate = `<template>
  <div class="${filenameKebab}">${filename}</div>
</template>
`

  try {
    await writeFile(COMPONENT_FILE_OUTPUT, componentTemplate)
  } catch (error) {
    console.error(`Error: Failed to create file "${filename}".`, error)
    exit(1)
  }
}
