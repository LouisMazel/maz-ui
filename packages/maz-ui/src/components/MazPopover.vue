<script lang="ts" setup>
import type { Middleware, VirtualElement } from '@floating-ui/vue'
import type { HTMLAttributes } from 'vue'

import type { MazColor, MazNeutralColor } from './types.ts'
import { autoPlacement, autoUpdate, flip, offset as floatingOffset, hide, shift, useFloating } from '@floating-ui/vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  shallowRef,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'
import { useGlobalConfig } from '../composables/useGlobalConfig.ts'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { getFocusableElements, trapTabKey } from '../utils/focusable.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import { addOverlayLayer, isInUpperOverlayLayer, isTopOverlayLayer, removeOverlayLayer } from '../utils/overlayLayers.ts'
import { formatOrigin, getOriginFromRects, getSideFromPlacement } from '../utils/popoverOrigin.ts'
import { getColor } from './types.ts'

defineOptions({
  name: 'MazPopover',
  inheritAttrs: false,
})

const {
  id,
  position = 'auto',
  trigger = 'click',
  role = 'dialog',
  disabled = false,
  offset = 8,
  delay = 0,
  hoverDelay = 150,
  transition = 'scale-pop',
  teleportTo = 'body',
  closeOnClickOutside = true,
  closeOnEscape = true,
  persistent = false,
  panelStyle,
  color = 'container',
  overlayClass,
  panelClass,
  preferPosition,
  fallbackPosition,
  trapFocus = true,
  keepOpenOnHover = false,
  block = false,
  announceChanges = false,
  positionReference,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
} = defineProps<MazPopoverProps>()

const emits = defineEmits<{
  /**
   * Emitted when popover state changes
   * @property {boolean} value - The new open state
   */
  'update:model-value': [value: boolean]
  /**
   * Emitted when popover opens
   */
  'open': []
  /**
   * Emitted when popover closes
   */
  'close': []
  /**
   * Emitted after the close animation
   */
  'after-close-animation': []
  /**
   * Emitted when popover toggles
   * @property {boolean} value - The new open state
   */
  'toggle': [value: boolean]
}>()

export type MazPopoverPosition = 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'auto'
export type MazPopoverPreferPosition = 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'
export type MazPopoverFallbackPosition = 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'
export type MazPopoverTrigger = 'click' | 'hover' | 'manual' | 'adaptive'
export type MazPopoverRole = 'dialog' | 'tooltip' | 'menu'

export type MazPopoverCollisionPadding = number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>

export interface MazPopoverProps {
  /**
   * Controls the popover open state
   * @model
   * @type {boolean}
   * @default false
   */
  modelValue?: boolean
  /**
   * Position of the popover relative to trigger
   * @values auto, top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
   * @default auto
   * @description Position of the popover relative to trigger
   */
  position?: MazPopoverPosition

  /**
   * Preferred position of the popover relative to trigger when auto position is used
   * @values auto, top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
   * @default 'bottom-start'
   * @description Preferred position of the popover relative to trigger
   */
  preferPosition?: MazPopoverPreferPosition

  /**
   * Fallback position of the popover relative to trigger when prefer position is not visible
   * @values auto, top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
   * @default auto
   * @description Fallback position of the popover relative to trigger
   */
  fallbackPosition?: MazPopoverFallbackPosition

