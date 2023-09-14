import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { logger } from './utils/logger'

const INPUT_ICONS_DIR = resolve(__dirname, './../icons')

export const getIconList = async () => {
  try {
    const fileList = await readdir(INPUT_ICONS_DIR)
    // eslint-disable-next-line no-console
    logger.success(
      fileList
        .filter((name) => name.endsWith('.svg'))
        .map((name) => `'${name.replace('.svg', '')}'`),
    )
  } catch (error) {
    throw new Error(`[get-icons-list] 🔴 Error occurred while getting icons file list - ${error}`)
  }
}

getIconList()
