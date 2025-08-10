import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { truthyFilter } from '@maz-ui/utils/helpers/truthyFilter'
import { computed, onMounted, ref, toValue, watch } from 'vue'

export interface UseMutationObserverOptions extends MutationObserverInit {
  internalWindow?: Window | undefined
}

/**
 * Watch for changes into DOM element.
 */
export function useMutationObserver(
  target: MaybeRefOrGetter<HTMLElement | SVGElement | ComponentPublicInstance | undefined | null>,
  callback: MutationCallback,
  options: UseMutationObserverOptions = {},
) {
  const {
    internalWindow = isClient() ? globalThis : undefined,
    ...mutationOptions
  } = options
  let observer: MutationObserver | undefined

  const isSupported = ref(false)

  onMounted(() => {
    isSupported.value = (internalWindow && 'MutationObserver' in internalWindow) ?? false
  })

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const targets = computed(() => {
    const value = toValue(target)

    let element: HTMLElement | SVGElement | undefined | null
    if (value && '$el' in value)
      element = value.$el

    else if (value)
      element = value

    return new Set([element].filter(truthyFilter))
  })

  const stopWatch = watch(
    targets,
    (newTargets) => {
      cleanup()

      if (isSupported.value && newTargets.size) {
        observer = new MutationObserver(callback)
        newTargets.forEach(el => observer!.observe(el, mutationOptions))
      }
    },
    { immediate: true, flush: 'post' },
  )

  const takeRecords = () => {
    return observer?.takeRecords()
  }

  const stop = () => {
    stopWatch()
    cleanup()
  }

  return {
    isSupported,
    stop,
    takeRecords,
  }
}

export type UseMutationObserverReturn = ReturnType<typeof useMutationObserver>
