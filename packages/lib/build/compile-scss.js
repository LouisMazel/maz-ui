// @ts-check
const { resolve } = require('node:path')
const { writeFileSync, existsSync, mkdirSync } = require('node:fs')

const { compileAsync } = require('sass')

const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

const AOS_SCSS_ENTRY = resolve(
  __dirname,
  './../package/plugins/aos/scss/index.scss',
)
const AOS_SCSS_OUTPUT_DIR = resolve(__dirname, './../css')
const AOS_SCSS_OUTPUT = resolve(__dirname, './../css/aos.css')

const buildCompileScss = async () => {
  try {
    // eslint-disable-next-line no-console
    console.log('[Build](scss) 🟢 start compiling css')
    const result = await compileAsync(AOS_SCSS_ENTRY, {
      style: 'compressed',
      verbose: true,
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

    // eslint-disable-next-line no-console
    console.log('[Build](scss) ✅ css compiled')
  } catch (error) {
    throw new Error(`[build](scss) 🔴 ${error}`)
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
buildCompileScss()
