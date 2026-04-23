import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { glob } from 'glob'

// Target: packages/lib/src/tailwindcss/tailwind.css
const ROOT = resolve('packages/lib/src')
const TARGET = resolve(ROOT, 'tailwindcss/tailwind.css')

const files = await glob(['packages/lib/src/**/*.vue'])

let changed = 0
for (const file of files) {
  const abs = resolve(file)
  const content = readFileSync(abs, 'utf8')
  if (content.includes('@reference')) continue

  // Compute relative path from the file's directory to the target CSS
  const rel = relative(dirname(abs), TARGET).replace(/\\/g, '/')

  // Insert `@reference "..."` on the first line after each <style...> opener
  const replaced = content.replace(
    /(<style\b[^>]*>)(\n)?/g,
    (match, open, nl) => `${open}\n@reference "${rel}";\n`,
  )

  if (replaced !== content) {
    writeFileSync(abs, replaced, 'utf8')
    changed += 1
  }
}

console.log(`Added @reference in ${changed} Vue files`)
