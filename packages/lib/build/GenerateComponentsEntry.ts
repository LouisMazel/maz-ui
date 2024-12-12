import type { Plugin } from 'vite'

import { generateComponentsEntryFile } from './generate-components-entry'

/* eslint-disable no-console */
const logger = {
  error: (...args: unknown[]) => console.error(...args),
  log: (...args: unknown[]) => console.log(...args),
}
/* eslint-enable no-console */

export function GenerateComponentsEntry(): Plugin {
  return {
    name: 'vite-generate-components-entry',
    async buildStart() {
      try {
        await generateComponentsEntryFile()
      }
      catch (error) {
        logger.error('Error while generating components entry', error)
      }
    },
    buildEnd() {
      // watcher?.close()
    },
  }
}
