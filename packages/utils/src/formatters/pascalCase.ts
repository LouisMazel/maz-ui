import { camelCase } from './camelCase'
import { capitalize } from './capitalize'

export function pascalCase(str: string) {
  return capitalize(camelCase(str))
}
