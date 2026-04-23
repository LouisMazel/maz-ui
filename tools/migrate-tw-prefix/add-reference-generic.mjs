import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { glob } from 'glob'

const [globArg, entryArg] = process.argv.slice(2)
if (!globArg || !entryArg) {
  console.error('Usage: node add-reference-generic.mjs <glob> <entry-css-path>')
  process.exit(1)
}

const TARGET = resolve(entryArg)
const files = await glob(globArg)

let changed = 0
for (const file of files) {
  const abs = resolve(file)
  const content = readFileSync(abs, 'utf8')
  if (content.includes('@reference')) continue

  const rel = relative(dirname(abs), TARGET).replace(/\\/g, '/')
  const replaced = content.replace(
    /(<style\b[^>]*>)(\n)?/g,
    (_match, open) => `${open}\n@reference "${rel}";\n`,
  )

  if (replaced !== content) {
    writeFileSync(abs, replaced, 'utf8')
    changed += 1
  }
}

console.log(`Added @reference in ${changed} files`)
