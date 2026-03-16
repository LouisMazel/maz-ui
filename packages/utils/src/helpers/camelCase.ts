const DASH_WORD_CHAR = /-(\w)/g

export function camelCase(str: string) {
  return str.replaceAll(DASH_WORD_CHAR, (_, c) => (c ? c.toUpperCase() : ''))
}
