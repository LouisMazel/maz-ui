import path from 'node:path'
import { buildEntry } from './entry-builder'
import { fileURLToPath } from 'node:url'

const _dirname = fileURLToPath(new URL('.', import.meta.url))

export function generateComponentsEntryFile() {
  return buildEntry({
    output: path.resolve(_dirname, './../components/index.ts'),
    componentName: 'fullName',
    scriptName: 'generate-components-entry',
  })
}
