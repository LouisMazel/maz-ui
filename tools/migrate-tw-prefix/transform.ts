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
  // The token parser (transformClassToken) already protects `maz-ui` and
  // `maz-ui/...` strings, so we can safely scan the whole file — this catches
  // dynamic class names returned from script-block computed properties such as
  //   return 'maz-text-sm'
  // while leaving imports like `from 'maz-ui/components'` untouched.
  return transformText(content)
}

export function transformCssFile(content: string): string {
  return transformText(content)
}
