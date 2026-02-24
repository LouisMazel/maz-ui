import type { Plugin } from 'vite'

import { execPromise, logger } from '@maz-ui/node/index.js'

export function ViteBuildMazCli(): Plugin {
  return {
    name: 'vite-build-maz-cli',
    async buildEnd() {
      try {
        await execPromise('pnpm exec nx run @maz-ui/cli:build')

        logger.success('[BuildMazCli] ✅ maz cli built')
      }
      catch (error) {
        logger.error('[BuildMazCli] 🔴 error while building maz cli', error)

        throw error
      }
    },
  }
}