  /**
   * How the popover is triggered
   * @values click, hover, manual, adaptive
   * @default click
   * @description How the popover is triggered. 'adaptive' uses hover on desktop and click on mobile
   */
  trigger?: MazPopoverTrigger
  /**
   * ARIA role for accessibility
   * @values dialog, tooltip
   * @default dialog
   * @description ARIA role for accessibility
   */
  role?: MazPopoverRole
  /**
   * ARIA label for the popover
   * @default undefined
   */
  ariaLabel?: string
  /**
   * Announce content changes to screen readers
   * @default false
   */
  announceChanges?: boolean
  /**
   * Disables the popover
   * @default false
   * @description Disables the popover
   */
  disabled?: boolean
  /**
   * Distance between trigger and popover in pixels
   * @default 8
   */
  offset?: number
  /**
   * Space kept free at the edges of the viewport, in pixels: the panel stays out of it, and it is hidden when
   * its trigger goes under it. `{ top: 64 }` for a sticky header of 64px. Also a global default (`defaults.MazPopover`)
   * @default 5
   */
  collisionPadding?: MazPopoverCollisionPadding
  /**
   * Delay before showing/hiding in milliseconds
   * @default 0
   */
  delay?: number
  /**
   * Delay before closing on hover in milliseconds
   * @default 150
   */
  hoverDelay?: number
  /**
   * CSS transition name for animations
   * @default 'scale-pop'
   * @values 'scale-pop' | 'scale-fade' | string
   * @description `scale-pop` (default): the panel springs out of its trigger and is sucked back into it. `scale-fade`: a sober fade and a slight growth from the trigger. Both start from the `--maz-popover-transform-origin` CSS variable of the panel.
   */
  transition?: 'scale-pop' | 'scale-fade' | string
  /**
   * Teleport target selector
   * @default 'body'
   */
  teleportTo?: string
  /**
   * Additional CSS classes for the overlay wrapper
   * @default undefined
   */
  overlayClass?: HTMLAttributes['class']
  /**
   * Additional CSS classes for the popover panel
   * @default undefined
   */
  panelClass?: HTMLAttributes['class']
  /**
   * Inline styles for the popover panel
   * @default undefined
   */
  panelStyle?: HTMLAttributes['style']
  /**
   * Close popover when clicking outside
   * @default true
   */
  closeOnClickOutside?: boolean
  /**
   * Close popover when pressing Escape key
   * @default true
   */
  closeOnEscape?: boolean
  /**
   * Prevent auto-close (ignores click outside and escape key)
   * @default false
   */
  persistent?: boolean
  /**
   * Custom ID for the popover element
   * @default undefined
   */
  id?: string
  /**
   * ARIA labelledby attribute for accessibility
   * @default undefined
   */
  ariaLabelledby?: string
  /**
   * ARIA describedby attribute for accessibility
   * @default undefined
   */
  ariaDescribedby?: string
  /**
   * Color variant of the popover: `container` (the default) and `surface` are the neutral colors of the theme
   * @values primary, secondary, accent, info, success, warning, destructive, contrast, neutral, surface, container
   * @default container
   */
  color?: MazColor | MazNeutralColor
  /**
   * Trap focus inside the popover
   * @default true
   */
  trapFocus?: boolean
  /**
   * Keep popover open when hovering over the panel
   * @default false
   */
  keepOpenOnHover?: boolean
  /**
   * The popover will be full width of the trigger
   * @default false
   */
  block?: boolean

  /**
   * CSS selector or element reference to use for positioning calculations
   * @description When provided, the popover will position relative to this element instead of the trigger
   * Useful for components with labels where you want to position relative to the actual input
   * A point `{ x, y }` (viewport coordinates) positions the popover at this point (context menu)
   * @type {string | HTMLElement | { x: number, y: number }}
   * @default undefined
   * @example "input" or "#my-input" or HTMLElement or { x: 120, y: 80 }
   */
  positionReference?: string | HTMLElement | { x: number, y: number }
}

const triggerId = useInstanceUniqId({
  componentName: 'MazPopover',
  providedId: id,
})

const attrs = useAttrs()

const triggerRef = useTemplateRef<HTMLElement>('trigger')
const panelRef = useTemplateRef<HTMLElement>('panel')

const originMiddleware: Middleware = {
  name: 'mazOrigin',
  fn: ({ x, y, rects, placement }) => ({
    data: {
      origin: formatOrigin(getOriginFromRects(
        rects.reference,
        { ...rects.floating, x, y },
        getSideFromPlacement(placement),
      )),
    },
  }),
}

