/** `x-mark`, `flag-fr`, `app:hero`: what `MazIcon` resolves as a name */
export const ICON_NAME_PATTERN = /^[a-z\d]+(?:-[a-z\d]+)*(?::[a-z\d]+(?:-[a-z\d]+)*)?$/i

/** A key or a prop whose name contains `icon`: `icon:`, `startIcon:`, `"start-icon":`, `dropdownIcon:` */
const ICON_KEY_PATTERN = /(?:^|[^\w$-])(["']?)([\w$-]*icon[\w$-]*)\1\s*:(?!:)/gi
/** An attribute of a template in a string (runtime templates, markdown): `icon="x-mark"`, `:start-icon="'moon'"` */
const ICON_ATTRIBUTE_PATTERN = /icon[\w-]*\s*=\s*\\?(?:"([^"\\]*)\\?"|'([^'\\]*)\\?')/gi
/** A variable whose name contains `icon`: `const icon = dark ? 'moon' : 'sun'`, `menuIcon.value = 'x-mark'` */
const ICON_ASSIGNMENT_PATTERN = /(?:^|[^\w$-])[\w$]*icon[\w$]*(?:\.value)?\s*=(?![=>])/gi
/** A line break ends an assignment, unless the expression goes on (`? 'moon'`, `|| 'x-mark'`) */
const CONTINUATION_PATTERN = /^\s*(?:[?:]|\|\||&&)/
const STRING_PATTERN = /'([^'\\\n]*)'|"([^"\\\n]*)"|`([^`\\$]*)`/g
/** The longest expression read after a key: a value that does not end is not an icon */
const MAX_EXPRESSION_LENGTH = 2000

const OPENING = new Set(['(', '[', '{'])
const CLOSING = new Set([')', ']', '}'])
const QUOTES = new Set(['"', '\'', '`'])

function skipString(code: string, start: number): number {
  const quote = code[start]
  let index = start + 1

  while (index < code.length && code[index] !== quote) {
    index += code[index] === '\\'
      ? 2
      : 1
  }

  return index
}

/**
 * The value of a key: everything up to the `,`, `;` or closing bracket of its level. With `untilLineBreak` (the
 * value of an assignment), a line break of its level ends it too.
 */
function readExpression(code: string, start: number, untilLineBreak = false): string {
  const end = Math.min(code.length, start + MAX_EXPRESSION_LENGTH)
  let depth = 0
  let index = start

  function endsAt(char: string): boolean {
    if (depth > 0)
      return false
    if (char === ',' || char === ';')
      return true
    return untilLineBreak && char === '\n' && index > start && !CONTINUATION_PATTERN.test(code.slice(index + 1, index + 80))
  }

  while (index < end) {
    const char = code[index]!

    if (QUOTES.has(char)) {
      index = skipString(code, index) + 1
      continue
    }
    if (CLOSING.has(char) && depth === 0)
      break
    if (endsAt(char))
      break

    if (OPENING.has(char))
      depth++
    else if (CLOSING.has(char))
      depth--
    index++
  }

  return code.slice(start, index)
}

function* readStrings(expression: string): Generator<string> {
  for (const match of expression.matchAll(STRING_PATTERN))
    yield match[1] ?? match[2] ?? match[3]!
}

interface ContextPatterns {
  key: RegExp
  assignment: RegExp
  attribute: RegExp
}

const ICON_PATTERNS: ContextPatterns = {
  key: ICON_KEY_PATTERN,
  assignment: ICON_ASSIGNMENT_PATTERN,
  attribute: ICON_ATTRIBUTE_PATTERN,
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** `startSvg` is also `start-svg` (an attribute of a template) and `"start-svg"` (a key of compiled code) */
function toKeyForms(key: string): string[] {
  const kebab = key.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()
  const camel = key.replace(/-([a-z\d])/g, (_, char: string) => char.toUpperCase())
  return [
    ...new Set([key, kebab, camel]),
  ]
}

const keyPatternsCache = new Map<string, ContextPatterns>()

/** The patterns of the exact `keys` (`name`, `svg`): the same contexts as the keys whose name contains `icon` */
function createKeyPatterns(keys: readonly string[]): ContextPatterns {
  const cacheKey = keys.join(',')
  const cached = keyPatternsCache.get(cacheKey)
  if (cached)
    return cached

  const alternatives = keys.flatMap(toKeyForms).map(escapeRegExp).join('|')
  const patterns = {
    key: new RegExp(`(?:^|[^\\w$-])(["']?)(${alternatives})\\1\\s*:(?!:)`, 'g'),
    assignment: new RegExp(`(?:^|[^\\w$-])(?:${alternatives})(?:\\.value)?\\s*=(?![=>])`, 'g'),
    attribute: new RegExp(`(?<![\\w$-])(?:${alternatives})\\s*=\\s*\\\\?(?:"([^"\\\\]*)\\\\?"|'([^'\\\\]*)\\\\?')`, 'g'),
  }
  keyPatternsCache.set(cacheKey, patterns)
  return patterns
}

export interface IconScan {
  /** Strings that look like icon names, in an icon context or prefixed */
  names: Set<string>
  /** The names written with a `~` (`'~x-mark'`), without it: loaded when they are displayed */
  lazyNames: Set<string>
  /** The code has a key, a variable or an attribute whose name contains `icon`: it can hold a name built at runtime */
  hasIconContext: boolean
}

/** The strings of the values of the keys, variables and attributes matched by the patterns */
function readIconContexts(code: string, patterns: ContextPatterns, values: string[]): boolean {
  let found = false

  for (const match of code.matchAll(patterns.key)) {
    found = true
    values.push(...readStrings(readExpression(code, match.index + match[0].length)))
  }

  for (const match of code.matchAll(patterns.assignment)) {
    found = true
    values.push(...readStrings(readExpression(code, match.index + match[0].length, true)))
  }

  for (const match of code.matchAll(patterns.attribute)) {
    found = true
    const value = match[1] ?? match[2]!
    values.push(value, ...readStrings(value))
  }

  return found
}

/**
 * The icon names a file uses. Not every string: only the values of the keys, variables and attributes whose name
 * contains `icon` (`icon: 'x-mark'`, `startIcon: dark ? 'moon' : 'sun'`, `const icon = 'moon'`, `icon="x-mark"`), and
 * every string with one of the `prefixes` (`'app:hero'`, `'~app:hero'`). With `keys` (`['name']`), the values of these exact keys,
 * variables and attributes too. The caller keeps the names it knows.
 */
export function scanIconNames(code: string, prefixes: readonly string[] = [], keys: readonly string[] = []): IconScan {
  const names = new Set<string>()
  const lazyNames = new Set<string>()
  const candidates: string[] = []
  const hasIconKeys = /icon/i.test(code) && readIconContexts(code, ICON_PATTERNS, candidates)
  const hasKeys = keys.length > 0 && readIconContexts(code, createKeyPatterns(keys), candidates)
  const hasIconContext = hasIconKeys || hasKeys

  for (const prefix of prefixes) {
    if (code.includes(`${prefix}:`)) {
      candidates.push(...[
        ...readStrings(code),
      ].filter(value => value.startsWith(`${prefix}:`) || value.startsWith(`~${prefix}:`)))
    }
  }

  for (const value of candidates) {
    if (ICON_NAME_PATTERN.test(value))
      names.add(value)
    else if (value.startsWith('~') && ICON_NAME_PATTERN.test(value.slice(1)))
      lazyNames.add(value.slice(1))
  }

  return { names, lazyNames, hasIconContext }
}
