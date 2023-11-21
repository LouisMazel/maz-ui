/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('node:path')
const { defineConfig } = require('vue-docgen-cli')

module.exports = defineConfig({
  componentsRoot: path.resolve(__dirname, './../lib/components'),
  components: './[A-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
  outDir: path.resolve(__dirname, './../docs/docs/.vitepress/generated-docs'),
  getDestFile: (filename, config) => {
    const filenameKebab = filename.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()

    return path.join(config.outDir, filenameKebab).replace(/\.vue$/, '.doc.md')
  },
  templates: {
    component: require('./config/docgen/template-component'),
  },
})
