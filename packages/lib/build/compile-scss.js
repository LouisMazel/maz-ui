/* eslint-disable no-console */
const { renderSync } = require('node-sass')
const { resolve } = require('node:path')

const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

const { writeFileSync, existsSync, mkdirSync } = require('node:fs')

const AOS_SCSS_ENTRY = resolve(
  __dirname,
  './../package/plugins/aos/scss/index.scss',
)
const AOS_SCSS_OUTPUT_DIR = resolve(__dirname, './../css')
const AOS_SCSS_OUTPUT = resolve(__dirname, './../css/aos.css')

const buildCompilteScss = async () => {
  try {
    console.log('[Build](scss) 🟢 start compiling css')
    const result = renderSync({
      file: AOS_SCSS_ENTRY,
      // outFile: AOS_SCSS_OUTPUT,
      outputStyle: 'compressed',
      sourceMap: true,
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

    console.log('[Build](scss) ✅ css compiled')
  } catch (error) {
    throw new Error(`[build](scss) 🔴 ${error}`)
  }
}

/* eslint-disable unicorn/prefer-top-level-await */

buildCompilteScss()
