import type { Plugin } from 'vite'

import { execPromise } from './utils/exec-promise'
import { logger } from './utils/logger'

export function BuildMazCli(): Plugin {
  return {
    name: 'vite-build-maz-cli',
    async buildEnd() {
      try {
        await execPromise('pnpm -F @mazui/cli build')

        logger.success('[BuildMazCli] ✅ maz cli built')
      }
      catch (error) {
        logger.error('[BuildMazCli] 🔴 error while building maz cli', error)
      }
    },
  }
}
