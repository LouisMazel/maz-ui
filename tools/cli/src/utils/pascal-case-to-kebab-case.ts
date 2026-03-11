const pascalCaseToKebabCaseRegex = /([\da-z])([A-Z])/g

export function pascalCaseToKebabCase(value: string): string {
  return value.replaceAll(pascalCaseToKebabCaseRegex, '$1-$2').toLowerCase()
}