const { collisionPadding } = useGlobalConfig<{ collisionPadding: MazPopoverCollisionPadding }>('MazPopover', { collisionPadding: 5 })

const middleware = computed(() => {
  const padding = collisionPadding.value
  const middleware: Middleware[] = [
    floatingOffset(offset),
    hide({ padding }),
    shift({ padding }),
  ]

  const shouldUseAutoPlacement = position === 'auto' && !preferPosition && !fallbackPosition

  if (shouldUseAutoPlacement) {
    middleware.push(autoPlacement({
      allowedPlacements: ['top', 'bottom', 'left', 'right'],
      padding,
    }))
  }
  else {
    middleware.push(flip({
      padding,
      fallbackPlacements: fallbackPosition
        ? [fallbackPosition]
        : undefined,
    }))
  }

  middleware.push(originMiddleware)

  return middleware
})

const floatingPosition = computed(() => {
  if (position === 'auto') {
    return preferPosition
  }

  return position
})

const transitionName = computed(() => {
  if (['scale-pop', 'scale-fade'].includes(transition)) {
    return `maz-${transition}`
  }

  return transition
})

function onTransitionAfterLeave() {
  emits('after-close-animation')
}
const positionRef = computed(() => {
  if (!positionReference) {
    return triggerRef.value
  }

  if (typeof positionReference === 'string') {
    const withinTrigger = triggerRef.value?.querySelector<HTMLElement>(positionReference)

    if (withinTrigger) {
      return withinTrigger
    }

    return isClient()
      ? document.querySelector<HTMLElement>(positionReference)
      : null
  }

  if (!('getBoundingClientRect' in positionReference)) {
    const { x, y } = positionReference

    return {
      getBoundingClientRect: () => ({ x, y, width: 0, height: 0, top: y, left: x, right: x, bottom: y }),
    } satisfies VirtualElement
  }

  return positionReference
})
const reference = computed<HTMLElement | VirtualElement | null>(() => positionRef.value || triggerRef.value || null)

const { floatingStyles, placement, update, middlewareData } = useFloating(
  reference,
  panelRef,
  {
    placement: floatingPosition,
    middleware,
    transform: false,
    whileElementsMounted: autoUpdate,
  },
)

const computedPosition = computed(() => placement.value ?? floatingPosition.value)

const panelSide = computed(() => getSideFromPlacement(computedPosition.value))
const panelOrigin = computed<string | undefined>(() => middlewareData.value.mazOrigin?.origin)

function onBeforeLeave(element: Element) {
  (element as HTMLElement).dataset.state = 'closed'
}

const isOpen = defineModel<boolean>({ default: false })

/**
 * The panel is only rendered in the browser: its position needs the DOM, and a teleported content
 * rendered on the server breaks the hydration (Nuxt only renders the teleports to `#teleports`).
 */
const isMounted = ref(false)
const isPanelRendered = computed(() => isMounted.value && isOpen.value && !disabled)

let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null
let initialFocusElement: HTMLElement | null = null

const panelId = computed(() => `${triggerId.value}-panel`)

const rootStyles = computed(() => attrs.style as HTMLAttributes['style'])

const panelStyles = computed(() => {
  const styles: any = {
    ...floatingStyles.value,
    pointerEvents: isOpen.value ? 'auto' : 'none',
  }

  return styles
})

interface TriggerEventHandlers {
  onClick?: () => void
  onMouseenter?: () => void
  onMouseleave?: () => void
  onFocusin?: () => void
  onFocusout?: () => void
  onKeydown?: (event: KeyboardEvent) => void
}

// Read after the mount: the server renders the hover trigger, the hydration has to match it
const isTouchDevice = computed(() => {
  if (!isMounted.value)
    return false
  return 'ontouchstart' in globalThis || navigator.maxTouchPoints > 0
})

