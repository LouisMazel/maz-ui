const IDENT_CHAR = /[\w-]/
const HEX_DIGIT = /[\da-f]/i
const WHITESPACE = /\s/

/** Read a CSS identifier from `start`, resolving its escapes (`\:`, `\[`, `\31 `...) */
function readIdentifier(selector: string, start: number): { value: string, end: number } {
  let value = ''
  let index = start

  while (index < selector.length) {
    const char = selector[index]!

    if (char === '\\') {
      let hex = ''
      let cursor = index + 1
      while (hex.length < 6 && cursor < selector.length && HEX_DIGIT.test(selector[cursor]!)) {
        hex += selector[cursor]
        cursor++
      }

      if (hex) {
        value += String.fromCodePoint(Number.parseInt(hex, 16))
        index = cursor < selector.length && WHITESPACE.test(selector[cursor]!)
          ? cursor + 1
          : cursor
      }
      else {
        value += selector[index + 1] ?? ''
        index += 2
      }
      continue
    }

    if (!IDENT_CHAR.test(char) && char.charCodeAt(0) < 0x80)
      break

    value += char
    index++
  }

  return { value, end: index }
}

/** Index of the character that closes the string opened at `start` */
function skipString(selector: string, start: number): number {
  const quote = selector[start]
  let index = start + 1

  while (index < selector.length && selector[index] !== quote) {
    index += selector[index] === '\\'
      ? 2
      : 1
  }

  return index
}

/**
 * Call `visit` on each character of a selector outside of the strings, the escapes, the parentheses and the brackets.
 * `visit` returns the index to resume from, or `undefined` for the next character.
 */
function walkTopLevel(selector: string, visit: (index: number) => number | undefined) {
  let depth = 0
  let index = 0

  while (index < selector.length) {
    const char = selector[index]

    if (char === '\\') {
      index += 2
    }
    else if (char === '"' || char === '\'') {
      index = skipString(selector, index) + 1
    }
    else if (char === '(' || char === '[') {
      depth++
      index++
    }
    else if (char === ')' || char === ']') {
      depth--
      index++
    }
    else {
      index = (depth === 0
        ? visit(index)
        : undefined) ?? index + 1
    }
  }
}

/** Split a selector list on its top-level commas: `.a, :is(.b, .c)` gives `.a` and `:is(.b, .c)` */
export function splitSelectorList(selector: string): string[] {
  const selectors: string[] = []
  let start = 0

  walkTopLevel(selector, (index) => {
    if (selector[index] === ',') {
      selectors.push(selector.slice(start, index).trim())
      start = index + 1
    }

    return undefined
  })

  selectors.push(selector.slice(start).trim())

  return selectors.filter(Boolean)
}

/**
 * The classes a single selector requires on the page: the ones outside of any pseudo-class function. A class inside
 * `:not()`, `:is()`, `:where()` or `:has()` does not make the selector depend on it.
 */
export function getRequiredClasses(selector: string): string[] {
  const classes: string[] = []

  walkTopLevel(selector, (index) => {
    if (selector[index] !== '.')
      return undefined

    const { value, end } = readIdentifier(selector, index + 1)
    if (value)
      classes.push(value)

    return end
  })

  return classes
}
