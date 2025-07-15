<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types'
import { isClient } from '@maz-ui/utils/src/helpers/isClient.js'

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { vClickOutside } from '../directives/vClickOutside'

/**
 * A versatile Vue 3 component for displaying content in overlays that bypass overflow constraints of parent elements.
 * Supports multiple positioning strategies, accessibility features, and various trigger modes.
 */
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
  hoverDelay = 200,
  transition = 'maz-popover',
  teleportTo = 'body',
  closeOnClickOutside = true,
  closeOnEscape = true,
  persistent = false,
  panelStyle,
  color = 'background',
  overlayClass,
  panelClass,
  preferPosition,
  fallbackPosition,
  trapFocus = true,
  keepOpenOnHover = false,
  block = false,
  announceChanges = false,
  positionReference,
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
   * Emitted when popover toggles
   * @property {boolean} value - The new open state
   */
  'toggle': [value: boolean]
}>()

export type MazPopoverPosition = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'
export type MazPopoverTrigger = 'click' | 'hover' | 'manual' | 'adaptive'
export type MazPopoverRole = 'dialog' | 'tooltip' | 'menu'

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
  preferPosition?: MazPopoverPosition

  /**
   * Fallback position of the popover relative to trigger when prefer position is not visible
   * @values auto, top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
   * @default auto
   * @description Fallback position of the popover relative to trigger
   */
  fallbackPosition?: MazPopoverPosition

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
   * @default maz-popover
   */
  transition?: string
  /**
   * Teleport target selector
   * @default body
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
   * Color variant of the popover
   * @values primary, secondary, accent, info, success, warning, destructive, contrast, background
   * @default background
   */
  color?: MazColor | 'background'
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
   * @type {string | HTMLElement}
   * @default undefined
   * @example "input" or "#my-input" or HTMLElement
   */
  positionReference?: string | HTMLElement
}

const triggerId = useInstanceUniqId({
  componentName: 'MazPopover',
  providedId: id,
})

const attrs = useAttrs()

const triggerElement = useTemplateRef<HTMLElement>('trigger')
const panelElement = useTemplateRef<HTMLElement>('panel')

// Get the position reference element (can be different from trigger)
function getPositionReference(): HTMLElement | null {
  if (!positionReference) {
    return triggerElement.value
  }

  if (typeof positionReference === 'string') {
    // If it's a selector, find it within the trigger element first, then globally
    const withinTrigger = triggerElement.value?.querySelector(positionReference)
    if (withinTrigger) {
      return withinTrigger as HTMLElement
    }
    return document.querySelector(positionReference) as HTMLElement
  }

  return positionReference
}

const isOpen = defineModel<boolean>('modelValue', { required: false, default: false })
// Initialize computed position
const computedPosition = ref<Omit<MazPopoverPosition, 'auto'>>(position === 'auto' ? 'bottom' : position)

let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null
let initialFocusElement: HTMLElement | null = null
let ignoreNextClickOutside = false

const panelId = computed(() => `${triggerId.value}-panel`)

const panelStyles = ref<HTMLAttributes['style']>()

const rootStyles = computed(() => attrs.style as HTMLAttributes['style'])

interface TriggerEventHandlers {
  onClick?: () => void
  onMouseenter?: () => void
  onMouseleave?: () => void
}

const isTouchDevice = computed(() => {
  if (!isClient())
    return false
  return 'ontouchstart' in globalThis || navigator.maxTouchPoints > 0
})

const effectiveTrigger = computed(() => {
  if (trigger === 'adaptive') {
    return isTouchDevice.value ? 'click' : 'hover'
  }
  return trigger
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
  }

  if (effectiveTrigger.value === 'click') {
    events.onClick = toggle
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
  `--${color}`,
])

// State variables for positioning
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let isPositioning = false
let positioningFrame: number | null = null

