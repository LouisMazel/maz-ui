import type { MaybeRefOrGetter, Ref } from 'vue'
import type { ResizeTarget } from './useResizeObserver.ts'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { getCurrentScope, onScopeDispose, ref, toValue } from 'vue'

export type RovingFocusOrientation = 'horizontal' | 'vertical' | 'both'

export interface UseRovingFocusOptions {
  /**
   * Element that contains the items. Its computed `direction` gives the RTL, and with `selector` it gives the items
   */
  container?: MaybeRefOrGetter<ResizeTarget>
  /**
   * CSS selector of the items inside the `container`
   */
  selector?: string
  /**
   * Getter of the items, instead of `container` and `selector`
   */
  items?: () => (HTMLElement | null | undefined)[]
  /**
   * Arrows that move the focus: left and right, up and down, or all of them
   * @values `'horizontal' | 'vertical' | 'both'`
   * @default 'horizontal'
   */
  orientation?: RovingFocusOrientation
  /**
   * Goes back to the first item after the last one, and the opposite
   * @default true
   */
  loop?: boolean
  /**
   * Forces the reading direction. By default it is read from the computed `direction` of the container
   */
  rtl?: boolean
  /**
   * `Home` and `End` go to the first and the last item
   * @default true
   */
  homeEnd?: boolean
  /**
   * Typing letters jumps to the item whose text starts with them (500ms buffer)
   * @default false
   */
  typeahead?: boolean
  /**
   * Skips the items with `disabled` or `aria-disabled="true"`
   * @default true
   */
  skipDisabled?: boolean
  /**
   * Calls `onActivate` each time the focus moves to an item
   * @default false
   */
  activateOnFocus?: boolean
  /**
   * Called when an item is activated by the keyboard (see `activateOnFocus`)
   */
  onActivate?: (index: number, element: HTMLElement) => void
  /**
   * Index of the current item: pass a ref to share it with your component
   * @default ref(0)
   */
  currentIndex?: Ref<number>
}

const TYPEAHEAD_DELAY = 500

function isItemDisabled(element: HTMLElement | null | undefined) {
  return !element
    || element.hasAttribute('disabled')
    || element.getAttribute('aria-disabled') === 'true'
}

function toElement(value: ResizeTarget): HTMLElement | undefined {
  if (!value)
    return undefined

  return ('$el' in value
    ? value.$el
    : value) as HTMLElement
}

/**
 * Roving tabindex for a group of items (tabs, segmented controls, radio-like groups, menus, toolbars, pagination):
 * only one item is in the tab sequence and the arrows, `Home`, `End` and the letters move the focus between them.
 * The RTL is read from the container.
 *
 * @example
 * const container = useTemplateRef('container')
 * const { onKeydown, getTabIndex } = useRovingFocus({
 *   container,
 *   selector: '[role="tab"]',
 *   activateOnFocus: true,
 *   onActivate: index => select(index),
 * })
 * // <div ref="container" @keydown="onKeydown"><button role="tab" :tabindex="getTabIndex(0)" /></div>
 */
