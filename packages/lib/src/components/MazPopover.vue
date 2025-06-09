<script lang="ts" setup>
import type { HTMLAttributes, StyleValue } from 'vue'
import type { MazColor } from './types'
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useAttrs,
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
  modelValue = false,
  position = 'auto',
  trigger = 'click',
  role = 'dialog',
  disabled = false,
  offset = 8,
  delay = 0,
  transition = 'maz-popover',
  teleportTo = 'body',
  closeOnClickOutside = true,
  closeOnEscapeKey = true,
  persistent = false,
  panelStyle,
  color = 'contrast',
  overlayClass,
  panelClass,
} = defineProps<MazPopoverProps>()
const emits = defineEmits<{
  /**
   * Emitted when popover state changes
   * @property {boolean} value - The new open state
   */
  'update:modelValue': [value: boolean]
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
export type PopoverRole = 'dialog' | 'tooltip'

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
  panelStyle?: StyleValue
  /**
   * Close popover when clicking outside
   * @default true
   */
  closeOnClickOutside?: boolean
  /**
   * Close popover when pressing Escape key
   * @default true
   */
  closeOnEscapeKey?: boolean
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
   * @values primary, secondary, accent, info, success, warning, destructive, contrast, default
   * @default contrast
   */
  color?: MazColor | 'default'
}

const triggerId = useInstanceUniqId({
  componentName: 'MazPopover',
  providedId: id,
})

const attrs = useAttrs()

const triggerElement = ref<HTMLElement>()
const panelElement = ref<HTMLElement>()
const isOpen = ref(modelValue)
const computedPosition = ref<PopoverPosition>(position)

let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null
let initialFocusElement: HTMLElement | null = null

const panelId = computed(() => `${triggerId.value}-panel`)

const panelStyles = ref<StyleValue>()

const rootStyles = computed(() => {
  return attrs.style as StyleValue
})

const triggerEvents = computed(() => {
  if (disabled || trigger === 'manual')
    return {}

  const events: Record<string, () => void> = {}

  if (trigger === 'hover') {
    events.onMouseenter = open
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
    onMouseenter: () => clearCloseTimeout(),
    onMouseleave: close,
  }
})

const panelClasses = computed(() => [
  overlayClass,
  panelClass,
  `--position-${computedPosition.value}`,
  `--${color}`,
])

