import type { UseEventListenerOptions } from './useEventListener.ts'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { useEventListener } from './useEventListener.ts'

export interface UseWindowOptions {
  /**
   * The window object to use
   * @default window - in browser, undefined in SSR
   */
  internalWindow?: Window
}

/**
 * The window of the page and a way to listen to its events: SSR safe, listeners removed when the scope is disposed.
 *
 * @example
 * const { on } = useWindow()
 * on('resize', update, { passive: true })
 */
export function useWindow(options: UseWindowOptions = {}) {
  const { internalWindow = isClient() ? globalThis as unknown as Window : undefined } = options

  function on<K extends keyof WindowEventMap>(
    event: K | K[],
    listener: (event: WindowEventMap[K]) => void,
    listenerOptions?: UseEventListenerOptions,
  ) {
    return useEventListener(internalWindow, event, listener, listenerOptions)
  }

  return {
    window: internalWindow,
    isSupported: internalWindow !== undefined,
    on,
  }
}
