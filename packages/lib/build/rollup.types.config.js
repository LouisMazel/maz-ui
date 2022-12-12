// @ts-check

import { resolve } from 'node:path'
import dts from 'rollup-plugin-dts'

const INPUT_TYPES = resolve(__dirname, './../dist/types/index.d.ts')
const OUTPUT_PATH = resolve(__dirname, './../dist/maz-ui.d.ts')

const config = [
  {
    input: [INPUT_TYPES],
    output: [{ file: OUTPUT_PATH, format: 'es' }],
    plugins: [dts()],
  },
]

export default config
