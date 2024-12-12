import { camelCase } from '@filters/camelCase'
import { capitalize } from '@filters/capitalize'

export function pascalCase(str: string) {
  return capitalize(camelCase(str))
}
