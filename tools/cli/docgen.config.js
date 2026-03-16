// @ts-check

import { join, resolve } from 'node:path'

import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vue-docgen-cli'
import { component, props } from './config/templates.js'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

const PASCAL_TO_KEBAB_RE = /([\da-z])([A-Z])/g
const VUE_EXT_RE = /\.vue$/

export default defineConfig({
  componentsRoot: resolve(_dirname, './../../packages/lib/src/components'),
  components: './[A-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
  outDir: resolve(_dirname, './../../apps/docs/.vitepress/generated-docs'),
  getDestFile: (filename, config) => {
    const filenameKebab = filename.replaceAll(PASCAL_TO_KEBAB_RE, '$1-$2').toLowerCase()

    return join(config.outDir, filenameKebab).replace(VUE_EXT_RE, '.doc.md')
  },
  templates: {
    component,
    props,
  },
  docsRepo: 'LouisMazel/maz-ui',
  docsBranch: 'master',
})
