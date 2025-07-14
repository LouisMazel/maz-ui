import type { Plugin } from 'vite'

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execPromise, logger } from '@maz-ui/utils/src/utils/index.js'

async function buildThemes() {
  try {
    await execPromise('pnpm -F @maz-ui/themes build')

    logger.success('[BuildThemes] ✅ themes built')
  }
  catch (error) {
    logger.error('[BuildThemes] 🔴 error while building themes', error)

    throw error
  }
}

export function ViteBuildThemes({ testing } = { testing: false }): Plugin {
  return {
    name: 'vite-build-themes',
    async configResolved() {
      const distFolderExists = existsSync(resolve(__dirname, '../../themes/dist'))

      if (distFolderExists) {
        return
      }

      await buildThemes()
    },
    async buildStart() {
      if (testing) {
        return
      }

      await buildThemes()
    },
  }
}
