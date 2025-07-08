<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types'
import { isClient } from '@maz-ui/utils/src/utils/isClient.js'
import { throttle } from '@maz-ui/utils/src/utils/throttle.js'
import {
  computed,
  nextTick,
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
  positionDelay = 50,
  announceChanges = false,
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

export type PopoverPosition = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end'
export type PopoverTrigger = 'click' | 'hover' | 'manual'
export type PopoverRole = 'dialog' | 'tooltip' | 'menu'

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
  position?: PopoverPosition

  /**
   * Preferred position of the popover relative to trigger when auto position is used
   * @values auto, top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
   * @default 'bottom-start'
   * @description Preferred position of the popover relative to trigger
   */
  preferPosition?: PopoverPosition

  /**
   * Fallback position of the popover relative to trigger when prefer position is not visible
   * @values auto, top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
   * @default auto
   * @description Fallback position of the popover relative to trigger
   */
  fallbackPosition?: PopoverPosition

  /**
   * How the popover is triggered
   * @values click, hover, manual
   * @default click
   * @description How the popover is triggered
   */
  trigger?: PopoverTrigger
  /**
   * ARIA role for accessibility
   * @values dialog, tooltip
   * @default dialog
   * @description ARIA role for accessibility
   */
  role?: PopoverRole
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
   * Delay before setting the position in milliseconds
   * @description Useful when the popover content is not immediately visible or rendered
   * @default 50
   */
  positionDelay?: number
}

const triggerId = useInstanceUniqId({
  componentName: 'MazPopover',
  providedId: id,
})

const attrs = useAttrs()

const triggerElement = useTemplateRef<HTMLElement>('trigger')
const panelElement = useTemplateRef<HTMLElement>('panel')

const isOpen = defineModel<boolean>('modelValue', { required: false, default: false })
const computedPosition = ref<Omit<PopoverPosition, 'auto'>>(position)

let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null
let initialFocusElement: HTMLElement | null = null
let ignoreNextClickOutside = false

const panelId = computed(() => `${triggerId.value}-panel`)

const panelStyles = ref<HTMLAttributes['style']>()

const rootStyles = computed(() => attrs.style as HTMLAttributes['style'])

const triggerEvents = computed(() => {
  if (disabled || trigger === 'manual')
    return {}

  const events: Record<string, () => void> = {}

  if (trigger === 'hover') {
    events.onMouseenter = () => {
      clearCloseTimeout()
      open()
    }
    events.onMouseleave = close
  }

  if (trigger === 'click') {
    events.onClick = toggle
  }

  return events
})

