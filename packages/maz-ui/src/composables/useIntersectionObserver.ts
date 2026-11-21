import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { truthyFilter } from '@maz-ui/utils/helpers/truthyFilter'
import { computed, getCurrentScope, onScopeDispose, readonly, ref, shallowReadonly, shallowRef, toValue, watch } from 'vue'

export type IntersectionTarget = Element | ComponentPublicInstance | undefined | null

export interface UseIntersectionObserverOptions {
  /**
   * Element whose box is the viewport of the observation (a scrollable list): the browser viewport by default
   */
  root?: MaybeRefOrGetter<IntersectionTarget | Document>
  /**
   * Margin around the root, to trigger before the element is visible: `'200px'` starts 200px before
   * @default '0px'
   */
  rootMargin?: string
  /**
   * Visible ratio (between 0 and 1) that triggers the callback, or a list of ratios
   * @default 0
   */
  threshold?: number | number[]
  /**
   * Stops observing after the first time the element is visible
   * @default false
   */
  once?: boolean
  /**
   * Starts observing right away, else call `resume()`
   * @default true
   */
  immediate?: boolean
}

function toElement(value: IntersectionTarget | Document): Element | Document | undefined {
  if (!value)
    return undefined

  return '$el' in value
    ? value.$el as Element
    : value
}

/**
 * Tells when one or several elements enter or leave the viewport (or a scrollable `root`): lazy content, animations,
 * the sentinel of an infinite list. Stops on unmount, does nothing on the server.
 */
export function useIntersectionObserver(
  target: MaybeRefOrGetter<IntersectionTarget> | MaybeRefOrGetter<IntersectionTarget>[],
  callback?: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void,
  { root, rootMargin = '0px', threshold = 0, once = false, immediate = true }: UseIntersectionObserverOptions = {},
) {
  const isSupported = isClient() && 'IntersectionObserver' in globalThis
  const isActive = ref(immediate)
  const isIntersecting = ref(false)
  const entry = shallowRef<IntersectionObserverEntry>()

  let observer: IntersectionObserver | undefined

  const targets = computed(() => {
    const values = Array.isArray(target)
      ? target
      : [target]

    return values.map(value => toElement(toValue(value)) as Element | undefined).filter(truthyFilter)
  })

  function disconnect() {
    observer?.disconnect()
    observer = undefined
  }

  function pause() {
    isActive.value = false
  }

  function resume() {
    isActive.value = true
  }

  const stopWatch = watch(
    [targets, () => toElement(toValue(root)), isActive],
    ([elements, rootElement, active]) => {
      disconnect()

      if (!isSupported || !active || elements.length === 0)
        return

      observer = new IntersectionObserver((entries, current) => {
        const last = entries.at(-1)

        entry.value = last
        isIntersecting.value = entries.some(item => item.isIntersecting)
        callback?.(entries, current)

        if (once && isIntersecting.value)
          pause()
      }, { root: rootElement, rootMargin, threshold })

      for (const element of elements) observer.observe(element)
    },
    { immediate: true, flush: 'post' },
  )

  function stop() {
    stopWatch()
    disconnect()
    isActive.value = false
  }

  if (getCurrentScope())
    onScopeDispose(stop)

  return {
    /** The browser has `IntersectionObserver` */
    isSupported,
    /** One of the targets is visible */
    isIntersecting: readonly(isIntersecting),
    /** The last entry: ratio, bounding boxes, time */
    entry: shallowReadonly(entry),
    /** Observing: `false` after `pause()`, `stop()` or a first intersection with `once` */
    isActive: readonly(isActive),
    pause,
    resume,
    /** Stops for good: the observer is not created again */
    stop,
  }
}

export type UseIntersectionObserverReturn = ReturnType<typeof useIntersectionObserver>
