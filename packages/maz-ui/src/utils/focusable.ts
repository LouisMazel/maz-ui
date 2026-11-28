export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([contenteditable="false"])',
].join(', ')

/**
 * The elements of the container reachable with Tab, in the order of the document: not disabled,
 * not hidden, not removed from the tab order
 */
export function getFocusableElements(container: Element | null | undefined): HTMLElement[] {
  if (!container)
    return []

  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter((element) => {
    if (element.tabIndex === -1 || element.closest('[inert]'))
      return false

    const style = globalThis.getComputedStyle(element)

    return style.display !== 'none' && style.visibility !== 'hidden'
  })
}

/**
 * Keeps Tab and Shift + Tab inside the container: from the last focusable element to the first one,
 * and back. Focus coming from outside the container goes to its first (or last) element.
 */
export function trapTabKey(event: KeyboardEvent, container: Element | null | undefined) {
  if (event.key !== 'Tab')
    return

  const focusableElements = getFocusableElements(container)

  if (focusableElements.length === 0)
    return

  const first = focusableElements[0]
  const last = focusableElements.at(-1)!
  const active = document.activeElement
  const isInside = !!active && !!container?.contains(active)

  if (event.shiftKey && (active === first || !isInside)) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && (active === last || !isInside)) {
    event.preventDefault()
    first.focus()
  }
}