const panelEvents = computed(() => {
  if (trigger !== 'hover')
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

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let isUpdatingPosition = false

function updatePosition() {
  if (!triggerElement.value || !panelElement.value || isUpdatingPosition)
    return

  isUpdatingPosition = true

  const viewport = { width: window.innerWidth, height: window.innerHeight }
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft

  let newPosition: Omit<PopoverPosition, 'auto'> | undefined

  const triggerRect = triggerElement.value.getBoundingClientRect()

  if (position === 'auto') {
    newPosition = getBestPosition(triggerRect, viewport)
  }
  else {
    newPosition = position
  }

  const panelRect = panelElement.value.getBoundingClientRect()
  const coordinates = calculatePosition(newPosition, triggerRect, panelRect, scrollTop, scrollLeft)

  panelStyles.value = {
    position: 'absolute',
    top: `${coordinates.top}px`,
    left: `${coordinates.left}px`,
    visibility: 'visible',
  }

  computedPosition.value = newPosition

  isUpdatingPosition = false
}

const trottledUpdatePosition = throttle(() => {
  if (isOpen.value && !isUpdatingPosition) {
    nextTick(updatePosition)
  }
}, 16)

function setupObservers() {
  if (!panelElement.value) {
    return
  }

  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      if (!isUpdatingPosition) {
        trottledUpdatePosition()
      }
    })
    resizeObserver.observe(panelElement.value)
  }

  mutationObserver = new MutationObserver((mutations) => {
    if (isUpdatingPosition)
      return

    const relevantMutations = mutations.filter((mutation) => {
      if (mutation.target === panelElement.value && mutation.type === 'attributes' && mutation.attributeName === 'style') {
        return false
      }

      return (
        mutation.type === 'childList'
        || (mutation.type === 'attributes'
          && mutation.attributeName === 'class'
          && mutation.target !== panelElement.value)
      )
    })

    if (relevantMutations.length > 0) {
      trottledUpdatePosition()
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
  ignoreNextClickOutside = true

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

  if (delay > 0 && trigger === 'hover') {
    closeTimeout = setTimeout(() => {
      setOpen(false)
    }, delay)
  }
  else if (trigger === 'hover' && keepOpenOnHover) {
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
  isOpen.value = value
  emits('toggle', value)

  if (value) {
    emits('open')
    setupFocusTrap()

    nextTick(() => {
      setTimeout(() => {
        updatePosition()
        setupObservers()
      }, positionDelay)
    })
  }
  else {
    emits('close')
    panelStyles.value = undefined
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

function getIsVisible(coords: { left: number, top: number }, panelRect: DOMRect, viewport: { width: number, height: number }, scrollTop: number, scrollLeft: number) {
  return coords.left >= scrollLeft
    && coords.left + panelRect.width <= scrollLeft + viewport.width
    && coords.top >= scrollTop
    && coords.top + panelRect.height <= scrollTop + viewport.height
}

function isPositionVisible(position: PopoverPosition, triggerRect: DOMRect, panelRect: DOMRect, viewport: { width: number, height: number }, scrollTop: number, scrollLeft: number) {
  const coords = calculatePosition(position, triggerRect, panelRect, scrollTop, scrollLeft)
  return getIsVisible(coords, panelRect, viewport, scrollTop, scrollLeft)
}

function getValidPositions(positions: PopoverPosition[], triggerRect: DOMRect, panelRect: DOMRect, viewport: { width: number, height: number }, scrollTop: number, scrollLeft: number) {
  const spaces = {
    bottom: viewport.height + scrollTop - triggerRect.bottom,
    top: triggerRect.top - scrollTop,
    right: viewport.width + scrollLeft - triggerRect.right,
    left: triggerRect.left - scrollLeft,
  }
  return positions.reduce<{ position: PopoverPosition, score: number }[]>((acc, pos) => {
    if (isPositionVisible(pos, triggerRect, panelRect, viewport, scrollTop, scrollLeft)) {
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

function getBestPosition(
  triggerRect: DOMRect,
  viewport: { width: number, height: number },
): Omit<PopoverPosition, 'auto'> {
  if (!panelElement.value)
    return 'bottom'

  const panelRect = panelElement.value.getBoundingClientRect()
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft

  if (preferPosition && isPositionVisible(preferPosition, triggerRect, panelRect, viewport, scrollTop, scrollLeft)) {
    return preferPosition
  }

  else if (preferPosition && fallbackPosition) {
    return fallbackPosition
  }

  const positions: PopoverPosition[] = ['bottom', 'top', 'right', 'left']
  const validPositions = getValidPositions(positions, triggerRect, panelRect, viewport, scrollTop, scrollLeft)

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

// eslint-disable-next-line sonarjs/cognitive-complexity, complexity
function calculatePosition(
  position: Omit<PopoverPosition, 'auto'>,
  triggerRect: DOMRect,
  panelRect: DOMRect,
  scrollTop: number,
  scrollLeft: number,
) {
  let top = 0
  let left = 0

  switch (position) {
    case 'top':
    case 'top-start':
    case 'top-end':
      top = triggerRect.top + scrollTop - panelRect.height - offset
      if (position === 'top-start') {
        left = triggerRect.left + scrollLeft
      }
      else if (position === 'top-end') {
        left = triggerRect.right + scrollLeft - panelRect.width
      }
      else {
        left = triggerRect.left + scrollLeft + (triggerRect.width - panelRect.width) / 2
      }
      break

    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
      top = triggerRect.bottom + scrollTop + offset
      if (position === 'bottom-start') {
        left = triggerRect.left + scrollLeft
      }
      else if (position === 'bottom-end') {
        left = triggerRect.right + scrollLeft - panelRect.width
      }
      else {
        left = triggerRect.left + scrollLeft + (triggerRect.width - panelRect.width) / 2
      }
      break

    case 'left':
    case 'left-start':
    case 'left-end':
      left = triggerRect.left + scrollLeft - panelRect.width - offset
      if (position === 'left-start') {
        top = triggerRect.top + scrollTop
      }
      else if (position === 'left-end') {
        top = triggerRect.bottom + scrollTop - panelRect.height
      }
      else {
        top = triggerRect.top + scrollTop + (triggerRect.height - panelRect.height) / 2
      }
      break

    case 'right':
    case 'right-start':
    case 'right-end':
      left = triggerRect.right + scrollLeft + offset
      if (position === 'right-start') {
        top = triggerRect.top + scrollTop
      }
      else if (position === 'right-end') {
        top = triggerRect.bottom + scrollTop - panelRect.height
      }
      else {
        top = triggerRect.top + scrollTop + (triggerRect.height - panelRect.height) / 2
      }
      break
  }

  return { top, left }
}

function setupFocusTrap() {
  if (role === 'tooltip' || role === 'menu' || trigger === 'hover' || !trapFocus)
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
  if (role === 'tooltip' || role === 'menu' || trigger === 'hover' || !trapFocus)
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
  if (trigger === 'manual')
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

function onScroll() {
  if (isOpen.value) {
    updatePosition()
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

watch(() => position, () => {
  if (isOpen.value) {
    nextTick(updatePosition)
  }
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onScroll)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onScroll)
  clearOpenTimeout()
  clearCloseTimeout()
  cleanupObservers()
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
   * @type {Ref<boolean>}
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
  @apply maz-absolute maz-invisible maz-outline-none maz-z-default-backdrop maz-rounded maz-drop-shadow-md maz-shadow-elevation;

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

.maz-popover-enter-active,
.maz-popover-leave-active {
  @apply maz-transition-all maz-duration-200 maz-ease-out;

  transform-origin: var(--popover-origin, center);
}

.maz-popover-leave-to,
.maz-popover-enter-from {
  @apply maz-opacity-0;

  transform: scale(0.95) translateY(-4px);
}

.m-popover-panel.--position-top,
.m-popover-panel.--position-top-start,
.m-popover-panel.--position-top-end {
  --popover-origin: bottom center;
}

.m-popover-panel.--position-bottom,
.m-popover-panel.--position-bottom-start,
.m-popover-panel.--position-bottom-end {
  --popover-origin: top center;
}

.m-popover-panel.--position-left,
.m-popover-panel.--position-left-start,
.m-popover-panel.--position-left-end {
  --popover-origin: center right;
}

.m-popover-panel.--position-right,
.m-popover-panel.--position-right-start,
.m-popover-panel.--position-right-end {
  --popover-origin: center left;
}
</style>