const effectiveTrigger = computed(() => {
  if (trigger === 'adaptive') {
    return isTouchDevice.value ? 'click' : 'hover'
  }
  return trigger
})

const INTERACTIVE_TRIGGER_SELECTOR = 'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

/**
 * The ARIA of the trigger goes on the interactive element of the trigger slot (the button,
 * the input...), so the wrapper stays a plain element: a `role="button"` around an interactive
 * element is a `nested-interactive` violation. Without interactive element, the wrapper is the trigger.
 */
const triggerTarget = shallowRef<HTMLElement | null>(null)
const ownedTriggerAttributes = new Set<string>()
let triggerObserver: MutationObserver | undefined

const triggerAria = computed<Record<string, string | undefined>>(() => ({
  'aria-expanded': role === 'dialog' || role === 'menu'
    ? String(isOpen.value)
    : undefined,
  'aria-haspopup': role === 'dialog' || role === 'menu'
    ? role
    : undefined,
  'aria-describedby': role === 'tooltip' && isPanelRendered.value
    ? panelId.value
    : ariaDescribedby,
  'aria-labelledby': ariaLabelledby,
  'aria-controls': isPanelRendered.value ? panelId.value : undefined,
}))

const NON_TEXT_INPUT_TYPES = new Set([
  'button',
  'submit',
  'reset',
  'checkbox',
  'radio',
  'image',
  'file',
  'color',
  'range',
])

/**
 * `aria-expanded` is not allowed on a text field (role textbox): a text field opening a popup
 * has to be a combobox, which owns its ARIA
 */
function isTextField(element: HTMLElement) {
  if (element.hasAttribute('role'))
    return false

  return element instanceof HTMLTextAreaElement
    || (element instanceof HTMLInputElement && !NON_TEXT_INPUT_TYPES.has(element.type))
}

function releaseTriggerTarget() {
  for (const name of ownedTriggerAttributes)
    triggerTarget.value?.removeAttribute(name)

  ownedTriggerAttributes.clear()
}

function syncTriggerAria() {
  // A combobox (MazSelect, MazDatePicker...) is the trigger even when an icon button comes first
  const target = triggerRef.value?.querySelector<HTMLElement>('[role="combobox"]')
    ?? triggerRef.value?.querySelector<HTMLElement>(INTERACTIVE_TRIGGER_SELECTOR)
    ?? null

  if (target !== triggerTarget.value) {
    releaseTriggerTarget()
    triggerTarget.value = target
  }

  // A combobox owns its popup state (aria-expanded, aria-controls...) by the ARIA pattern
  if (!target || target.getAttribute('role') === 'combobox')
    return

  const skippedAttributes = isTextField(target)
    ? ['aria-expanded']
    : []

  for (const [name, value] of Object.entries(triggerAria.value)) {
    if (skippedAttributes.includes(name))
      continue

    // Set by the slot content itself: it wins
    if (!ownedTriggerAttributes.has(name) && target.hasAttribute(name))
      continue

    if (value === undefined) {
      target.removeAttribute(name)
      ownedTriggerAttributes.delete(name)
    }
    else {
      target.setAttribute(name, value)
      ownedTriggerAttributes.add(name)
    }
  }
}

const isWrapperTrigger = computed(() => !triggerTarget.value)

/**
 * The panel is hidden when its reference leaves the viewport or goes under the `collisionPadding` (`hide`
 * middleware), except while a field of the panel has the focus: on Android, the virtual keyboard opened to type
 * in it (a select search) covers the reference, hiding the panel would make it lose the focus.
 */
const isPanelFocused = ref(false)

const TYPING_FIELD = 'input:not([type="checkbox"], [type="radio"], [type="button"], [type="submit"]), textarea, select, [contenteditable]:not([contenteditable="false"])'

function onPanelFocusin(event: FocusEvent) {
  isPanelFocused.value = event.target instanceof Element && event.target.matches(TYPING_FIELD)
}

