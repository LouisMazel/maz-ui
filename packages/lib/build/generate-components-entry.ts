import { resolve } from 'node:path'
import { buildEntry } from './entry-builder'

export function generateComponentsEntryFile() {
  return buildEntry({
    output: resolve(__dirname, './../components/index.ts'),
    componentName: 'fullName',
    scriptName: 'generate-components-entry',
  })
}
