import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'glob'

const bems = readFileSync('/tmp/bem-classes.txt', 'utf8').split('\n').filter(Boolean)
const files = await glob([
  'packages/lib/src/**/*.vue',
  'packages/lib/src/**/*.css',
  'packages/lib/src/**/*.ts',
  'packages/lib/tests/**/*.ts',
])
let changed = 0
for (const f of files) {
  const before = readFileSync(f, 'utf8')
  let after = before
  for (const bem of bems) {
    const wrong = 'maz:' + bem.slice(4)
    if (after.includes(wrong)) {
      after = after.split(wrong).join(bem)
    }
  }
  if (after !== before) {
    writeFileSync(f, after, 'utf8')
    changed++
  }
}
console.log('reverted BEM in', changed, 'files')
