import { fileURLToPath } from 'node:url'

import path from 'node:path'
import { defineConfig } from 'vue-docgen-cli'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  componentsRoot: path.resolve(_dirname, './../lib/components'),
  components: './[A-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
  outDir: path.resolve(_dirname, './../docs/docs/.vitepress/generated-docs'),
  getDestFile: (filename, config) => {
    const filenameKebab = filename.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()

    return path.join(config.outDir, filenameKebab).replace(/\.vue$/, '.doc.md')
  },
  templates: {
    component: require('./config/docgen/template-component'),
  },
})
