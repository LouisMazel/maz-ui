<script lang="ts" setup>
import type { Placement } from '@floating-ui/vue'
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types'

import { autoPlacement, autoUpdate, flip, offset as floatingOffset, hide, shift, useFloating } from '@floating-ui/vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { vClickOutside } from '../directives/vClickOutside'
import { getColor } from './types'

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
   * Emitted after the close animation
   */
  'after-close-animation': []
  /**
   * Emitted when popover toggles
   * @property {boolean} value - The new open state
   */
  'toggle': [value: boolean]
}>()

export type MazPopoverPosition = Placement | 'auto'
export type MazPopoverPreferPosition = Placement
export type MazPopoverFallbackPosition = Placement
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
   * @default popover
   */
  transition?: 'scale-pop' | 'scale-fade' | string
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

const middleware = computed(() => {
  const middleware = [
    floatingOffset(offset),
    hide(),
    shift({ padding: 5 }),
  ]

  const shouldUseAutoPlacement = position === 'auto' && !preferPosition && !fallbackPosition

  if (shouldUseAutoPlacement) {
    middleware.push(autoPlacement({
      allowedPlacements: ['top', 'bottom', 'left', 'right'],
    }))
  }
  else {
    middleware.push(flip({
      fallbackPlacements: fallbackPosition ? [fallbackPosition] : undefined,
    }))
  }
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
const reference = computed(() => getPositionReference() || triggerElement.value)

const { floatingStyles, placement, update, middlewareData } = useFloating(
  reference,
  panelElement,
  {
    placement: floatingPosition,
    middleware,
    transform: false,
    whileElementsMounted: autoUpdate,
  },
)

const computedPosition = computed(() => placement.value ?? floatingPosition.value)

function getPositionReference(): HTMLElement | null {
  if (!positionReference) {
    return triggerElement.value
  }

  if (typeof positionReference === 'string') {
    const withinTrigger = triggerElement.value?.querySelector<HTMLElement>(positionReference)

    if (withinTrigger) {
      return withinTrigger
    }

    return isClient() ? document.querySelector<HTMLElement>(positionReference) : null
  }

  return positionReference
}

const isOpen = defineModel<boolean>({ required: false, default: false })
let openTimeout: NodeJS.Timeout | null = null
let closeTimeout: NodeJS.Timeout | null = null
let initialFocusElement: HTMLElement | null = null
let ignoreNextClickOutside = false

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
  onKeydown?: (event: KeyboardEvent) => void
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
  `--${getColor(color)}`,
])

function cleanup() {
  clearOpenTimeout()
  clearCloseTimeout()

  if (isClient()) {
    document.removeEventListener('keydown', onKeydown)
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
    isOpen.value = value
    emits('toggle', value)

    nextTick(() => {
      update()
      setupFocusTrap()
    })
  }
  else {
    isOpen.value = value
    emits('toggle', value)
    emits('close')
    ignoreNextClickOutside = false

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
  if (role === 'tooltip' || effectiveTrigger.value === 'hover' || !trapFocus || !isClient())
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

  if (event.key === 'Tab' && trapFocus) {
    handleTrapFocus(event)
  }
}

function handleTrapFocus(event: KeyboardEvent) {
  if (!panelElement.value || !isClient())
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
    nextTick(() => update())
  }
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(cleanup)

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
  updatePosition: update,
})
</script>

<template>
  <div
    v-if="$slots.trigger"
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
        @binding {'click' | 'hover' | 'manual'} trigger The trigger type
      -->
      <slot name="trigger" :open="open" :close="close" :toggle="toggle" :is-open="isOpen" :trigger="effectiveTrigger" />
    </div>
  </div>

  <Teleport :to="teleportTo">
    <Transition :name="transitionName" appear @after-leave="emits('after-close-animation')">
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
        :style="[
          panelStyle,
          panelStyles,
          {
            transformOrigin: getTransformOrigin(computedPosition),
            visibility: middlewareData.hide?.referenceHidden
              ? 'hidden'
              : 'visible',
          },
        ]"
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
</template>

