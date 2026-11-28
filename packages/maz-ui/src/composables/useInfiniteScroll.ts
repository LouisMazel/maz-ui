import type { MaybeRefOrGetter } from 'vue'
import type { IntersectionTarget } from './useIntersectionObserver.ts'
import { getCurrentScope, nextTick, onScopeDispose, readonly, ref, shallowRef } from 'vue'
import { useIntersectionObserver } from './useIntersectionObserver.ts'

export interface UseInfiniteScrollOptions {
  /**
   * Distance in pixels before the end of the list at which the next page is loaded
   * @default 200
   */
  distance?: number
  /**
   * Direction of the list: `horizontal` for a carousel or a row of cards
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal'
  /**
   * Returns `false` when every page is loaded: nothing is loaded anymore and `isFinished` is `true`
   */
  canLoadMore?: () => boolean
  /**
   * Scrollable element of the list, when the list scrolls inside it instead of the page
   */
  root?: MaybeRefOrGetter<IntersectionTarget | Document>
}

/**
 * Loads the next page of a list when its end gets close: put a sentinel element after the last item and pass it.
 * `loadMore` is never called twice at once, and again while the sentinel stays visible (a first page shorter than
 * the screen). A failed load stops until `load()` or `reset()`.
 */
export function useInfiniteScroll(
  sentinel: MaybeRefOrGetter<IntersectionTarget>,
  loadMore: () => unknown,
  { distance = 200, direction = 'vertical', canLoadMore = () => true, root }: UseInfiniteScrollOptions = {},
) {
  const isLoading = ref(false)
  const isFinished = ref(false)
  const error = shallowRef<unknown>()
  let stopped = false

  const { isIntersecting, stop: stopObserver } = useIntersectionObserver(sentinel, (entries) => {
    if (error.value === undefined && entries.some(entry => entry.isIntersecting))
      load()
  }, {
    root,
    rootMargin: direction === 'horizontal'
      ? `0px ${distance}px 0px 0px`
      : `0px 0px ${distance}px 0px`,
  })

  /** Loads the next page now, and the following ones while the sentinel stays visible */
  async function load() {
    if (isLoading.value)
      return

    error.value = undefined

    while (!isLoading.value) {
      if (!canLoadMore()) {
        isFinished.value = true
        return
      }

      isLoading.value = true

      try {
        await loadMore()
      }
      catch (caught) {
        error.value = caught
        return
      }
      finally {
        isLoading.value = false
      }

      // The new items are rendered: the sentinel is pushed down, unless the page is still too short
      await nextTick()
      await new Promise(resolve => requestAnimationFrame(resolve))

      if (stopped || !isIntersecting.value)
        return
    }
  }

  function stop() {
    stopped = true
    stopObserver()
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      stopped = true
    })
  }

  /** Starts again from the first page: after a new search or filter */
  function reset() {
    isFinished.value = false
    error.value = undefined

    if (isIntersecting.value)
      load()
  }

  return {
    /** A page is loading */
    isLoading: readonly(isLoading),
    /** `canLoadMore` returned `false`: every page is loaded */
    isFinished: readonly(isFinished),
    /** The error thrown by the last `loadMore`, `undefined` after a successful load */
    error: readonly(error),
    load,
    reset,
    stop,
  }
}

export type UseInfiniteScrollReturn = ReturnType<typeof useInfiniteScroll>
