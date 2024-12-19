import type { Plugin } from 'vite'

import { execPromise } from './utils/exec-promise'
import { logger } from './utils/logger'

export function BuildNuxtModule(): Plugin {
  return {
    name: 'vite-build-nuxt-module',
    async buildEnd() {
      try {
        // await execPromise('pnpm -F nuxt-module typecheck')
        await execPromise('pnpm -F nuxt-module build')
        // Nuxt Module: rename all module.* to index.*
        // const fileList = await readdir(resolve(__dirname, '../dist/nuxt'), {
        //   withFileTypes: true,
        // })

        // const fileListToRename = fileList.filter(
        //   dirent => dirent.isFile() && dirent.name.startsWith('module'),
        // )

        // for await (const { path: filePath, name } of fileListToRename) {
        //   await rename(resolve(filePath, name), resolve(filePath, `index${extname(name)}`))
        // }

        logger.success('[BuildNuxtModule] ✅ nuxt module built')
      }
      catch (error) {
        logger.error('[BuildNuxtModule] 🔴 error while building nuxt module', error)

        throw error
      }
    },
  }
}
