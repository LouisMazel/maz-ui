import { pascalCaseToKebabCase } from '@/utils'

export default (q) => {
  if (!q) return ''
  return pascalCaseToKebabCase(q)
}
