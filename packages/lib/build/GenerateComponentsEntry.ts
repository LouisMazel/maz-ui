import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildEntry } from './entry-builder'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export function generateComponentsEntryFile() {
  return buildEntry({
    output: resolve(_dirname, './../src/components/index.ts'),
    componentName: 'fullName',
    scriptName: 'generate-components-entry',
  })
}
