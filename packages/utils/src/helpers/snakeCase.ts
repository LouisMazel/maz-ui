const LOWER_UPPER = /([a-z])([A-Z])/g
const CONSECUTIVE_UPPER = /([A-Z])([A-Z][a-z])/g
const SPACES_OR_DASHES = /[\s-]+/g
const MULTIPLE_UNDERSCORES = /_+/g
const LEADING_TRAILING_UNDERSCORE = /(^_)|(_$)/g

export function snakeCase(str: string): string {
  return str
    .replace(LOWER_UPPER, '$1_$2')
    .replace(CONSECUTIVE_UPPER, '$1_$2')
    .replace(SPACES_OR_DASHES, '_')
    .toLowerCase()
    .replace(MULTIPLE_UNDERSCORES, '_')
    .replace(LEADING_TRAILING_UNDERSCORE, '')
}
