export function camelCase(str: string) {
  return str.replaceAll(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}