// Unified function to calculate and optionally apply position
function calculateAndApplyPosition(options: { applyStyles?: boolean, forAnimation?: boolean } = {}) {
  if (!triggerElement.value || !panelElement.value || isPositioning) {
    return null
  }

  const { applyStyles = true, forAnimation = false } = options

  if (applyStyles) {
    isPositioning = true

    // Cancel any pending positioning frame
    if (positioningFrame) {
      cancelAnimationFrame(positioningFrame)
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const doCalculation = () => {
    if (!triggerElement.value || !panelElement.value) {
      if (applyStyles)
        isPositioning = false
      return null
    }

    try {
      const viewport = { width: window.innerWidth, height: window.innerHeight }
      const positionRef = getPositionReference()
      if (!positionRef) {
        if (applyStyles)
          isPositioning = false
        return null
      }

      const triggerRect = positionRef.getBoundingClientRect()

      // For animation preparation, temporarily make panel invisible but present
      let wasHidden = false
      if (forAnimation) {
        wasHidden = panelElement.value.style.visibility === 'hidden'
        panelElement.value.style.visibility = 'hidden'
        panelElement.value.style.display = 'block'
      }

      let newPosition: Omit<MazPopoverPosition, 'auto'>
      if (position === 'auto') {
        newPosition = getBestPosition(triggerRect, viewport)
      }
      else {
        newPosition = position
      }

      // Always update computed position for CSS classes
      computedPosition.value = newPosition

      if (applyStyles) {
        const panelRect = panelElement.value.getBoundingClientRect()
        const styles = calculatePosition(newPosition, triggerRect, panelRect)

        // Apply position styles
        panelStyles.value = styles
      }

      // Restore original state for animation preparation
      if (forAnimation && !applyStyles) {
        if (wasHidden) {
          panelElement.value.style.visibility = 'hidden'
        }
        else {
          panelElement.value.style.display = ''
        }
      }

      return newPosition
    }
    catch (error) {
      console.warn('[MazPopover] Error calculating position:', error)
      return null
    }
    finally {
      if (applyStyles) {
        isPositioning = false
        positioningFrame = null
      }
    }
  }

  if (applyStyles) {
    positioningFrame = requestAnimationFrame(doCalculation)
    return null
  }
  else {
    return doCalculation()
  }
}

function updatePosition() {
  calculateAndApplyPosition({ applyStyles: true })
}

function schedulePositionUpdate() {
  if (isOpen.value && !isPositioning) {
    updatePosition()
  }
}

// Prepare position for smooth animation without visual jumps
function preparePositionForAnimation() {
  // For auto position, we need to update computedPosition before animation starts
  if (position === 'auto' && triggerElement.value) {
    const positionRef = getPositionReference()
    if (positionRef) {
      const triggerRect = positionRef.getBoundingClientRect()
      const viewport = { width: window.innerWidth, height: window.innerHeight }
      const newPosition = getBestPosition(triggerRect, viewport)
      computedPosition.value = newPosition
    }
  }
  return calculateAndApplyPosition({ applyStyles: false, forAnimation: true })
}

function setupObservers() {
  if (!panelElement.value || !triggerElement.value) {
    return
  }

  const positionRef = getPositionReference()
  if (!positionRef) {
    return
  }

  if (globalThis.ResizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      // Only update if the panel, trigger, or position reference size changed significantly
      for (const entry of entries) {
        if (entry.target === panelElement.value
          || entry.target === triggerElement.value
          || entry.target === positionRef) {
          schedulePositionUpdate()
          break
        }
      }
    })

    resizeObserver.observe(panelElement.value)
    resizeObserver.observe(triggerElement.value)

    // Also observe the position reference if it's different from trigger
    if (positionRef !== triggerElement.value) {
      resizeObserver.observe(positionRef)
    }

    // Also observe the document element for viewport changes
    resizeObserver.observe(document.documentElement)
  }

  // Observe content changes
  mutationObserver = new MutationObserver((mutations) => {
    if (isPositioning)
      return

    let shouldUpdate = false
    for (const mutation of mutations) {
      // Skip our own style changes
      if (mutation.target === panelElement.value
        && mutation.type === 'attributes'
        && mutation.attributeName === 'style') {
        continue
      }

      // Update on content changes
      if (mutation.type === 'childList'
        || (mutation.type === 'attributes'
          && mutation.attributeName === 'class')) {
        shouldUpdate = true
        break
      }
    }

    if (shouldUpdate) {
      schedulePositionUpdate()
    }
  })

  mutationObserver.observe(panelElement.value, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  })
}

