import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { computed, getCurrentScope, onScopeDispose, ref, toValue, watch } from 'vue'

export type ScrollLockTarget = HTMLElement | ComponentPublicInstance | undefined | null

interface LockedElement {
  /** Locks of the element: it scrolls again when the last one is released */
  count: number
  overflow: string
  paddingInlineEnd: string
}

const lockedElements = new Map<HTMLElement, LockedElement>()

function toElement(value: ScrollLockTarget): HTMLElement | undefined {
  if (!value)
    return undefined

  return '$el' in value
    ? value.$el as HTMLElement
    : value
}

function lockElement(element: HTMLElement) {
  const locked = lockedElements.get(element)

  if (locked) {
    locked.count++
    return
  }

  const isPage = element === document.documentElement
  const scrollbarWidth = isPage
    ? window.innerWidth - element.clientWidth
    : element.offsetWidth - element.clientWidth

  lockedElements.set(element, { count: 1, overflow: element.style.overflow, paddingInlineEnd: element.style.paddingInlineEnd })
  element.style.overflow = 'hidden'

  // The scrollbar disappears: the padding keeps the content in place
  if (scrollbarWidth > 0) {
    const currentPadding = Number.parseFloat(getComputedStyle(element).paddingInlineEnd) || 0

    element.style.paddingInlineEnd = `${currentPadding + scrollbarWidth}px`
    element.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
  }
}

function unlockElement(element: HTMLElement) {
  const locked = lockedElements.get(element)

  if (!locked)
    return

  locked.count--

  if (locked.count > 0)
    return

  element.style.overflow = locked.overflow
  element.style.paddingInlineEnd = locked.paddingInlineEnd
  element.style.removeProperty('--scrollbar-width')
  lockedElements.delete(element)
}

/**
 * Locks the scroll of the page (by default) or of an element: a mobile menu, an overlay, a fullscreen panel.
 * The width of the scrollbar is kept as a padding, so the content does not move, and exposed as `--scrollbar-width`
 * for the fixed elements. Several locks can be held at once: the page scrolls again when the last one is released,
 * and a lock is released when its component unmounts.
 */
export function useScrollLock(target?: MaybeRefOrGetter<ScrollLockTarget>, initialValue = false) {
  const isLocked = ref(false)
  const element = computed(() => {
    if (!isClient())
      return undefined

    return target === undefined
      ? document.documentElement
      : toElement(toValue(target))
  })

  let lockedElement: HTMLElement | undefined

  function release() {
    if (lockedElement)
      unlockElement(lockedElement)

    lockedElement = undefined
  }

  function lock() {
    isLocked.value = true
  }

  function unlock() {
    isLocked.value = false
  }

  function toggle() {
    isLocked.value = !isLocked.value
  }

  watch([element, isLocked], ([current, locked]) => {
    if (current === lockedElement && locked === !!lockedElement)
      return

    release()

    if (current && locked) {
      lockElement(current)
      lockedElement = current
    }
  }, { flush: 'sync' })

  isLocked.value = initialValue

  if (getCurrentScope())
    onScopeDispose(release)

  return {
    /** The scroll is locked: writable, `isLocked.value = true` locks it */
    isLocked: computed({
      get: () => isLocked.value,
      set: (value: boolean) => {
        isLocked.value = value
      },
    }),
    lock,
    unlock,
    toggle,
  }
}

export type UseScrollLockReturn = ReturnType<typeof useScrollLock>
