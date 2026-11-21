import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { getCurrentScope, onScopeDispose, reactive, readonly, ref, toValue, watch } from 'vue'

export type ScrollTarget = HTMLElement | Window | Document | ComponentPublicInstance | undefined | null

export interface ScrollEdges {
  top: boolean
  bottom: boolean
  left: boolean
  right: boolean
}

export interface UseScrollOptions {
  /**
   * Distance in pixels from an edge at which `arrivedState` is already `true`: a number for every edge, or one per edge
   * @default 0
   */
  offset?: number | Partial<Record<keyof ScrollEdges, number>>
  /**
   * Time in milliseconds without scroll after which `isScrolling` goes back to `false`
   * @default 200
   */
  idle?: number
  /** Called on each scroll, at most once per frame */
  onScroll?: (event: Event) => void
  /** Called when the scroll stops, after `idle` */
  onStop?: () => void
}

function toElement(value: ScrollTarget): HTMLElement | Window | undefined {
  if (!value)
    return undefined

  if ('$el' in value)
    return value.$el as HTMLElement

  return value instanceof Document
    ? value.defaultView ?? undefined
    : value
}

function isWindow(target: HTMLElement | Window): target is Window {
  return 'scrollY' in target
}

/**
 * Scroll position, direction and edges of the page (by default) or of a scrollable element: show a "back to top"
 * button after some pixels, hide a header while scrolling down, know when the end of a list is reached.
 */
export function useScroll(target: MaybeRefOrGetter<ScrollTarget> = isClient() ? globalThis.window : undefined, { offset = 0, idle = 200, onScroll, onStop }: UseScrollOptions = {}) {
  const x = ref(0)
  const y = ref(0)
  const isScrolling = ref(false)
  const arrivedState = reactive<ScrollEdges>({ top: true, bottom: false, left: true, right: false })
  const directions = reactive<ScrollEdges>({ top: false, bottom: false, left: false, right: false })
  const offsets = typeof offset === 'number'
    ? { top: offset, bottom: offset, left: offset, right: offset }
    : { top: 0, bottom: 0, left: 0, right: 0, ...offset }

  let frame: number | undefined
  let idleTimer: ReturnType<typeof setTimeout> | undefined
  let element: HTMLElement | Window | undefined

  /** Reads the position and the edges of the target */
  function measure() {
    if (!element)
      return

    const box = isWindow(element)
      ? element.document.documentElement
      : element
    const left = isWindow(element) ? element.scrollX : element.scrollLeft
    const top = isWindow(element) ? element.scrollY : element.scrollTop
    const width = isWindow(element) ? element.innerWidth : element.clientWidth
    const height = isWindow(element) ? element.innerHeight : element.clientHeight

    directions.left = left < x.value
    directions.right = left > x.value
    directions.top = top < y.value
    directions.bottom = top > y.value
    x.value = left
    y.value = top
    arrivedState.left = left <= offsets.left
    arrivedState.right = left + width >= box.scrollWidth - offsets.right - 1
    arrivedState.top = top <= offsets.top
    arrivedState.bottom = top + height >= box.scrollHeight - offsets.bottom - 1
  }

  function stopScrolling() {
    isScrolling.value = false
    directions.top = false
    directions.bottom = false
    directions.left = false
    directions.right = false
    onStop?.()
  }

  function onScrollEvent(event: Event) {
    isScrolling.value = true
    clearTimeout(idleTimer)
    idleTimer = setTimeout(stopScrolling, idle)

    if (frame !== undefined)
      return

    frame = requestAnimationFrame(() => {
      frame = undefined
      measure()
      onScroll?.(event)
    })
  }

  function cleanup() {
    element?.removeEventListener('scroll', onScrollEvent)
    element = undefined

    if (frame !== undefined)
      cancelAnimationFrame(frame)

    frame = undefined
    clearTimeout(idleTimer)
  }

  const stopWatch = watch(() => toElement(toValue(target)), (current) => {
    cleanup()

    if (!current)
      return

    element = current
    element.addEventListener('scroll', onScrollEvent, { passive: true })
    measure()
    directions.bottom = false
    directions.right = false
  }, { immediate: true, flush: 'post' })

  /** Scrolls the target to a position, smoothly by default */
  function scrollTo({ top, left, behavior = 'smooth' }: { top?: number, left?: number, behavior?: ScrollBehavior }) {
    element?.scrollTo({ top, left, behavior })
  }

  function scrollToTop(behavior: ScrollBehavior = 'smooth') {
    scrollTo({ top: 0, behavior })
  }

  function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    if (!element)
      return

    const box = isWindow(element)
      ? element.document.documentElement
      : element

    scrollTo({ top: box.scrollHeight, behavior })
  }

  function stop() {
    stopWatch()
    cleanup()
  }

  if (getCurrentScope())
    onScopeDispose(stop)

  return {
    /** Horizontal position in pixels */
    x: readonly(x),
    /** Vertical position in pixels */
    y: readonly(y),
    /** The user is scrolling: `false` after `idle` milliseconds without scroll */
    isScrolling: readonly(isScrolling),
    /** The target is at an edge (within `offset`): `arrivedState.bottom` for the end of a list */
    arrivedState: readonly(arrivedState),
    /** The current scroll direction: `directions.bottom` while scrolling down, all `false` when it stops */
    directions: readonly(directions),
    /** Reads the position again, after a change of the content */
    measure,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    stop,
  }
}

export type UseScrollReturn = ReturnType<typeof useScroll>
