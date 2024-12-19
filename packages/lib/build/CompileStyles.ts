import type { Plugin } from 'vite'

import { compileScss } from './compileScss'
import { execPromise } from './utils/exec-promise'
import { logger } from './utils/logger'

export function CompileStyles(): Plugin {
  return {
    name: 'vite-compile-styles',
    async buildEnd() {
      try {
        await execPromise(
          'tailwindcss -i ./tailwindcss/tailwind.css -o dist/css/main.css --config tailwind.config.ts --postcss --minify',
        )

        logger.success('[CompileStyles] ✅ tailwind css compiled')

        await compileScss()

        logger.success('[CompileStyles] ✅ scss compiled')
      }
      catch (error) {
        logger.error('[CompileStyles] 🔴 error while compiling styles', error)
      }
    },
  }
}
