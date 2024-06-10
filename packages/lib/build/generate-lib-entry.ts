import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildEntry } from './entry-builder'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export function generateLibComponentsEntryFile() {
  return buildEntry({
    output: resolve(_dirname, './../dist/components/index.mjs'),
    componentName: 'name',
    scriptName: 'generate-lib-entry',
    extension: '.mjs',
  })
}
