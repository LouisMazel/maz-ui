import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from './utils/logger'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const INPUT_ICONS_DIR = resolve(_dirname, './../src/icons')

export async function getIconList() {
  try {
    const fileList = await readdir(INPUT_ICONS_DIR)

    logger.success(
      fileList
        .filter(name => name.endsWith('.svg'))
        .map(name => `'${name.replace('.svg', '')}'`),
    )
  }
  catch (error) {
    throw new Error(`[get-icons-list] 🔴 Error occurred while getting icons file list - ${error}`)
  }
}

getIconList()
