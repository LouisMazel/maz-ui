const LOWER_UPPER = /([a-z])([A-Z])/g
const CONSECUTIVE_UPPER = /([A-Z])([A-Z][a-z])/g
const SPACES_OR_UNDERSCORES = /[\s_]+/g
const MULTIPLE_DASHES = /-+/g
const LEADING_TRAILING_DASH = /(^-)|(-$)/g

export function kebabCase(str: string): string {
  return str
    .replace(LOWER_UPPER, '$1-$2')
    .replace(CONSECUTIVE_UPPER, '$1-$2')
    .replace(SPACES_OR_UNDERSCORES, '-')
    .toLowerCase()
    .replace(MULTIPLE_DASHES, '-')
    .replace(LEADING_TRAILING_DASH, '')
}
