function isPrimitive(value: unknown): boolean {
  return (
    value === null
    || value === undefined
    || typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
    || typeof value === 'symbol'
    || typeof value === 'bigint'
  )
}

function isEqualArrays(a: unknown[], b: unknown[]): boolean {
  if (a.length !== b.length) {
    return false
  }
  for (const [i, element] of a.entries()) {
    if (!isEqual(element, b[i])) {
      return false
    }
  }
  return true
}

function isEqualObjects(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (!keysB.includes(key) || !isEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}

export function isEqual(a: unknown, b: unknown): boolean {
  if (isPrimitive(a) || isPrimitive(b)) {
    return a === b
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (typeof a !== typeof b) {
    return false
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return isEqualArrays(a, b)
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return isEqualObjects(a as Record<string, unknown>, b as Record<string, unknown>)
  }

  return false
}
