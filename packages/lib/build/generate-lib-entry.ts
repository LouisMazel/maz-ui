import path from 'node:path'
import { buildEntry } from './entry-builder'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export function generateLibComponentsEntryFile() {
  return buildEntry({
    output: path.resolve(_dirname, './../dist/components/index.mjs'),
    componentName: 'name',
    scriptName: 'generate-lib-entry',
    extension: '.mjs',
  })
}
