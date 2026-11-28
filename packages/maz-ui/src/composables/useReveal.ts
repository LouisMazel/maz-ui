import type { MaybeRefOrGetter } from 'vue'
import type { Router } from 'vue-router'
import type { RevealOptions } from '../utils/reveal.ts'
import { getCurrentInstance, getCurrentScope, nextTick, onMounted, onScopeDispose, toValue } from 'vue'
import { isRevealed, readRevealOptions, reveal, unreveal } from '../utils/reveal.ts'

export interface UseRevealOptions extends RevealOptions {
  /**
   * The elements to reveal. Their `data-maz-reveal*` attributes override the options
   * @default '[data-maz-reveal]'
   */
  selector?: string
  /**
   * The element that holds them (the HTML of a markdown or a CMS)
   * @default document
   */
  root?: MaybeRefOrGetter<Element | Document | null | undefined>
  /**
   * Scans again after each navigation. Found by default when `vue-router` is installed
   */
  router?: Router
}

/**
 * Reveals the elements that match a selector, for the HTML you do not control (markdown, CMS) or static HTML with
 * `data-maz-reveal`. Scans on mount and after each navigation, stops on unmount.
 *
 * @example
 * useReveal({ selector: '.prose > *', effect: 'slide-up' })
 */
export function useReveal({ selector = '[data-maz-reveal]', root, router, ...defaults }: UseRevealOptions = {}) {
  const tracked = new Set<HTMLElement>()
  const instance = getCurrentInstance()
  const currentRouter = router ?? (instance?.appContext.config.globalProperties.$router as Router | undefined)

  function scan() {
    const scope = toValue(root) ?? (typeof document === 'undefined' ? undefined : document)

    if (!scope)
      return

    for (const element of tracked) {
      if (!element.isConnected) {
        unreveal(element)
        tracked.delete(element)
      }
    }

    for (const element of scope.querySelectorAll<HTMLElement>(selector)) {
      if (isRevealed(element))
        continue

      tracked.add(element)
      reveal(element, { ...defaults, ...Object.fromEntries(Object.entries(readRevealOptions(element)).filter(([, value]) => value !== undefined)) })
    }
  }

  let removeHook: (() => void) | undefined

  function stop() {
    removeHook?.()

    for (const element of tracked)
      unreveal(element)

    tracked.clear()
  }

  removeHook = currentRouter?.afterEach(() => {
    nextTick(scan)
  })

  if (instance)
    onMounted(scan)

  if (getCurrentScope())
    onScopeDispose(stop)

  return {
    /** Reveals the new elements that match the selector */
    scan,
    /** Stops revealing the elements and shows them */
    stop,
  }
}

export type UseRevealReturn = ReturnType<typeof useReveal>
