import type { Plugin } from 'vite'

import { execPromise, logger } from '@maz-ui/utils/src/utils/index.js'

export function ViteBuildMazCli(): Plugin {
  return {
    name: 'vite-build-maz-cli',
    async buildEnd() {
      try {
        await execPromise('pnpm -F @maz-ui/cli typecheck')
        await execPromise('pnpm -F @maz-ui/cli build')

        logger.success('[BuildMazCli] ✅ maz cli built')
      }
      catch (error) {
        logger.error('[BuildMazCli] 🔴 error while building maz cli', error)

        throw error
      }
    },
  }
}