function onPanelFocusout(event: FocusEvent) {
  const nextFocused = event.relatedTarget as Node | null

  if (!nextFocused || !panelRef.value?.contains(nextFocused))
    isPanelFocused.value = false
}

const isPanelHidden = computed(() => !!middlewareData.value.hide?.referenceHidden && !isPanelFocused.value)

const wrapperTriggerAttributes = computed(() => {
  if (!isWrapperTrigger.value)
    return {}

  const isClickTrigger = effectiveTrigger.value === 'click' && !disabled

  return {
    ...triggerAria.value,
    role: effectiveTrigger.value === 'click'
      ? 'button'
      : undefined,
    tabindex: isClickTrigger ? 0 : undefined,
  }
})

const triggerEvents = computed(() => {
  if (disabled || effectiveTrigger.value === 'manual')
    return {}

  const events: TriggerEventHandlers = {}

  if (effectiveTrigger.value === 'hover') {
    events.onMouseenter = () => {
      clearCloseTimeout()
      open()
    }
    events.onMouseleave = close

    // A tooltip also shows on keyboard focus (WAI-ARIA tooltip pattern)
    if (role === 'tooltip') {
      events.onFocusin = events.onMouseenter
      events.onFocusout = close
    }
  }

  if (effectiveTrigger.value === 'click') {
    events.onClick = toggle

    if (isWrapperTrigger.value) {
      events.onKeydown = (event: KeyboardEvent) => {
        if (event.target !== triggerRef.value || (event.key !== 'Enter' && event.key !== ' '))
          return

        event.preventDefault()
        toggle()
      }
    }
  }

  return events
})

const panelEvents = computed(() => {
  if (effectiveTrigger.value !== 'hover')
    return {}

  return {
    onMouseenter: () => {
      if (keepOpenOnHover) {
        clearCloseTimeout()
      }
    },
    onMouseleave: () => {
      if (keepOpenOnHover) {
        close()
      }
    },
  }
})

const panelClasses = computed(() => [
  overlayClass,
  panelClass,
  `--position-${computedPosition.value}`,
  `--${getColor(color)}`,
])

const layer = {
  contains: (target: Node) => !!panelRef.value?.contains(target) || !!triggerRef.value?.contains(target),
}

function removeDocumentListeners() {
  removeOverlayLayer(layer)

  if (isClient()) {
    document.removeEventListener('keydown', onKeydown, role === 'tooltip')
    document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  }
}

function cleanup() {
  clearOpenTimeout()
  clearCloseTimeout()
  removeDocumentListeners()
}

function open() {
  if (disabled)
    return

  clearCloseTimeout()

  if (delay > 0) {
    openTimeout = setTimeout(() => {
      setOpen(true)
    }, delay)
  }
  else {
    setOpen(true)
  }
}

/**
 * @param immediate close now, without the delay of the hover trigger
 */
function close(immediate = false) {
  clearOpenTimeout()

  // Strict: a slot can bind `close` to an event, whose object is not a request to skip the delay
  if (immediate === true) {
    clearCloseTimeout()
    setOpen(false)
  }
  else if (delay > 0 && effectiveTrigger.value === 'hover') {
    closeTimeout = setTimeout(() => {
      setOpen(false)
    }, delay)
  }
  else if (effectiveTrigger.value === 'hover' && keepOpenOnHover) {
    closeTimeout = setTimeout(() => {
      setOpen(false)
    }, hoverDelay)
  }
  else {
    setOpen(false)
  }
}

function toggle() {
  if (isOpen.value) {
    close()
  }
  else {
    open()
  }
}

/** State whose side effects (events, listeners, focus) ran: the model watcher calls `setOpen` again with the same value */
let appliedOpenState = false

