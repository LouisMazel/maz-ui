// @ts-check

import { fileURLToPath } from 'node:url'

import { join, resolve } from 'node:path'
import { defineConfig } from 'vue-docgen-cli'
import { component } from './config/component-template.js'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  componentsRoot: resolve(_dirname, './../lib/components'),
  components: './[A-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
  outDir: resolve(_dirname, './../docs/docs/.vitepress/generated-docs'),
  getDestFile: (filename, config) => {
    // @ts-expect-error - ES version mismatch
    const filenameKebab = filename.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()

    return join(config.outDir, filenameKebab).replace(/\.vue$/, '.doc.md')
  },
  templates: {
    component,
  },
  docsRepo: 'LouisMazel/maz-ui',
  docsBranch: 'master',
})
