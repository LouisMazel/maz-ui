import type { MaybeRefOrGetter } from 'vue'
import type { UseWindowOptions } from './useWindow.ts'
import { computed, getCurrentInstance, onMounted, ref, toValue, watch } from 'vue'
import { useEventListener } from './useEventListener.ts'
import { useWindow } from './useWindow.ts'

export interface UseMediaQueryOptions extends UseWindowOptions {
  /**
   * Value on the server and, inside a component, until it is mounted (same markup as the server on hydration)
   * @default false
   */
  initialValue?: boolean
}

/**
 * Reactive result of a CSS media query (`matches`), the query can be a ref or a getter.
 *
 * @example
 * const { matches } = useMediaQuery('(min-width: 768px)')
 * const { matches: isLandscape } = useMediaQuery(() => '(orientation: landscape)')
 */
export function useMediaQuery(query: MaybeRefOrGetter<string>, options: UseMediaQueryOptions = {}) {
  const { initialValue = false, ...windowOptions } = options
  const { window } = useWindow(windowOptions)

  const isSupported = typeof window?.matchMedia === 'function'
  const matches = ref(initialValue)

  const mediaQueryList = computed(() => isSupported ? window!.matchMedia(toValue(query)) : undefined)

  function update() {
    matches.value = mediaQueryList.value?.matches ?? initialValue
  }

  if (getCurrentInstance()) {
    onMounted(() => watch(mediaQueryList, update, { immediate: true }))
  }
  else {
    watch(mediaQueryList, update, { immediate: true })
  }

  useEventListener(mediaQueryList, 'change', update)

  return { matches, isSupported }
}
