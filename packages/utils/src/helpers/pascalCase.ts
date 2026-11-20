import { camelCase } from './camelCase.ts'
import { capitalize } from './capitalize.ts'

export function pascalCase(str: string) {
  if (str === str.toUpperCase()) {
    if (str.includes('-')) {
      return str.toLowerCase().split('-').map(capitalize).join('')
    }
    if (str.includes('_')) {
      return str.toLowerCase().split('_').map(capitalize).join('')
    }
    if (str.includes(' ')) {
      return str.toLowerCase().split(' ').map(capitalize).join('')
    }
  }

  if (str.includes('-')) {
    return str.toLowerCase().split('-').map(capitalize).join('')
  }

  if (str.includes('_')) {
    return str.toLowerCase().split('_').map(capitalize).join('')
  }

  if (str.includes(' ')) {
    return str.toLowerCase().split(' ').map(capitalize).join('')
  }

  return capitalize(camelCase(str))
}
