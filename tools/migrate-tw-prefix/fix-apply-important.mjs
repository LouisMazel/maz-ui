import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'glob'

const files = await glob(['packages/lib/src/**/*.vue', 'packages/lib/src/**/*.css'])

let changed = 0
for (const f of files) {
  const before = readFileSync(f, 'utf8')
  // Match: @apply <classes> !important;
  // Rewrite each class token with a trailing ! and drop the !important keyword.
  const after = before.replace(
    /@apply\s+([^;]+?)\s+!important\s*;/g,
    (_, classes) => {
      const tokens = classes.trim().split(/\s+/)
      const suffixed = tokens.map((t) => (t.endsWith('!') ? t : `${t}!`))
      return `@apply ${suffixed.join(' ')};`
    },
  )
  if (after !== before) {
    writeFileSync(f, after, 'utf8')
    changed += 1
  }
}

console.log(`Rewrote @apply !important in ${changed} files`)
