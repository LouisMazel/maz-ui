import { camelCase } from './camelCase.js'
import { capitalize } from './capitalize.js'

export function pascalCase(str: string) {
  return capitalize(camelCase(str))
}
