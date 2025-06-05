import type { Plugin } from 'vite'

import { copyAndTransformComponentsTypesFiles } from './copy-components-types'
import { execPromise } from './utils/exec-promise'
import { logger } from './utils/logger'

export function ViteCopyComponentTypes(): Plugin {
  return {
    name: 'vite-copy-component-types',
    async writeBundle() {
      try {
        await execPromise('vue-tsc --declaration --emitDeclarationOnly -p tsconfig.types.json')

        copyAndTransformComponentsTypesFiles()
        logger.success('[CopyComponentTypes] ✅ component types copied')
      }
      catch (error) {
        logger.error('[CopyComponentTypes] 🔴 error while copying component types', error)

        throw error
      }
    },
  }
}
