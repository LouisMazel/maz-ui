import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'glob'

// In v5 the --maz-* and derived component --m-* CSS variables are emitted as
// complete `hsl(...)` values. The v4 pattern `hsl(var(--X))` nests hsl() calls
// and breaks, so we rewrite every occurrence:
//
//   hsl(var(--maz-X))                              -> var(--maz-X)
//   hsl(var(--maz-X) / <alpha>)                    -> color-mix(in srgb, var(--maz-X) <alpha>, transparent)
//
// Inside Tailwind v4 arbitrary values we use the new shorthand so utilities
// stay parseable:
//
//   maz:bg-[hsl(var(--maz-X))]                     -> maz:bg-(--maz-X)
//   maz:bg-[hsl(var(--maz-X) / <alpha>)]           -> maz:bg-(--maz-X)/<alpha>   (alpha must be numeric)
//   maz:text-[var(--maz-X)]                        -> maz:text-(--maz-X)
//
// Template literals like `hsl(var(--maz-${color}))` are handled the same way.

const MAZ_VAR = String.raw`var\(--(?:maz|m)-[\w-]+\)`
const DYNAMIC_VAR = String.raw`var\(--(?:maz|m)-\$\{[^}]+\}(?:-[\w-]+)?(?:-\$\{[^}]+\})?\)`
const ANY_VAR = `(?:${MAZ_VAR}|${DYNAMIC_VAR})`

// Inside Tailwind arbitrary values — these must be rewritten first so we can
// collapse `[hsl(var(--X))]` to `(--X)` before the generic rule touches them.
const ARB_BG_ALPHA = new RegExp(String.raw`\b(maz:(?:[\w-]+:)*[\w-]+-)\[hsl\(\s*(${ANY_VAR})\s*\/\s*(\d+(?:\.\d+)?)%?\s*\)\]`, 'g')
const ARB_BG_NO_ALPHA = new RegExp(String.raw`\b(maz:(?:[\w-]+:)*[\w-]+-)\[hsl\(\s*(${ANY_VAR})\s*\)\]`, 'g')
const ARB_BG_PLAIN_VAR = new RegExp(String.raw`\b(maz:(?:[\w-]+:)*[\w-]+-)\[(${ANY_VAR})\]`, 'g')

// Generic hsl() wraps outside of Tailwind arbitrary values.
const WITH_ALPHA = new RegExp(String.raw`hsl\(\s*(${ANY_VAR})\s*\/\s*([^)]+?)\s*\)`, 'g')
const NO_ALPHA = new RegExp(String.raw`hsl\(\s*(${ANY_VAR})\s*\)`, 'g')

const files = await glob([
  'packages/lib/src/**/*.{vue,ts,css}',
  'packages/lib/tests/specs/**/*.ts',
  'packages/themes/src/**/*.{ts,css}',
  'apps/vue-app/src/**/*.{vue,ts,css}',
  'apps/nuxt-app/src/**/*.{vue,ts,css}',
  'apps/docs/.vitepress/**/*.{vue,ts,css,mts}',
  'apps/docs/src/**/*.{vue,ts,css,md}',
  'apps/docs/components/**/*.{vue,ts}',
])

let changed = 0
for (const f of files) {
  const before = readFileSync(f, 'utf8')

  const after = before
    // Arbitrary-value shortcuts first (nested; collapse to v4 paren form).
    .replace(ARB_BG_ALPHA, (_, prefix, v, alpha) => `${prefix}(${v.slice(4, -1)})/${alpha}`)
    .replace(ARB_BG_NO_ALPHA, (_, prefix, v) => `${prefix}(${v.slice(4, -1)})`)
    .replace(ARB_BG_PLAIN_VAR, (_, prefix, v) => `${prefix}(${v.slice(4, -1)})`)
    // Plain hsl(var(…)) wraps.
    .replace(WITH_ALPHA, (_, v, alpha) => `color-mix(in srgb, ${v} ${alpha}, transparent)`)
    .replace(NO_ALPHA, (_, v) => v)

  if (after !== before) {
    writeFileSync(f, after, 'utf8')
    changed += 1
  }
}

console.log(`Rewrote hsl(var(...)) wraps in ${changed} files`)
