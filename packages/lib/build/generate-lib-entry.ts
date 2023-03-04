import { resolve } from 'node:path'
import { buildEntry } from './entry-builder'

export function generateLibComponentsEntryFile() {
  return buildEntry({
    output: resolve(__dirname, './../dist/components/index.mjs'),
    componentName: 'name',
    scriptName: 'generate-lib-entry',
    extension: '.mjs',
  })
}
