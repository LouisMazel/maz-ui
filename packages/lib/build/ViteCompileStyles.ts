import type { Plugin } from 'vite'

import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { compileScss } from './compileScss'
import { execPromise } from './utils/execPromise'
import { logger } from './utils/logger'

export function ViteCompileStyles(): Plugin {
  return {
    name: 'vite-compile-styles',
    async writeBundle(options) {
      try {
        const cssDir = resolve(options.dir ?? './dist', 'css')
        if (!existsSync(cssDir)) {
          mkdirSync(cssDir, { recursive: true })
        }

        await execPromise(
          'tailwindcss -i ./src/tailwindcss/tailwind.css -o dist/css/main.css --config tailwind.config.ts --postcss --minify',
        )

        logger.success('[CompileStyles] ✅ tailwind css compiled')

        await compileScss()

        logger.success('[CompileStyles] ✅ scss compiled')
      }
      catch (error) {
        logger.error('[CompileStyles] 🔴 error while compiling styles', error)

        throw error
      }
    },
  }
}
