import type { Plugin } from 'vite'

import { execPromise } from './utils/exec-promise'
import { logger } from './utils/logger'

export function ViteBuildIcons(): Plugin {
  return {
    name: 'vite-build-icons',
    async buildEnd() {
      try {
        await execPromise('pnpm -F @maz-ui/icons build')

        logger.success('[BuildIcons] ✅ icons built')
      }
      catch (error) {
        logger.error('[BuildIcons] 🔴 error while building icons', error)

        throw error
      }
    },
  }
}
