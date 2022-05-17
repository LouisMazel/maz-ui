export const capitalize = (value: string): string => {
  if (!value) return ''

  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}
