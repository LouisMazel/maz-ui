const STOPWORDS = new Set([
  'a',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'by',
  'can',
  'create',
  'do',
  'does',
  'for',
  'from',
  'get',
  'how',
  'i',
  'in',
  'into',
  'is',
  'it',
  'its',
  'make',
  'me',
  'my',
  'need',
  'of',
  'on',
  'or',
  'some',
  'that',
  'the',
  'this',
  'to',
  'use',
  'using',
  'want',
  'way',
  'what',
  'when',
  'which',
  'with',
  'you',
  'your',
  'maz',
  'ui',
  'vue',
  'nuxt',
])

/** Light English stemmer: plurals, `-ing` and `-ed`. Keeps words of 4 letters or less untouched. */
export function stem(term: string): string {
  if (term.length <= 4 || /\d/.test(term))
    return term

  if (term.endsWith('ies'))
    return `${term.slice(0, -3)}y`
  if (/(?:ch|sh|x|ss)es$/.test(term))
    return term.slice(0, -2)
  if (term.endsWith('s') && !term.endsWith('ss') && !term.endsWith('us') && !term.endsWith('is'))
    return term.slice(0, -1)
  if (term.endsWith('ing') && term.length > 6)
    return term.slice(0, -3)
  if (term.endsWith('ed') && term.length > 5)
    return term.slice(0, -2)

  return term
}

/**
 * Splits text into raw words. Compound identifiers produce both the joined
 * form and their parts: `MazInputPhoneNumber` gives `mazinputphonenumber`,
 * `maz`, `input`, `phone`, `number`.
 */
export function tokenize(text: string): string[] {
  const tokens: string[] = []

  for (const word of text.split(/[^\w$-]+|_+/)) {
    if (!word)
      continue

    const parts = word
      .replaceAll(/([a-z])(\d)/gi, '$1 $2')
      .replaceAll(/([a-z\d])([A-Z])/g, '$1 $2')
      .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .split(/[\s-]+/)
      .filter(Boolean)

    if (parts.length > 1)
      tokens.push(word.replaceAll('-', ''))

    tokens.push(...parts)
  }

  return tokens
}

/** Normalizes a token for indexing and querying, or returns `null` to drop it */
export function processTerm(term: string): string | null {
  const lower = term.toLowerCase().replaceAll('$', '')

  if (lower.length < 2 || STOPWORDS.has(lower))
    return null

  return stem(lower)
}

export function analyze(text: string): string[] {
  return tokenize(text)
    .map(processTerm)
    .filter((term): term is string => term !== null)
}