function cleanupObservers() {
  if (positioningFrame) {
    cancelAnimationFrame(positioningFrame)
    positioningFrame = null
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (mutationObserver) {
    mutationObserver.disconnect()
    mutationObserver = null
  }
}

function open() {
  if (disabled)
    return

  clearCloseTimeout()

  // Only ignore next click outside for click triggers to prevent immediate close
  if (effectiveTrigger.value === 'click') {
    ignoreNextClickOutside = true
  }

  if (delay > 0) {
    openTimeout = setTimeout(() => {
      setOpen(true)
    }, delay)
  }
  else {
    setOpen(true)
  }
}

function close() {
  clearOpenTimeout()

  if (delay > 0 && effectiveTrigger.value === 'hover') {
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

function setOpen(value: boolean) {
  if (value) {
    emits('open')

    nextTick(() => {
      // Step 1: Prepare position calculation without applying styles (sets CSS classes)
      if (triggerElement.value && panelElement.value) {
        preparePositionForAnimation()
      }

      // Step 2: Open with proper positioning
      const openWithPosition = () => {
        isOpen.value = value
        emits('toggle', value)
        // Now apply the actual positioning styles
        updatePosition()
        setupObservers()
        setupFocusTrap()
      }

      openWithPosition()
    })
  }
  else {
    isOpen.value = value
    emits('toggle', value)
    emits('close')
    panelStyles.value = {
      position: 'fixed',
      visibility: 'hidden',
      pointerEvents: 'none',
    }
    ignoreNextClickOutside = false
    cleanupObservers()

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

function getBestPosition(
  triggerRect: DOMRect,
  viewport: { width: number, height: number },
): Omit<MazPopoverPosition, 'auto'> {
  if (!panelElement.value)
    return 'bottom'

  const panelRect = panelElement.value.getBoundingClientRect()

  if (preferPosition && isPositionVisible(preferPosition, triggerRect, panelRect, viewport)) {
    return preferPosition
  }

  else if (preferPosition && fallbackPosition) {
    return fallbackPosition
  }

  const positions: MazPopoverPosition[] = ['bottom', 'top', 'right', 'left']
  const validPositions = getValidPositions(positions, triggerRect, panelRect, viewport)

  if (validPositions.length === 0) {
    const spaces = {
      top: triggerRect.top,
      bottom: viewport.height - triggerRect.bottom,
      left: triggerRect.left,
      right: viewport.width - triggerRect.right,
    }

    const sortedPositions = positions.sort((a, b) => spaces[b as keyof typeof spaces] - spaces[a as keyof typeof spaces])

    return sortedPositions[0]
  }

  return validPositions.sort((a, b) => b.score - a.score)[0].position
}

// Calculate position using appropriate CSS properties for better positioning
// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
function calculatePosition(
  position: Omit<MazPopoverPosition, 'auto'>,
  triggerRect: DOMRect,
  _panelRect: DOMRect,
) {
  const viewport = { width: window.innerWidth, height: window.innerHeight }

  const styles: Record<string, string> = {
    position: 'fixed',
    visibility: 'visible',
    transformOrigin: getTransformOrigin(position),
  }

  switch (position) {
    case 'top':
    case 'top-start':
    case 'top-end':
      // Use bottom instead of top for top positions
      styles.bottom = `${viewport.height - triggerRect.top + offset}px`
      if (position === 'top-start') {
        styles.left = `${triggerRect.left}px`
      }
      else if (position === 'top-end') {
        styles.right = `${viewport.width - triggerRect.right}px`
      }
      else {
        styles.left = `${triggerRect.left + triggerRect.width / 2 - _panelRect.width / 2}px`
      }
      break

    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
      styles.top = `${triggerRect.bottom + offset}px`
      if (position === 'bottom-start') {
        styles.left = `${triggerRect.left}px`
      }
      else if (position === 'bottom-end') {
        styles.right = `${viewport.width - triggerRect.right}px`
      }
      else {
        styles.left = `${triggerRect.left + triggerRect.width / 2 - _panelRect.width / 2}px`
      }
      break

    case 'left':
    case 'left-start':
    case 'left-end':
      // Use right instead of left for left positions
      styles.right = `${viewport.width - triggerRect.left + offset}px`
      if (position === 'left-start') {
        styles.top = `${triggerRect.top}px`
      }
      else if (position === 'left-end') {
        styles.bottom = `${viewport.height - triggerRect.bottom}px`
      }
      else {
        styles.top = `${triggerRect.top + triggerRect.height / 2 - _panelRect.height / 2}px`
      }
      break

    case 'right':
    case 'right-start':
    case 'right-end':
      styles.left = `${triggerRect.right + offset}px`
      if (position === 'right-start') {
        styles.top = `${triggerRect.top}px`
      }
      else if (position === 'right-end') {
        styles.bottom = `${viewport.height - triggerRect.bottom}px`
      }
      else {
        styles.top = `${triggerRect.top + triggerRect.height / 2 - _panelRect.height / 2}px`
      }
      break
  }

  return styles
}

// Get transform origin based on position for better animations
function getTransformOrigin(position: Omit<MazPopoverPosition, 'auto'>): string {
  switch (position) {
    case 'top':
      // Uses bottom + translateX(-50%) → origin should be center bottom
      return 'center bottom'
    case 'top-start':
      // Uses bottom + left → origin should be left bottom
      return 'left bottom'
    case 'top-end':
      // Uses bottom + right → origin should be right bottom
      return 'right bottom'
    case 'bottom':
      // Uses top + translateX(-50%) → origin should be center top
      return 'center top'
    case 'bottom-start':
      // Uses top + left → origin should be left top
      return 'left top'
    case 'bottom-end':
      // Uses top + right → origin should be right top
      return 'right top'
    case 'left':
      // Uses right + translateY(-50%) → origin should be right center
      return 'right center'
    case 'left-start':
      // Uses right + top → origin should be right top
      return 'right top'
    case 'left-end':
      // Uses right + bottom → origin should be right bottom
      return 'right bottom'
    case 'right':
      // Uses left + translateY(-50%) → origin should be left center
      return 'left center'
    case 'right-start':
      // Uses left + top → origin should be left top
      return 'left top'
    case 'right-end':
      // Uses left + bottom → origin should be left bottom
      return 'left bottom'
    default:
      return 'center'
  }
}

function isPositionVisible(position: MazPopoverPosition, triggerRect: DOMRect, panelRect: DOMRect, viewport: { width: number, height: number }) {
  const styles = calculatePosition(position, triggerRect, panelRect)

  // Calculate actual coordinates from styles
  let top = 0
  let left = 0

  if (styles.top)
    top = Number.parseInt(styles.top)
  else if (styles.bottom)
    top = viewport.height - Number.parseInt(styles.bottom) - panelRect.height

  if (styles.left)
    left = Number.parseInt(styles.left)
  else if (styles.right)
    left = viewport.width - Number.parseInt(styles.right) - panelRect.width

  // Apply transform adjustments
  if (styles.transform?.includes('translateX(-50%)'))
    left -= panelRect.width / 2
  if (styles.transform?.includes('translateY(-50%)'))
    top -= panelRect.height / 2

  return left >= 0
    && left + panelRect.width <= viewport.width
    && top >= 0
    && top + panelRect.height <= viewport.height
}

function getValidPositions(positions: MazPopoverPosition[], triggerRect: DOMRect, panelRect: DOMRect, viewport: { width: number, height: number }) {
  const spaces = {
    bottom: viewport.height - triggerRect.bottom,
    top: triggerRect.top,
    right: viewport.width - triggerRect.right,
    left: triggerRect.left,
  }
  return positions.reduce<{ position: MazPopoverPosition, score: number }[]>((acc, pos) => {
    if (isPositionVisible(pos, triggerRect, panelRect, viewport)) {
      let positionBonus = 0
      if (pos === 'bottom')
        positionBonus = 1000
      else if (pos === 'top')
        positionBonus = 800
      else if (pos === 'right')
        positionBonus = 600
      else if (pos === 'left')
        positionBonus = 400
      const score = spaces[pos as keyof typeof spaces] + positionBonus
      acc.push({ position: pos, score })
    }
    return acc
  }, [])
}

function setupFocusTrap() {
  if (role === 'tooltip' || role === 'menu' || effectiveTrigger.value === 'hover' || !trapFocus)
    return

  initialFocusElement = document.activeElement as HTMLElement

  nextTick(() => {
    const focusableElements = panelElement.value?.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus({ preventScroll: true })
    }
    else {
      panelElement.value?.focus({ preventScroll: true })
    }
  })
}

function restoreFocus() {
  if (role === 'tooltip' || role === 'menu' || effectiveTrigger.value === 'hover' || !trapFocus)
    return

  nextTick(() => {
    initialFocusElement?.focus({ preventScroll: true })
  })
}

function onKeydown(event: KeyboardEvent) {
  if (!isOpen.value)
    return

  if (event.key === 'Escape' && closeOnEscape && !persistent) {
    event.preventDefault()
    close()
  }

  if ((role === 'dialog' || role === 'menu') && event.key === 'Tab') {
    handleTrapFocus(event)
  }
}

function handleTrapFocus(event: KeyboardEvent) {
  if (!panelElement.value)
    return

  const focusableElements = panelElement.value.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])',
  )

  if (focusableElements.length === 0)
    return

  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    }
  }
  else {
    if (document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }
}

