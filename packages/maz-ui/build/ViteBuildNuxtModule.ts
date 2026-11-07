import type { Plugin } from 'vite'

import { execPromise, logger } from '@maz-ui/node'

export function ViteBuildNuxtModule(): Plugin {
  return {
    name: 'vite-build-nuxt-module',
    async buildEnd() {
      try {
        await execPromise('pnpm exec nx run @maz-ui/nuxt:build')

        logger.success('[BuildNuxtModule] ✅ nuxt module built')
      }
      catch (error) {
        logger.error('[BuildNuxtModule] 🔴 error while building nuxt module', error)

        throw error
      }
    },
  }
}
