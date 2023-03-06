export function pascalCaseToKebabCase(value: string): string {
  return value.replace(/([\da-z])([A-Z])/g, '$1-$2').toLowerCase()
}
