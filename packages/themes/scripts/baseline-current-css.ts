import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mazUi } from '../src/presets/mazUi'
import { nova } from '../src/presets/nova'
import { obsidian } from '../src/presets/obsidian'
import { ocean } from '../src/presets/ocean'
import { pristine } from '../src/presets/pristine'
import { generateCSS } from '../src/utils/css-generator'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const outDir = resolve(__dirname, '../.baseline-css')
mkdirSync(outDir, { recursive: true })

for (const preset of [mazUi, ocean, pristine, obsidian, nova]) {
  const css = generateCSS(preset, {
    mode: 'both',
    darkSelectorStrategy: 'class',
    darkClass: 'dark',
    scaleColorVariables: true,
  })
  writeFileSync(resolve(outDir, `${preset.name}.css`), css)
}
// eslint-disable-next-line no-console
console.log(`✓ Baseline CSS written to ${outDir}`)
