/**
 * Elements of the page kept interactive behind a modal: the toasts, the popover panels
 * (a select inside a dialog) and the live regions
 */
const INERT_EXCLUDED_SELECTOR = '.m-toast-container, .m-popover-panel, [aria-live], [role="status"], [role="alert"]'
const INERT_SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'LINK', 'NOSCRIPT'])

/**
 * Number of open modals holding each element inert. An element is only released when no modal
 * holds it anymore, whatever the closing order of nested modals.
 */
const holders = new WeakMap<HTMLElement, number>()

/**
 * Makes the direct children of `<body>` inert, except the one containing the modal and the
 * excluded overlays. Elements made inert by something else are never touched.
 * @param modal The element of the modal kept interactive
 * @returns The elements held by this call, to pass to `releaseInertBackground`
 */
export function holdInertBackground(modal: HTMLElement): HTMLElement[] {
  const held: HTMLElement[] = []

  for (const element of document.body.children) {
    if (
      !(element instanceof HTMLElement)
      || element.contains(modal)
      || INERT_SKIPPED_TAGS.has(element.tagName)
      || element.matches(INERT_EXCLUDED_SELECTOR)
    ) {
      continue
    }

    const count = holders.get(element)

    if (count === undefined) {
      if (element.hasAttribute('inert'))
        continue

      element.setAttribute('inert', '')
    }

    holders.set(element, (count ?? 0) + 1)
    held.push(element)
  }

  return held
}

export function releaseInertBackground(elements: HTMLElement[]) {
  for (const element of elements) {
    const count = holders.get(element)

    if (count === undefined)
      continue

    if (count > 1) {
      holders.set(element, count - 1)
      continue
    }

    holders.delete(element)
    element.removeAttribute('inert')
  }
}
