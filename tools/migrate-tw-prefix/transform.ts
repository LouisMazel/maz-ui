const UTILITY_RENAMES: Record<string, string> = {
  'rounded-sm': 'rounded-xs',
  'outline-none': 'outline-hidden',
  'backdrop-blur-sm': 'backdrop-blur-xs',
  'bg-gradient-to-r': 'bg-linear-to-r',
  'bg-gradient-to-l': 'bg-linear-to-l',
  'bg-gradient-to-t': 'bg-linear-to-t',
  'bg-gradient-to-b': 'bg-linear-to-b',
  'bg-gradient-to-tr': 'bg-linear-to-tr',
  'bg-gradient-to-tl': 'bg-linear-to-tl',
  'bg-gradient-to-br': 'bg-linear-to-br',
  'bg-gradient-to-bl': 'bg-linear-to-bl',
  'shadow': 'shadow-sm',
}

const TOKEN_PARSE = /^(!?)((?:[\w-]+:)*)(!?)maz-(.+)$/

const TEXT_SCAN = /(?<![\w-])(?:!)?(?:[\w-]+:)*(?:!)?maz-[a-zA-Z][\w\-\/.[\]]*(?![\w-])/g

export function transformClassToken(token: string): string {
  const match = token.match(TOKEN_PARSE)
  if (!match) return token

  const [, importantPrefix, variants, importantMid, utility] = match

  if (utility === 'ui' || utility.startsWith('ui/')) return token

  const renamedUtility = UTILITY_RENAMES[utility] ?? utility
  const isImportant = Boolean(importantPrefix || importantMid)
  const variantPart = variants ?? ''

  return `maz:${variantPart}${renamedUtility}${isImportant ? '!' : ''}`
}

export function transformText(text: string): string {
  return text.replace(TEXT_SCAN, match => transformClassToken(match))
}

const VUE_TEMPLATE = /(<template\b[^>]*>)([\s\S]*?)(<\/template>)/g
const VUE_STYLE = /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/g

export function transformVueFile(content: string): string {
  return content
    .replace(VUE_TEMPLATE, (_, open, inner, close) => `${open}${transformText(inner)}${close}`)
    .replace(VUE_STYLE, (_, open, inner, close) => `${open}${transformText(inner)}${close}`)
}

export function transformCssFile(content: string): string {
  return transformText(content)
}