function setOpen(value: boolean) {
  isOpen.value = value

  if (value === appliedOpenState)
    return

  appliedOpenState = value

  if (value) {
    emits('open')
    emits('toggle', value)

    if (role !== 'tooltip')
      addOverlayLayer(layer)

    nextTick(() => {
      if (!appliedOpenState)
        return

      update()
      setupFocusTrap()
      // Dismiss au clic/tap exterieur gere imperativement (et non via une directive
      // posee sur le panel teleporte, peu fiable sur mobile). En capture + pointerdown
      // pour couvrir souris + tactile sur tous les elements. Ajoute APRES l'ouverture
      // pour ne pas capter l'interaction qui vient d'ouvrir.
      if (isClient()) {
        // A tooltip handles Escape first (capture), the overlay around it then sees `defaultPrevented`
        document.addEventListener('keydown', onKeydown, role === 'tooltip')
        document.addEventListener('pointerdown', onDocumentPointerDown, true)
      }
    })
  }
  else {
    isPanelFocused.value = false
    emits('toggle', value)
    emits('close')
    removeDocumentListeners()

    if (trapFocus) {
      restoreFocus()
    }
  }
}

function clearOpenTimeout() {
  if (openTimeout) {
    clearTimeout(openTimeout)
    openTimeout = null
  }
}

function clearCloseTimeout() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

function getTransformOrigin(position: Omit<MazPopoverPosition, 'auto'>): string {
  switch (position) {
    case 'top':
      return 'center bottom'
    case 'top-start':
      return 'left bottom'
    case 'top-end':
      return 'right bottom'
    case 'bottom':
      return 'center top'
    case 'bottom-start':
      return 'left top'
    case 'bottom-end':
      return 'right top'
    case 'left':
      return 'right center'
    case 'left-start':
      return 'right top'
    case 'left-end':
      return 'right bottom'
    case 'right':
      return 'left center'
    case 'right-start':
      return 'left top'
    case 'right-end':
      return 'left bottom'
    default:
      return 'center'
  }
}

function setupFocusTrap() {
  if (role === 'tooltip' || effectiveTrigger.value === 'hover' || !trapFocus || !isClient())
    return

  initialFocusElement = document.activeElement as HTMLElement

  nextTick(() => {
    const focusableElements = getFocusableElements(panelRef.value)

    if (focusableElements.length > 0) {
      focusableElements[0].focus({ preventScroll: true })
    }
    else {
      panelRef.value?.focus({ preventScroll: true })
    }
  })
}

function restoreFocus() {
  if (role === 'tooltip' || effectiveTrigger.value === 'hover' || !trapFocus || !isClient())
    return

  nextTick(() => {
    initialFocusElement?.focus({ preventScroll: true })
  })
}

function onKeydown(event: KeyboardEvent) {
  // A popover opened from this panel handles the keys first
  if (!isOpen.value || (role !== 'tooltip' && !isTopOverlayLayer(layer)))
    return

  if (event.key === 'Escape' && closeOnEscape && !persistent && !event.defaultPrevented) {
    event.preventDefault()
    close()
  }

  if (event.key === 'Tab' && trapFocus) {
    handleTrapFocus(event)
  }
}

function handleTrapFocus(event: KeyboardEvent) {
  if (!isClient())
    return

  trapTabKey(event, panelRef.value)
}

function onDocumentPointerDown(event: PointerEvent) {
  if (effectiveTrigger.value === 'manual' || !closeOnClickOutside || persistent)
    return

  const target = event.target as Node | null
  if (!target)
    return

  // Inside the panel, the trigger or a popover opened from the panel: not outside
  if (layer.contains(target) || isInUpperOverlayLayer(layer, target))
    return

  close()
}

watch(isOpen, (value, oldValue) => {
  if (!isClient() || value === oldValue)
    return

  if (value) {
    open()
  }
  else if (oldValue && !value) {
    close()
  }
})

watch(() => disabled, (isDisabled) => {
  if (isDisabled && isOpen.value)
    setOpen(false)
})

watch(() => position, () => {
  if (isOpen.value) {
    nextTick(() => update())
  }
})

watch(triggerAria, syncTriggerAria, { flush: 'post' })

