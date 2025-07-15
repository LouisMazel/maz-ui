import type { Plugin } from 'vite'

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'

import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { execPromise, logger } from '@maz-ui/node'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import { compileAsync } from 'sass'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const AOS_SCSS_ENTRY = resolve(_dirname, './../src/plugins/aos/scss/index.scss')
const AOS_SCSS_OUTPUT_DIR = resolve(_dirname, './../dist/css')
const AOS_SCSS_OUTPUT = resolve(_dirname, './../dist/css/aos.css')

export async function compileScss() {
  const result = await compileAsync(AOS_SCSS_ENTRY, {
    style: 'compressed',
    verbose: true,
  })

  const cssPrefixed = await postcss([autoprefixer]).process(result.css, {
    from: AOS_SCSS_ENTRY,
    to: AOS_SCSS_OUTPUT,
  })

  const hasCssDir = existsSync(AOS_SCSS_OUTPUT_DIR)

  if (!hasCssDir) {
    mkdirSync(AOS_SCSS_OUTPUT_DIR)
  }

  writeFileSync(AOS_SCSS_OUTPUT, cssPrefixed.css)
}

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
