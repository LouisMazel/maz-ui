/* eslint-disable unicorn/prefer-module */

const { resolve, join } = require('node:path')
const { defineConfig } = require('vue-docgen-cli')

module.exports = defineConfig({
  componentsRoot: resolve(__dirname, './../lib/package/components'),
  components: './[A-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
  outDir: resolve(__dirname, './../docs/docs/.vitepress/generated-docs'),
  getDestFile: (filename, config) => {
    const filenameKebab = filename.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()

    return join(config.outDir, filenameKebab).replace(/\.vue$/, '.doc.md')
  },
  templates: {
    component: require('./config/docgen/template-component'),
  },
})

/* eslint-enable unicorn/prefer-module */