function onClickOutside(event: Event) {
  if (effectiveTrigger.value === 'manual')
    return

  if (ignoreNextClickOutside) {
    ignoreNextClickOutside = false
    return
  }

  if (closeOnClickOutside && !persistent) {
    if (triggerElement.value && triggerElement.value.contains(event.target as Node)) {
      return
    }
    close()
  }
}

function onScrollThrottled() {
  if (isOpen.value) {
    schedulePositionUpdate()
  }
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
}, { immediate: true })

watch(() => position, (newPosition) => {
  // Update computed position immediately when position prop changes
  if (newPosition !== 'auto') {
    computedPosition.value = newPosition
  }

  if (isOpen.value) {
    nextTick(updatePosition)
  }
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScrollThrottled, { passive: true, capture: true })
  window.addEventListener('resize', onScrollThrottled, { passive: true })
})

onBeforeUnmount(() => {
  cleanupObservers()
  clearOpenTimeout()
  clearCloseTimeout()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScrollThrottled, true)
  window.removeEventListener('resize', onScrollThrottled)
})

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
   * @type {ComputedRef<boolean>}
   * @description Reactive reference to the popover open state
   * @usage `const isPopoverOpen = mazPopoverInstance.value?.isOpen`
   */
  isOpen: computed(() => isOpen.value),
  /**
   * Update the popover position
   * @description Manually recalculate and update the popover position
   * @usage `mazPopoverInstance.value?.updatePosition()`
   */
  updatePosition,
})
</script>

