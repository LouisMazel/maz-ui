import type { UseMediaQueryOptions } from './useMediaQuery.ts'
import { useMediaQuery } from './useMediaQuery.ts'

/**
 * Reactive `prefers-reduced-motion: reduce` preference of the user (`prefersReducedMotion`).
 *
 * @example
 * const { prefersReducedMotion } = useReducedMotion()
 */
export function useReducedMotion(options: UseMediaQueryOptions = {}) {
  const { matches, isSupported } = useMediaQuery('(prefers-reduced-motion: reduce)', options)

  return { prefersReducedMotion: matches, isSupported }
}
