export function camelCase(str: string) {
  return str.replaceAll(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function pascalCase(str: string) {
  return capitalize(camelCase(str))
}
