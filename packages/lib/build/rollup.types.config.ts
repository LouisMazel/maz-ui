import { resolve, dirname } from 'node:path'
import dts from 'rollup-plugin-dts'

const __dirname = dirname(import.meta.url.replace('file://', ''))

const INPUT_TYPES_FILE = resolve(__dirname, './../types/index.d.ts')
const OUTPUT_PATH = resolve(__dirname, './../dist/maz-ui.d.ts')

export default [
  {
    input: INPUT_TYPES_FILE,
    output: [{ file: OUTPUT_PATH, format: 'es' }],
    plugins: [dts()],
  },
]
