import type { MaybeRef } from 'vue'
import { toValue } from 'vue'

/**
 * Freeze a value to prevent it from being modified
 */
export function freezeValue<T>(value: MaybeRef<T>): Readonly<T> {
  const rawValue = toValue(value)

  if (Array.isArray(rawValue)) {
    return Object.freeze([...rawValue]) as T
  }

  if (typeof rawValue === 'object' && rawValue !== null) {
    return Object.freeze({ ...rawValue })
  }

  return rawValue
}