<template>
  <div
    class="m-popover m-reset-css"
    :class="[
      attrs.class,
      {
        '--open': isOpen,
        '--disabled': disabled,
        '--block': block,
      },
    ]"
    :style="rootStyles"
  >
    <div
      :id="triggerId"
      ref="trigger"
      role="button"
      class="m-popover-trigger"
      :aria-expanded="role === 'dialog' || role === 'menu' ? isOpen : undefined"
      :aria-haspopup="role === 'dialog' ? 'dialog' : undefined"
      :aria-describedby="role === 'tooltip' && isOpen ? panelId : ariaDescribedby"
      :aria-labelledby="ariaLabelledby"
      v-bind="triggerEvents"
    >
      <!--
        @slot Trigger element content
        @binding {function} open Function to open the popover
        @binding {function} close Function to close the popover
        @binding {function} toggle Function to toggle the popover
        @binding {boolean} is-open Current open state of the popover
      -->
      <slot name="trigger" :open="open" :close="close" :toggle="toggle" :is-open="isOpen" />
    </div>

    <Teleport :to="teleportTo" :disabled="!isOpen">
      <Transition
        :name="transition"
        appear
      >
        <div
          v-if="isOpen"
          :id="panelId"
          ref="panel"
          v-click-outside="onClickOutside"
          :role
          :aria-label="ariaLabel"
          :aria-labelledby="role === 'dialog' ? ariaLabelledby || triggerId : undefined"
          :aria-describedby="role === 'dialog' ? ariaDescribedby : undefined"
          :aria-modal="role === 'dialog' ? 'true' : undefined"
          :tabindex="role === 'dialog' ? '-1' : undefined"
          class="m-popover-panel"
          :aria-live="announceChanges ? 'polite' : undefined"
          :class="panelClasses"
          :style="[panelStyles, panelStyle]"
          v-bind="panelEvents"
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
  </div>
</template>