<style lang="postcss" scoped>
.m-popover {
  @apply maz-inline-block;

  .m-popover-trigger {
    @apply maz-inline-block maz-size-full;
  }

  &.--block {
    @apply maz-w-full;
  }
}

.m-popover-panel {
  @apply maz-fixed maz-outline-none maz-z-default-backdrop maz-rounded maz-drop-shadow-md maz-shadow-elevation;

  will-change: transform, opacity;
  contain: layout style paint;
  backface-visibility: hidden;

  /* Background color */
  &.--surface {
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

  &.--background {
    @apply maz-bg-surface maz-text-surface-foreground;
  }
}

.maz-scale-fade-enter-active,
.maz-scale-pop-enter-active {
  transition:
    opacity 150ms ease-out,
    transform 150ms ease-out;
}

.maz-scale-fade-leave-active,
.maz-scale-pop-leave-active {
  transition:
    opacity 150ms ease-in,
    transform 150ms ease-in;
}

.maz-scale-pop-leave-active {
  transition:
    opacity 150ms ease-in,
    transform 150ms ease-in;
}

/* Bottom positions - expand from top */
.m-popover-panel.--position-bottom,
.m-popover-panel.--position-bottom-start,
.m-popover-panel.--position-bottom-end {
  &.maz-scale-fade-enter-from,
  &.maz-scale-fade-leave-to {
    @apply maz-opacity-0;

    transform: scaleY(0.5);
    transform-origin: top center;
  }

  &.maz-scale-pop-enter-from,
  &.maz-scale-pop-leave-to {
    @apply maz-opacity-0;

    transform: scale(0.2) translateY(-4px);
    transform-origin: top center;
  }
}

/* Top positions - expand from bottom */
.m-popover-panel.--position-top,
.m-popover-panel.--position-top-start,
.m-popover-panel.--position-top-end {
  &.maz-scale-fade-enter-from,
  &.maz-scale-fade-leave-to {
    @apply maz-opacity-0;

    transform: scaleY(0.5);
    transform-origin: bottom center;
  }

  &.maz-scale-pop-enter-from,
  &.maz-scale-pop-leave-to {
    @apply maz-opacity-0;

    transform: scale(0.2) translateY(4px);
    transform-origin: bottom center;
  }
}

/* Right positions - expand from left */
.m-popover-panel.--position-right,
.m-popover-panel.--position-right-start,
.m-popover-panel.--position-right-end {
  &.maz-scale-fade-enter-from,
  &.maz-scale-fade-leave-to {
    @apply maz-opacity-0;

    transform: scaleX(0.5);
    transform-origin: left center;
  }

  &.maz-scale-pop-enter-from,
  &.maz-scale-pop-leave-to {
    @apply maz-opacity-0;

    transform: scale(0.2) translateX(-4px);
    transform-origin: left center;
  }
}

/* Left positions - expand from right */
.m-popover-panel.--position-left,
.m-popover-panel.--position-left-start,
.m-popover-panel.--position-left-end {
  &.maz-scale-fade-enter-from,
  &.maz-scale-fade-leave-to {
    @apply maz-opacity-0;

    transform: scaleX(0.5);
    transform-origin: right center;
  }

  &.maz-scale-pop-enter-from,
  &.maz-scale-pop-leave-to {
    @apply maz-opacity-0;

    transform: scale(0.2) translateX(4px);
    transform-origin: right center;
  }
}

/* Default fallback - only applies when no specific position class is present */
.m-popover-panel:not([class*='--position-']) {
  &.maz-scale-pop-enter-from,
  &.maz-scale-pop-leave-to {
    @apply maz-opacity-0;

    transform: scale(0.2);
    transform-origin: center;
  }

  &.maz-scale-fade-enter-from,
  &.maz-scale-fade-leave-to {
    @apply maz-opacity-0;

    transform: scale(0.5) translateY(-4px);
    transform-origin: center;
  }
}
</style>
