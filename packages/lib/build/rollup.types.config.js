import { resolve } from 'path'
import dts from 'rollup-plugin-dts'

const INPUT_TYPES = resolve(__dirname, './../types/index.d.ts')
const OUTPUT_PATH = resolve(__dirname, './../maz-ui.d.ts')

const config = [
  {
    input: INPUT_TYPES,
    output: [{ file: OUTPUT_PATH, format: 'es' }],
    plugins: [dts()],
  },
]

export default config
