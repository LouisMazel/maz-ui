import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { truthyFilter } from '@maz-ui/utils/helpers/truthyFilter'
import { computed, getCurrentScope, onScopeDispose, readonly, ref, shallowReadonly, shallowRef, toValue, watch } from 'vue'

export type ResizeTarget = Element | ComponentPublicInstance | undefined | null

export interface UseResizeObserverOptions {
  /**
   * Box measured by the observer and by `width` and `height`
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions
  /**
   * Starts observing right away, else call `resume()`
   * @default true
   */
  immediate?: boolean
}

function toElement(value: ResizeTarget): Element | undefined {
  if (!value)
    return undefined

  return '$el' in value
    ? value.$el as Element
    : value
}

function boxSize(entry: ResizeObserverEntry, box: ResizeObserverBoxOptions) {
  const sizes = {
    'border-box': entry.borderBoxSize,
    'content-box': entry.contentBoxSize,
    'device-pixel-content-box': entry.devicePixelContentBoxSize,
  }[box]
  const size = sizes?.[0]

  return size
    ? { width: size.inlineSize, height: size.blockSize }
    : { width: entry.contentRect.width, height: entry.contentRect.height }
}

/**
 * Tells when the size of one or several elements changes (a chart, a sliding indicator, a text that truncates),
 * with the `width` and `height` of the first one. Stops on unmount, does nothing on the server.
 */
export function useResizeObserver(
  target: MaybeRefOrGetter<ResizeTarget> | MaybeRefOrGetter<ResizeTarget>[],
  callback?: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void,
  { box = 'content-box', immediate = true }: UseResizeObserverOptions = {},
) {
  const isSupported = isClient() && 'ResizeObserver' in globalThis
  const isActive = ref(immediate)
  const width = ref(0)
  const height = ref(0)
  const entry = shallowRef<ResizeObserverEntry>()

  let observer: ResizeObserver | undefined

  const targets = computed(() => {
    const values = Array.isArray(target)
      ? target
      : [target]

    return values.map(value => toElement(toValue(value))).filter(truthyFilter)
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
    [targets, isActive],
    ([elements, active]) => {
      disconnect()

      if (!isSupported || !active || elements.length === 0)
        return

      observer = new ResizeObserver((entries, current) => {
        const first = entries.find(item => item.target === elements[0])

        entry.value = entries.at(-1)

        if (first) {
          const size = boxSize(first, box)

          width.value = size.width
          height.value = size.height
        }

        callback?.(entries, current)
      })

      for (const element of elements) observer.observe(element, { box })
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
    /** The browser has `ResizeObserver` */
    isSupported,
    /** Width of the first target, in pixels, of the `box` option */
    width: readonly(width),
    /** Height of the first target, in pixels, of the `box` option */
    height: readonly(height),
    /** The last entry: target, sizes of every box */
    entry: shallowReadonly(entry),
    /** Observing: `false` after `pause()` or `stop()` */
    isActive: readonly(isActive),
    pause,
    resume,
    /** Stops for good: the observer is not created again */
    stop,
  }
}

export type UseResizeObserverReturn = ReturnType<typeof useResizeObserver>
