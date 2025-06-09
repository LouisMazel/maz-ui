// @ts-check

import { join, resolve } from 'node:path'

import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vue-docgen-cli'
import { component, props } from './config/templates.js'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  componentsRoot: resolve(_dirname, './../lib/src/components'),
  components: './[A-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
  outDir: resolve(_dirname, './../../apps/docs/docs/.vitepress/generated-docs'),
  getDestFile: (filename, config) => {
    const filenameKebab = filename.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()

    console.log(filenameKebab)

    return join(config.outDir, filenameKebab).replace(/\.vue$/, '.doc.md')
  },
  templates: {
    component,
    props,
    // events,
    // methods,
    // slots,

  },
  docsRepo: 'LouisMazel/maz-ui',
  docsBranch: 'master',
})
