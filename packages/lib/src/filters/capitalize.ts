export function capitalize(value: string): string {
  if (typeof value !== 'string')
    return ''

  return value.charAt(0).toUpperCase() + value.slice(1)
}
