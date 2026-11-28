import type { MaybeRefOrGetter } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { getCurrentScope, onScopeDispose, toValue, watch } from 'vue'

export type UseEventListenerOptions = boolean | AddEventListenerOptions

type EventTargetLike = EventTarget | { $el?: unknown } | null | undefined

export type UseEventListenerTarget<T extends EventTarget> = MaybeRefOrGetter<T | { $el?: unknown } | null | undefined>

function resolveTarget(target: MaybeRefOrGetter<EventTargetLike>): EventTarget | undefined {
  const value = toValue(target)
  const element = value && '$el' in value ? value.$el : value

  return element && typeof (element as EventTarget).addEventListener === 'function'
    ? element as EventTarget
    : undefined
}

/**
 * Add an event listener to a target, removed when the scope is disposed (or on stop).
 * The target can be a window, a document, an element, a template ref or a getter: the listener follows it.
 * Does nothing on the server.
 *
 * @returns a function that removes the listener
 *
 * @example
 * useEventListener(window, 'resize', onResize, { passive: true })
 * useEventListener(buttonRef, ['focus', 'blur'], onFocusChange)
 */
export function useEventListener<K extends keyof WindowEventMap>(
  target: UseEventListenerTarget<Window>,
  event: K | K[],
  listener: (event: WindowEventMap[K]) => void,
  options?: UseEventListenerOptions,
): () => void
export function useEventListener<K extends keyof WindowEventMap>(
  target: UseEventListenerTarget<typeof globalThis>,
  event: K | K[],
  listener: (event: WindowEventMap[K]) => void,
  options?: UseEventListenerOptions,
): () => void
export function useEventListener<K extends keyof DocumentEventMap>(
  target: UseEventListenerTarget<Document>,
  event: K | K[],
  listener: (event: DocumentEventMap[K]) => void,
  options?: UseEventListenerOptions,
): () => void
export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: UseEventListenerTarget<HTMLElement>,
  event: K | K[],
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: UseEventListenerOptions,
): () => void
export function useEventListener(
  target: UseEventListenerTarget<EventTarget>,
  event: string | string[],
  listener: (event: Event) => void,
  options?: UseEventListenerOptions,
): () => void
export function useEventListener(
  target: MaybeRefOrGetter<EventTargetLike>,
  event: string | string[],
  listener: (event: any) => void,
  options?: UseEventListenerOptions,
): () => void {
  if (!isClient())
    return () => {}

  const events = Array.isArray(event) ? event : [event]
  let cleanup = () => {}

  const stopWatch = watch(
    () => resolveTarget(target),
    (element) => {
      cleanup()

      if (!element)
        return

      for (const name of events)
        element.addEventListener(name, listener, options)

      cleanup = () => {
        for (const name of events)
          element.removeEventListener(name, listener, options)
        cleanup = () => {}
      }
    },
    { immediate: true, flush: 'post' },
  )

  function stop() {
    stopWatch()
    cleanup()
  }

  if (getCurrentScope())
    onScopeDispose(stop)

  return stop
}
