export function pascalCaseToKebabCase(value: string): string {
  return value.replaceAll(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()
}
