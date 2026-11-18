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

export interface IconScan {
  /** Strings that look like icon names, in an icon context or prefixed */
  names: Set<string>
  /** The code has a key, a variable or an attribute whose name contains `icon`: it can hold a name built at runtime */
  hasIconContext: boolean
}

/** The strings of the values of the keys, variables and attributes whose name contains `icon` */
function readIconContexts(code: string): { found: boolean, values: string[] } {
  const values: string[] = []
  let found = false

  for (const match of code.matchAll(ICON_KEY_PATTERN)) {
    found = true
    values.push(...readStrings(readExpression(code, match.index + match[0].length)))
  }

  for (const match of code.matchAll(ICON_ASSIGNMENT_PATTERN)) {
    found = true
    values.push(...readStrings(readExpression(code, match.index + match[0].length, true)))
  }

  for (const match of code.matchAll(ICON_ATTRIBUTE_PATTERN)) {
    found = true
    const value = match[1] ?? match[2]!
    values.push(value, ...readStrings(value))
  }

  return { found, values }
}

/**
 * The icon names a file uses. Not every string: only the values of the keys, variables and attributes whose name
 * contains `icon` (`icon: 'x-mark'`, `startIcon: dark ? 'moon' : 'sun'`, `const icon = 'moon'`, `icon="x-mark"`), and
 * every string with one of the `prefixes` (`'app:hero'`). The caller keeps the names it knows.
 */
export function scanIconNames(code: string, prefixes: readonly string[] = []): IconScan {
  const names = new Set<string>()
  const { found: hasIconContext, values: candidates } = /icon/i.test(code)
    ? readIconContexts(code)
    : { found: false, values: [] }

  for (const prefix of prefixes) {
    if (code.includes(`${prefix}:`)) {
      candidates.push(...[
        ...readStrings(code),
      ].filter(value => value.startsWith(`${prefix}:`)))
    }
  }

  for (const value of candidates) {
    if (ICON_NAME_PATTERN.test(value))
      names.add(value)
  }

  return { names, hasIconContext }
}
