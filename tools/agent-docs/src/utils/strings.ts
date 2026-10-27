export function kebabToPascal(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

export function kebabToCamel(value: string): string {
  const pascal = kebabToPascal(value)

  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

export function pascalToKebab(value: string): string {
  return value
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/** Splits `MazInputPhoneNumber` or `use-form-validator` into lowercase words */
export function splitWords(value: string): string[] {
  return value
    .replaceAll(/([a-z\d])([A-Z])/g, '$1 $2')
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^a-z\d]+/i)
    .filter(Boolean)
    .map(word => word.toLowerCase())
}

export function unique<T>(values: Iterable<T>): T[] {
  return [...new Set(values)]
}

export function truncate(value: string, max: number): string {
  if (value.length <= max)
    return value

  return `${value.slice(0, max - 3).trimEnd()}...`
}
