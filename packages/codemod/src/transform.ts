// v3 → v4 utility renames, applied by the codemod before the prefix transform.
// Source: https://tailwindcss.com/docs/upgrade-guide#renamed-utilities.
// Note: bare `rounded` is NOT renamed here because maz-ui maps it to
// `var(--maz-radius)` in both v3 and v4 (identical semantic in both versions).
const UTILITY_RENAMES: Record<string, string> = {
  'rounded-sm': 'rounded-xs',
  'outline-none': 'outline-hidden',
  'shadow': 'shadow-sm',
  'shadow-sm': 'shadow-xs',
  'drop-shadow': 'drop-shadow-sm',
  'drop-shadow-sm': 'drop-shadow-xs',
  'blur': 'blur-sm',
  'blur-sm': 'blur-xs',
  'backdrop-blur': 'backdrop-blur-sm',
  'backdrop-blur-sm': 'backdrop-blur-xs',
  'ring': 'ring-3',
  'bg-gradient-to-r': 'bg-linear-to-r',
  'bg-gradient-to-l': 'bg-linear-to-l',
  'bg-gradient-to-t': 'bg-linear-to-t',
  'bg-gradient-to-b': 'bg-linear-to-b',
  'bg-gradient-to-tr': 'bg-linear-to-tr',
  'bg-gradient-to-tl': 'bg-linear-to-tl',
  'bg-gradient-to-br': 'bg-linear-to-br',
  'bg-gradient-to-bl': 'bg-linear-to-bl',
}

const TOKEN_PARSE = /^(!?)((?:[\w-]+:)*)(!?)(-?)maz-(-?)(.+)$/

const TEXT_SCAN = /(?<![\w-])(?:!)?(?:[\w-]+:)*(?:!)?-?maz--?[a-zA-Z][\w\-\/]*(?:\[[^\]]+\][\w\-\/]*)*(?![\w-])/g

export function transformClassToken(token: string): string {
  const match = token.match(TOKEN_PARSE)
  if (!match) return token

  const [, importantPrefix, variants, importantMid, negBefore, negAfter, utility] = match

  if (utility === 'ui' || utility.startsWith('ui/')) return token

  const renamedUtility = UTILITY_RENAMES[utility] ?? utility
  const isImportant = Boolean(importantPrefix || importantMid)
  const isNegative = Boolean(negBefore || negAfter)
  const variantPart = variants ?? ''

  return `maz:${variantPart}${isNegative ? '-' : ''}${renamedUtility}${isImportant ? '!' : ''}`
}

export function transformText(text: string): string {
  return text.replace(TEXT_SCAN, match => transformClassToken(match))
}

export function transformVueFile(content: string): string {
  // The token parser protects `maz-ui` and `maz-ui/...` substrings, so we can
  // safely scan the whole file — this catches dynamic class names returned
  // from script-block computed properties while leaving imports alone.
  return transformText(content)
}

export function transformCssFile(content: string): string {
  return transformText(content)
}

// --- hsl(var(--X)) double-wrap elimination ---------------------------------
// In v5 the themes package emits --maz-* variables already wrapped in hsl(…).
// The v4 pattern hsl(var(--X)) nests the call and breaks, so we rewrite it.
// Derived component --m-* variables are always sourced from --maz-* so they
// inherit the wrapping and need the same treatment.

const MAZ_VAR = String.raw`var\(--(?:maz|m)-[\w-]+\)`
const DYNAMIC_VAR = String.raw`var\(--(?:maz|m)-\$\{[^}]+\}(?:-[\w-]+)?(?:-\$\{[^}]+\})?\)`
const ANY_VAR = `(?:${MAZ_VAR}|${DYNAMIC_VAR})`

const ARB_VALUE_ALPHA = new RegExp(
  String.raw`\b(maz:(?:[\w-]+:)*[\w-]+-)\[hsl\(\s*(${ANY_VAR})\s*\/\s*(\d+(?:\.\d+)?)%?\s*\)\]`,
  'g',
)
const ARB_VALUE_HSL = new RegExp(
  String.raw`\b(maz:(?:[\w-]+:)*[\w-]+-)\[hsl\(\s*(${ANY_VAR})\s*\)\]`,
  'g',
)
const ARB_VALUE_VAR = new RegExp(
  String.raw`\b(maz:(?:[\w-]+:)*[\w-]+-)\[(${ANY_VAR})\]`,
  'g',
)

const HSL_WITH_ALPHA = new RegExp(String.raw`hsl\(\s*(${ANY_VAR})\s*\/\s*([^)]+?)\s*\)`, 'g')
const HSL_NO_ALPHA = new RegExp(String.raw`hsl\(\s*(${ANY_VAR})\s*\)`, 'g')

export function transformHslVar(content: string): string {
  return content
    .replace(ARB_VALUE_ALPHA, (_, prefix, v, alpha) => `${prefix}(${v.slice(4, -1)})/${alpha}`)
    .replace(ARB_VALUE_HSL, (_, prefix, v) => `${prefix}(${v.slice(4, -1)})`)
    .replace(ARB_VALUE_VAR, (_, prefix, v) => `${prefix}(${v.slice(4, -1)})`)
    .replace(HSL_WITH_ALPHA, (_, v, alpha) => `color-mix(in srgb, ${v} ${alpha}, transparent)`)
    .replace(HSL_NO_ALPHA, (_, v) => v)
}

// --- @apply X !important → @apply X! per token -----------------------------

const APPLY_IMPORTANT = /@apply\s+([^;]+?)\s+!important\s*;/g

export function transformApplyImportant(content: string): string {
  return content.replace(APPLY_IMPORTANT, (_, classes: string) => {
    const tokens = classes.trim().split(/\s+/)
    const suffixed = tokens.map(t => (t.endsWith('!') ? t : `${t}!`))
    return `@apply ${suffixed.join(' ')};`
  })
}

// --- Orchestration ---------------------------------------------------------

export function transformFile(filename: string, content: string): string {
  const isVue = filename.endsWith('.vue')
  const isCss = filename.endsWith('.css')

  let out = content

  // 1. Rewrite @apply X !important before the prefix transform touches the
  //    tokens, so we don't leave a dangling "!important" keyword behind.
  if (isVue || isCss) {
    out = transformApplyImportant(out)
  }

  // 2. Rewrite Tailwind class tokens (maz-X → maz:X, renames, negatives, etc.).
  if (isVue) {
    out = transformVueFile(out)
  }
  else if (isCss) {
    out = transformCssFile(out)
  }
  else {
    // .ts, .tsx, .mts, .cts etc. — transform class-like strings uniformly.
    out = transformText(out)
  }

  // 3. Eliminate hsl(var(--X)) double-wraps once everything is on the maz:
  //    prefix.
  out = transformHslVar(out)

  return out
}
