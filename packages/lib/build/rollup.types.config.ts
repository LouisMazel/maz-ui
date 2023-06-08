import { defineConfig } from 'rollup'
import { resolve, dirname } from 'node:path'
import dts from 'rollup-plugin-dts'

const __dirname = dirname(import.meta.url.replace('file://', ''))

export default defineConfig([
  {
    input: resolve(__dirname, './../generated-types/modules/index.d.ts'),
    output: [{ file: resolve(__dirname, './../dist/modules/index.d.ts'), format: 'es' }],
    plugins: [dts()],
  },
])