onMounted(() => {
  isMounted.value = true

  if (isOpen.value)
    open()

  syncTriggerAria()

  // The slot content can render later (async components): only the children are watched,
  // the attributes set here would otherwise trigger the observer again
  if (triggerRef.value && typeof MutationObserver !== 'undefined') {
    triggerObserver = new MutationObserver(syncTriggerAria)
    triggerObserver.observe(triggerRef.value, { childList: true, subtree: true })
  }
})

onUpdated(syncTriggerAria)

onBeforeUnmount(() => {
  triggerObserver?.disconnect()
  releaseTriggerTarget()
  cleanup()
})

onUnmounted(cleanup)

defineExpose({
  /**
   * Open the popover
   * @description Programmatically open the popover
   * @usage `mazPopoverInstance.value?.open()`
   */
  open,
  /**
   * Close the popover
   * @description Programmatically close the popover
   * @usage `mazPopoverInstance.value?.close()`
   */
  close,
  /**
   * Toggle the popover
   * @description Programmatically toggle the popover open/close state
   * @usage `mazPopoverInstance.value?.toggle()`
   */
  toggle,
  /**
   * Check if the popover is open
   * @type {ModelRef<boolean>}
   * @description Reactive reference to the popover open state
   * @usage `const isPopoverOpen = mazPopoverInstance.value?.isOpen`
   */
  isOpen,
  /**
   * Update the popover position
   * @description Manually recalculate and update the popover position
   * @usage `mazPopoverInstance.value?.updatePosition()`
   */
  updatePosition: update,
  /**
   * Panel reference
   * @type {Ref<HTMLElement>}
   * @description Reference to the popover panel element
   * @usage `mazPopoverInstance.value?.panelRef`
   */
  panelRef,
  onTransitionAfterLeave,
})
</script>

