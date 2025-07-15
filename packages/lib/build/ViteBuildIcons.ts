import type { Plugin } from 'vite'

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execPromise, logger } from '@maz-ui/node'

async function buildIcons() {
  try {
    await execPromise('pnpm -F @maz-ui/icons build')

    logger.success('[BuildIcons] ✅ icons built')
  }
  catch (error) {
    logger.error('[BuildIcons] 🔴 error while building icons', error)

    throw error
  }
}

export function ViteBuildIcons({ testing } = { testing: false }): Plugin {
  return {
    name: 'vite-build-icons',
    async configResolved() {
      const distFolderExists = existsSync(resolve(__dirname, '../../icons/dist'))

      if (distFolderExists) {
        return
      }

      await buildIcons()
    },
    async buildStart() {
      if (testing) {
        return
      }

      await buildIcons()
    },
  }
}