function open() {
  if (disabled || isOpen.value)
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

function close() {
  if (!isOpen.value)
    return

  clearOpenTimeout()

  if (delay > 0 && trigger === 'hover') {
    closeTimeout = setTimeout(() => {
      setOpen(false)
    }, delay)
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
  if (value === isOpen.value)
    return

  isOpen.value = value
  emits('update:modelValue', value)
  emits('toggle', value)

  if (value) {
    emits('open')
    nextTick(() => {
      updatePosition()
      setupFocusTrap()
    })
  }
  else {
    emits('close')
    restoreFocus()
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

function updatePosition() {
  if (!triggerElement.value || !panelElement.value)
    return

  const trigger = triggerElement.value
  const panel = panelElement.value
  const viewport = { width: window.innerWidth, height: window.innerHeight }
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft

  const triggerRect = trigger.getBoundingClientRect()
  const panelRect = panel.getBoundingClientRect()

  let newPosition = position

  if (position === 'auto') {
    newPosition = getBestPosition(triggerRect, viewport)
  }

  const coordinates = calculatePosition(newPosition, triggerRect, panelRect, scrollTop, scrollLeft)

  panelStyles.value = {
    position: 'absolute',
    top: `${coordinates.top}px`,
    left: `${coordinates.left}px`,
    zIndex: 9999,
    ...(panelStyle as Record<string, string> || {}),
  }

  computedPosition.value = position
}

function getBestPosition(
  triggerRect: DOMRect,
  viewport: { width: number, height: number },
): PopoverPosition {
  if (!panelElement.value)
    return 'bottom'

  const panelRect = panelElement.value.getBoundingClientRect()
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft

  const positions: PopoverPosition[] = ['bottom', 'top', 'right', 'left']
  const validPositions: { position: PopoverPosition, score: number }[] = []

  for (const pos of positions) {
    const coords = calculatePosition(pos, triggerRect, panelRect, scrollTop, scrollLeft)

    const isVisible
      = coords.left >= scrollLeft
        && coords.left + panelRect.width <= scrollLeft + viewport.width
        && coords.top >= scrollTop
        && coords.top + panelRect.height <= scrollTop + viewport.height

    if (isVisible) {
      const spaces = {
        bottom: viewport.height + scrollTop - triggerRect.bottom,
        top: triggerRect.top - scrollTop,
        right: viewport.width + scrollLeft - triggerRect.right,
        left: triggerRect.left - scrollLeft,
      }

      let positionBonus = 0

      if (pos === 'bottom') {
        positionBonus = 1000
      }
      else if (pos === 'top') {
        positionBonus = 800
      }
      else if (pos === 'right') {
        positionBonus = 600
      }
      else if (pos === 'left') {
        positionBonus = 400
      }

      const score = spaces[pos as keyof typeof spaces] + positionBonus

      validPositions.push({ position: pos, score })
    }
  }

  if (validPositions.length === 0) {
    const spaces = {
      top: triggerRect.top,
      bottom: viewport.height - triggerRect.bottom,
      left: triggerRect.left,
      right: viewport.width - triggerRect.right,
    }

    const sortedPositions = positions.sort((a, b) => {
      const spaceA = spaces[a as keyof typeof spaces]
      const spaceB = spaces[b as keyof typeof spaces]
      return spaceB - spaceA
    })

    return sortedPositions[0]
  }

  validPositions.sort((a, b) => b.score - a.score)
  return validPositions[0].position
}

// eslint-disable-next-line sonarjs/cognitive-complexity, complexity
function calculatePosition(
  position: PopoverPosition,
  triggerRect: DOMRect,
  panelRect: DOMRect,
  scrollTop: number,
  scrollLeft: number,
) {
  let top = 0
  let left = 0

  const newOffset = offset

  switch (position) {
    case 'top':
    case 'top-start':
    case 'top-end':
      top = triggerRect.top + scrollTop - panelRect.height - newOffset
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
      top = triggerRect.bottom + scrollTop + newOffset
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
      left = triggerRect.left + scrollLeft - panelRect.width - newOffset
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
      left = triggerRect.right + scrollLeft + newOffset
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
  if (role === 'tooltip' || trigger === 'hover')
    return

  initialFocusElement = document.activeElement as HTMLElement

  nextTick(() => {
    const focusableElements = panelElement.value?.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus({ preventScroll: true })
    }
    else {
      panelElement.value?.focus({ preventScroll: true })
    }
  })
}

function restoreFocus() {
  if (role === 'tooltip' || trigger === 'hover')
    return

  nextTick(() => {
    initialFocusElement?.focus({ preventScroll: true })
  })
}

function onKeydown(event: KeyboardEvent) {
  if (!isOpen.value)
    return

  if (event.key === 'Escape' && closeOnEscapeKey && !persistent) {
    event.preventDefault()
    close()
  }

  if (role === 'dialog' && event.key === 'Tab') {
    trapFocus(event)
  }
}

function trapFocus(event: KeyboardEvent) {
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

watch(() => modelValue, (value) => {
  if (value !== isOpen.value) {
    setOpen(value)
  }
})

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
    class="m-popover"
    :class="[
      attrs.class,
      {
        '--open': isOpen,
        '--disabled': disabled,
      },
    ]"
    :style="rootStyles"
  >
    <div
      :id="triggerId"
      ref="triggerElement"
      class="m-popover-trigger"
      :aria-expanded="role === 'dialog' ? isOpen : undefined"
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
        @binding {boolean} isOpen Current open state of the popover
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
          ref="panelElement"
          v-click-outside="onClickOutside"
          :role
          :aria-labelledby="role === 'dialog' ? ariaLabelledby || triggerId : undefined"
          :aria-describedby="role === 'dialog' ? ariaDescribedby : undefined"
          :aria-modal="role === 'dialog' ? 'true' : undefined"
          :tabindex="role === 'dialog' ? '-1' : undefined"
          class="m-popover-panel"
          :class="panelClasses"
          :style="panelStyles"
          v-bind="panelEvents"
        >
          <!--
            @slot Popover content
            @binding {function} open Function to open the popover
            @binding {function} close Function to close the popover
            @binding {function} toggle Function to toggle the popover
            @binding {boolean} isOpen Current open state of the popover
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

  &.--disabled {
    @apply maz-pointer-events-none maz-opacity-50;
  }
}

.m-popover-trigger {
  @apply maz-inline-block;
}

.m-popover-panel {
  @apply maz-absolute maz-outline-none maz-z-default-backdrop maz-max-w-xs maz-rounded maz-shadow-lg maz-border;

  /* Default color */
  &.--default {
    @apply maz-border-divider maz-bg-surface maz-text-foreground;
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

.maz-popover-enter-from {
  @apply maz-opacity-0;

  transform: scale(0.95) translateY(-4px);
}

.maz-popover-leave-to {
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
