import type { Plugin } from 'vite'

import { execPromise } from './utils/exec-promise'
import { logger } from './utils/logger'

export function ViteBuildNuxtModule(): Plugin {
  return {
    name: 'vite-build-nuxt-module',
    async buildEnd() {
      try {
        // await execPromise('pnpm -F nuxt-module typecheck')
        await execPromise('pnpm -F nuxt-module build')

        logger.success('[BuildNuxtModule] ✅ nuxt module built')
      }
      catch (error) {
        logger.error('[BuildNuxtModule] 🔴 error while building nuxt module', error)

        throw error
      }
    },
  }
}
