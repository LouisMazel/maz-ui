const CAMEL_TO_KEBAB_RE = /([a-z])([A-Z])/g
const WHITESPACE_UNDERSCORE_RE = /[\s_]+/g

export function toKebabCase(input: string): string {
  return input
    .replaceAll(CAMEL_TO_KEBAB_RE, '$1-$2')
    .replaceAll(WHITESPACE_UNDERSCORE_RE, '-')
    .toLowerCase()
}
