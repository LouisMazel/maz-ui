/* eslint-disable no-console */

const { renderSync } = require('node-sass')
const { resolve } = require('path')

const { writeFileSync, existsSync, mkdirSync } = require('fs')

const AOS_SCSS_ENTRY = resolve(
  __dirname,
  './../package/plugins/aos/scss/index.scss',
)
const AOS_SCSS_OUTPUT_DIR = resolve(__dirname, './../css')
const AOS_SCSS_OUTPUT = resolve(__dirname, './../css/aos.css')

try {
  console.log('[Build](scss) 🟢 start compiling css')
  const result = renderSync({
    file: AOS_SCSS_ENTRY,
    // outFile: AOS_SCSS_OUTPUT,
    outputStyle: 'compressed',
    sourceMap: true,
  })

  const hasCssDir = existsSync(AOS_SCSS_OUTPUT_DIR)

  if (!hasCssDir) {
    mkdirSync(AOS_SCSS_OUTPUT_DIR)
  }

  // TODO: autoprefixer

  writeFileSync(AOS_SCSS_OUTPUT, result.css)

  console.log('[Build](scss) ✅ css compiled')
} catch (err) {
  throw new Error(`[build](scss) 🔴 ${err}`)
}

/* eslint-enable camelcase */