<style lang="postcss" scoped>
.m-popover {
  @apply maz-inline-block;
}

.m-popover.--block {
  @apply maz-w-full;

  .m-popover-trigger {
    @apply maz-w-full;
  }
}

.m-popover-trigger {
  @apply maz-inline-block;
}

.m-popover-panel {
  @apply maz-fixed maz-invisible maz-outline-none maz-z-default-backdrop maz-rounded maz-drop-shadow-md maz-shadow-elevation;

  will-change: transform, opacity;
  contain: layout style paint;
  backface-visibility: hidden;

  /* Background color */
  &.--background {
    @apply dark:maz-border dark:maz-border-divider maz-bg-surface;
  }

  /* Color variants */
  &.--primary {
    @apply maz-border-primary-600 maz-bg-primary maz-text-primary-foreground;
  }

  &.--secondary {
    @apply maz-border-secondary-600 maz-bg-secondary maz-text-secondary-foreground;
  }

  &.--success {
    @apply maz-border-success-600 maz-bg-success maz-text-success-foreground;
  }

  &.--warning {
    @apply maz-border-warning-600 maz-bg-warning maz-text-warning-foreground;
  }

  &.--destructive {
    @apply maz-border-destructive-600 maz-bg-destructive maz-text-destructive-foreground;
  }

  &.--info {
    @apply maz-border-info-600 maz-bg-info maz-text-info-foreground;
  }

  &.--accent {
    @apply maz-border-accent-600 maz-bg-accent maz-text-accent-foreground;
  }

  &.--contrast {
    @apply maz-border-contrast-600 maz-bg-contrast maz-text-contrast-foreground;
  }
}

.maz-popover-enter-active {
  @apply maz-transition-all maz-duration-200 maz-ease-out;
}

.maz-popover-leave-active {
  @apply maz-transition-all maz-duration-200 maz-ease-in;
}

/* Bottom positions - expand from top */
.m-popover-panel.--position-bottom,
.m-popover-panel.--position-bottom-start,
.m-popover-panel.--position-bottom-end {
  &.maz-popover-enter-from {
    @apply maz-opacity-0;

    transform: scaleY(0.8) translateY(-4px);
    transform-origin: top center;
  }

  &.maz-popover-leave-to {
    @apply maz-opacity-0;

    transform: scaleY(0.9) translateY(-4px);
    transform-origin: top center;
  }
}

/* Top positions - expand from bottom */
.m-popover-panel.--position-top,
.m-popover-panel.--position-top-start,
.m-popover-panel.--position-top-end {
  &.maz-popover-enter-from {
    @apply maz-opacity-0;

    transform: scaleY(0.8) translateY(4px);
    transform-origin: bottom center;
  }

  &.maz-popover-leave-to {
    @apply maz-opacity-0;

    transform: scaleY(0.9) translateY(4px);
    transform-origin: bottom center;
  }
}

/* Right positions - expand from left */
.m-popover-panel.--position-right,
.m-popover-panel.--position-right-start,
.m-popover-panel.--position-right-end {
  &.maz-popover-enter-from {
    @apply maz-opacity-0;

    transform: scaleX(0.8) translateX(-4px);
    transform-origin: left center;
  }

  &.maz-popover-leave-to {
    @apply maz-opacity-0;

    transform: scaleX(0.9) translateX(-4px);
    transform-origin: left center;
  }
}

/* Left positions - expand from right */
.m-popover-panel.--position-left,
.m-popover-panel.--position-left-start,
.m-popover-panel.--position-left-end {
  &.maz-popover-enter-from {
    @apply maz-opacity-0;

    transform: scaleX(0.8) translateX(4px);
    transform-origin: right center;
  }

  &.maz-popover-leave-to {
    @apply maz-opacity-0;

    transform: scaleX(0.9) translateX(4px);
    transform-origin: right center;
  }
}

/* Default fallback - only applies when no specific position class is present */
.m-popover-panel:not([class*='--position-']) {
  &.maz-popover-enter-from {
    @apply maz-opacity-0;

    transform: scale(0.95) translateY(-4px);
    transform-origin: center;
  }

  &.maz-popover-leave-to {
    @apply maz-opacity-0;

    transform: scale(0.98);
    transform-origin: center;
  }
}
</style>
