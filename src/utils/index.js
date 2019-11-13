export const pascalCaseToKebabCase = (string) => string
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
  .toLowerCase()

export const replaceAll = (string, search, replacement) => {
  return string.replace(new RegExp(search, 'g'), replacement)
}