export function useRovingFocus(options: UseRovingFocusOptions = {}) {
  const {
    selector,
    orientation = 'horizontal',
    loop = true,
    homeEnd = true,
    typeahead = false,
    skipDisabled = true,
    activateOnFocus = false,
    onActivate,
  } = options
  const currentIndex = options.currentIndex ?? ref(0)

  let buffer = ''
  let bufferTimer: ReturnType<typeof setTimeout> | undefined

  function getItems(): (HTMLElement | null | undefined)[] {
    if (options.items)
      return options.items()

    const container = toElement(toValue(options.container))

    return container && selector
      ? [...container.querySelectorAll<HTMLElement>(selector)]
      : []
  }

  function isDisabled(element: HTMLElement | null | undefined) {
    return skipDisabled
      ? isItemDisabled(element)
      : !element
  }

  function isRtl(items: (HTMLElement | null | undefined)[], event?: KeyboardEvent) {
    if (options.rtl !== undefined)
      return options.rtl
    if (!isClient())
      return false

    const reference = toElement(toValue(options.container))
      ?? (event?.currentTarget instanceof HTMLElement ? event.currentTarget : undefined)
      ?? items.find(Boolean)?.parentElement

    return !!reference && globalThis.getComputedStyle(reference).direction === 'rtl'
  }

  function findEnabled(items: (HTMLElement | null | undefined)[], from: number, step: 1 | -1, wrap: boolean) {
    const count = items.length

    for (let offset = 1; offset <= count; offset++) {
      const raw = from + step * offset
      if (!wrap && (raw < 0 || raw >= count))
        return undefined
      const index = (raw % count + count) % count
      if (!isDisabled(items[index]))
        return index
    }

    return undefined
  }

  function focusItem(index: number) {
    const element = getItems()[index]
    if (!element || isDisabled(element))
      return

    element.focus()
    const changed = currentIndex.value !== index
    currentIndex.value = index

    if (activateOnFocus && changed)
      onActivate?.(index, element)
  }

  function getTabIndex(index: number) {
    const items = getItems()
    const current = items[currentIndex.value]
    const focusable = current && !isDisabled(current)
      ? currentIndex.value
      : items.findIndex(item => !isDisabled(item))

    return index === focusable
      ? 0
      : -1
  }

  function resolveIndex(items: (HTMLElement | null | undefined)[], event: KeyboardEvent, index?: number) {
    if (index !== undefined)
      return index

    const target = event.target as Node | null
    const found = items.findIndex(item => !!item && (item === target || item.contains(target)))

    return found === -1
      ? currentIndex.value
      : found
  }

  function findByText(items: (HTMLElement | null | undefined)[], from: number) {
    const count = items.length
    const repeated = buffer.length > 1 && [...buffer].every(char => char === buffer[0])
    const search = repeated
      ? buffer[0]
      : buffer
    const start = search.length === 1
      ? from + 1
      : from

    for (let offset = 0; offset < count; offset++) {
      const index = (start + offset) % count
      const element = items[index]
      if (!isDisabled(element) && element?.textContent?.trim().toLowerCase().startsWith(search))
        return index
    }

    return undefined
  }

  function handleTypeahead(items: (HTMLElement | null | undefined)[], event: KeyboardEvent, from: number) {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey || (event.key === ' ' && !buffer))
      return undefined

    buffer += event.key.toLowerCase()
    clearTimeout(bufferTimer)
    bufferTimer = setTimeout(() => {
      buffer = ''
    }, TYPEAHEAD_DELAY)

    return findByText(items, from)
  }

  function getTarget(items: (HTMLElement | null | undefined)[], event: KeyboardEvent, from: number) {
    const rtl = isRtl(items, event)
    const horizontal = orientation !== 'vertical'
    const vertical = orientation !== 'horizontal'
    const forwardKeys = [vertical && 'ArrowDown', horizontal && (rtl ? 'ArrowLeft' : 'ArrowRight')]
    const backwardKeys = [vertical && 'ArrowUp', horizontal && (rtl ? 'ArrowRight' : 'ArrowLeft')]

    if (forwardKeys.includes(event.key))
      return { handled: true, index: findEnabled(items, from, 1, loop) }
    if (backwardKeys.includes(event.key))
      return { handled: true, index: findEnabled(items, from, -1, loop) }
    if (homeEnd && event.key === 'Home')
      return { handled: true, index: findEnabled(items, -1, 1, false) }
    if (homeEnd && event.key === 'End')
      return { handled: true, index: findEnabled(items, items.length, -1, false) }

    if (typeahead) {
      const index = handleTypeahead(items, event, from)
      return { handled: index !== undefined, index }
    }

    return { handled: false, index: undefined }
  }

  /**
   * Handler of the `keydown` event of the container (or of each item, with its `index`)
   */
  function onKeydown(event: KeyboardEvent, index?: number) {
    const items = getItems()
    if (items.length === 0)
      return

    const from = resolveIndex(items, event, index)
    const { handled, index: target } = getTarget(items, event, from)

    if (!handled)
      return

    event.preventDefault()

    if (target !== undefined)
      focusItem(target)
  }

  if (getCurrentScope())
    onScopeDispose(() => clearTimeout(bufferTimer))

  return { onKeydown, getTabIndex, focusItem, currentIndex }
}