<template>
  <div
    v-if="hasSlotContent($slots.trigger)"
    class="m-popover m-reset-css maz:inline-block"
    :class="[
      attrs.class,
      {
        '--open': isOpen,
        '--disabled': disabled,
        '--block': block,
        'maz:disabled-cursor': disabled,
        'maz:w-full': block,
      },
    ]"
    :style="rootStyles"
  >
    <div
      :id="triggerId"
      ref="trigger"
      class="m-popover-trigger maz:inline-block maz:size-full"
      v-bind="{ ...wrapperTriggerAttributes, ...triggerEvents }"
    >
      <!--
        @slot Trigger element content
        @binding {function} open Function to open the popover
        @binding {function} close Function to close the popover
        @binding {function} toggle Function to toggle the popover
        @binding {boolean} is-open Current open state of the popover
        @binding {'click' | 'hover' | 'manual'} trigger The trigger type
      -->
      <slot name="trigger" :open="open" :close="close" :toggle="toggle" :is-open="isOpen" :trigger="effectiveTrigger" />
    </div>
  </div>

  <Teleport v-if="isMounted" :to="teleportTo">
    <Transition :name="transitionName" appear @before-leave="onBeforeLeave" @after-leave="onTransitionAfterLeave">
      <div
        v-if="isPanelRendered"
        :id="panelId"
        ref="panel"
        :role
        :aria-label="ariaLabel"
        :aria-labelledby="role === 'dialog' || role === 'menu' ? ariaLabelledby || triggerId : undefined"
        :aria-describedby="role === 'dialog' ? ariaDescribedby : undefined"
        :aria-modal="role === 'dialog' && trapFocus ? 'true' : undefined"
        :tabindex="role === 'dialog' ? '-1' : undefined"
        data-state="open"
        :data-side="panelSide"
        class="m-popover-panel maz:fixed maz:z-default-backdrop maz:rounded-md maz:shadow-elevation maz:outline-hidden maz:drop-shadow-md"
        :aria-live="announceChanges ? 'polite' : undefined"
        :class="panelClasses"
        :style="[
          panelStyle,
          panelStyles,
          {
            '--maz-popover-transform-origin': panelOrigin,
            'transformOrigin': `var(--maz-popover-transform-origin, ${getTransformOrigin(computedPosition)})`,
            'visibility': isPanelHidden ? 'hidden' : 'visible',
          },
        ]"
        v-bind="panelEvents"
        @focusin="onPanelFocusin"
        @focusout="onPanelFocusout"
      >
        <!--
          @slot Popover content
          @binding {function} open Function to open the popover
          @binding {function} close Function to close the popover
          @binding {function} toggle Function to toggle the popover
          @binding {boolean} is-open Current open state of the popover
        -->
        <slot :open="open" :close="close" :toggle="toggle" :is-open="isOpen" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-popover-panel {
  will-change: transform, opacity;
  contain: layout style paint;
  backface-visibility: hidden;

  /* Neutral colors */
  &.--container {
    @apply maz:dark:border maz:dark:border-divider maz:bg-container maz:text-foreground;
  }

  &.--surface {
    @apply maz:dark:border maz:dark:border-divider maz:bg-surface maz:text-foreground;
  }

  /* Color variants */
  &.--primary {
    @apply maz:border-primary-600 maz:bg-primary maz:text-primary-foreground;
  }

  &.--secondary {
    @apply maz:border-secondary-600 maz:bg-secondary maz:text-secondary-foreground;
  }

  &.--success {
    @apply maz:border-success-600 maz:bg-success maz:text-success-foreground;
  }

  &.--warning {
    @apply maz:border-warning-600 maz:bg-warning maz:text-warning-foreground;
  }

  &.--destructive {
    @apply maz:border-destructive-600 maz:bg-destructive maz:text-destructive-foreground;
  }

  &.--info {
    @apply maz:border-info-600 maz:bg-info maz:text-info-foreground;
  }

  &.--accent {
    @apply maz:border-accent-600 maz:bg-accent maz:text-accent-foreground;
  }

  &.--contrast {
    @apply maz:border-contrast-600 maz:bg-contrast maz:text-contrast-foreground;
  }

  &.--neutral {
    @apply maz:border maz:border-divider maz:bg-neutral maz:text-neutral-foreground;
  }
}

/*
 * `scale-fade`, the sober one (menus, selects, pickers): from a slightly smaller scale and a few pixels toward
 * the trigger, the origin being `--maz-popover-transform-origin`
 */
.maz-scale-fade-enter-active {
  transition:
    opacity calc(var(--maz-motion-normal, 200ms) * 0.6 * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.maz-scale-fade-leave-active {
  transition:
    opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
    transform calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in);
}

.maz-scale-fade-enter-from,
.maz-scale-fade-leave-to {
  --m-popover-shift-x: 0px;
  --m-popover-shift-y: 0px;

  @apply maz:opacity-0;

  transform: translate(var(--m-popover-shift-x), var(--m-popover-shift-y)) scale(0.9);

  &[data-side='top'] {
    --m-popover-shift-y: 6px;
  }

  &[data-side='bottom'] {
    --m-popover-shift-y: -6px;
  }

  &[data-side='left'] {
    --m-popover-shift-x: 6px;
  }

  &[data-side='right'] {
    --m-popover-shift-x: -6px;
  }
}

/*
 * `scale-pop`, the default (tooltips, popovers): springs out of its trigger and is sucked back into it on close
 */
.maz-scale-pop-enter-active {
  transition:
    opacity calc(var(--maz-motion-normal, 200ms) * 0.5 * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    transform calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1))
      var(--maz-easing-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
}

.maz-scale-pop-leave-active {
  transition:
    opacity calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
    transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in);
}

.maz-scale-pop-enter-from {
  @apply maz:opacity-0;

  transform: scale(0.4);
}

.maz-scale-pop-leave-to {
  @apply maz:opacity-0;

  transform: scale(0.15);
}
</style>
