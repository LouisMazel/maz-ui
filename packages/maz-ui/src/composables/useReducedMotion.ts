import type { UseMediaQueryOptions } from './useMediaQuery.ts'
import { computed, hasInjectionContext, inject } from 'vue'
import { MAZ_UI_CONTEXT_INJECTION_KEY } from '../utils/mazUiContext.ts'
import { resolveMotionOptions } from '../utils/motion.ts'
import { useMediaQuery } from './useMediaQuery.ts'

/**
 * Reactive `prefers-reduced-motion: reduce` preference of the user (`prefersReducedMotion`), and whether
 * the animations should be reduced (`shouldReduceMotion`): the preference, unless the `motion` option of
 * `MazUi` forces it (`'reduced'` or `'full'`).
 *
 * @example
 * const { shouldReduceMotion } = useReducedMotion()
 * element.animate(keyframes, { duration: shouldReduceMotion.value ? 0 : 200 })
 */
export function useReducedMotion(options: UseMediaQueryOptions = {}) {
  const { matches, isSupported } = useMediaQuery('(prefers-reduced-motion: reduce)', options)

  const context = hasInjectionContext() ? inject(MAZ_UI_CONTEXT_INJECTION_KEY, undefined) : undefined
  const { mode } = resolveMotionOptions(context?.motion)

  const shouldReduceMotion = computed(() => {
    if (mode === 'reduced')
      return true
    if (mode === 'full')
      return false

    return matches.value
  })

  return { prefersReducedMotion: matches, shouldReduceMotion, isSupported }
}
