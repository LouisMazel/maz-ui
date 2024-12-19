import type { Plugin } from 'vite'

import { generateComponentsEntryFile } from './generate-components-entry'
import { logger } from './utils/logger'

export function GenerateComponentsEntry(): Plugin {
  return {
    name: 'vite-generate-components-entry',
    async buildStart() {
      try {
        await generateComponentsEntryFile()

        logger.success('[GenerateComponentsEntry] ✅ components entry generated')
      }
      catch (error) {
        logger.error('[GenerateComponentsEntry] 🔴 error while generating components entry', error)

        throw error
      }
    },
  }
}
