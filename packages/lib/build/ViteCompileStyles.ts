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

const CSS_DTS_STUB = 'export {}\n'

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
          'npx @tailwindcss/cli -i ./src/tailwindcss/dist-entry.css -o dist/css/main.css --minify',
        )

        logger.success('[CompileStyles] ✅ tailwind css compiled')

        await compileScss()

        logger.success('[CompileStyles] ✅ scss compiled')

        // Write .d.ts stubs for CSS dist files so TypeScript 6+ (TS2882)
        // can resolve type declarations for side-effect CSS imports.
        writeFileSync(resolve(cssDir, 'main.d.ts'), CSS_DTS_STUB)
        writeFileSync(resolve(cssDir, 'aos.d.ts'), CSS_DTS_STUB)

        logger.success('[CompileStyles] ✅ css .d.ts stubs written')
      }
      catch (error) {
        logger.error('[CompileStyles] 🔴 error while compiling styles', error)

        throw error
      }
    },
  }
}
