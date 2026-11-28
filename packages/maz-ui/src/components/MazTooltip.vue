<script lang="ts" setup>
import type { TooltipGroupMember } from '../utils/tooltipSlideGroup.ts'
import type { MazPopoverPosition, MazPopoverProps } from './MazPopover.vue'
import { computed, nextTick, onBeforeUnmount, useSlots, useTemplateRef, watch } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { hasSlotContent } from '../utils/hasSlotContent.ts'
import { forgetTooltip, markTooltipClosed, markTooltipOpen, shouldSkipTooltipDelay } from '../utils/tooltipGroup.ts'
import { getActiveTooltip, releaseActiveTooltip, setActiveTooltip } from '../utils/tooltipSlideGroup.ts'
import MazPopover from './MazPopover.vue'

export interface MazTooltipProps {
  /**
   * The text of the tooltip. Use the `content` slot for a rich content
   */
  text?: string
  /**
   * A keyboard shortcut shown next to the text, as it is displayed (`⌘K`, `Ctrl+K`: the `label` of `useShortcut`)
   */
  shortcut?: string
  /**
   * Position of the tooltip relative to its trigger
   * @values top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end, auto
   * @default top
   */
  position?: MazPopoverPosition
  /**
   * Delay before the tooltip opens, in ms. A tooltip opened right after another one has no delay
   * @default 300
   */
  delay?: number
  /**
   * Name of a group of tooltips: moving from a trigger to another one of the group slides the bubble instead of closing and opening it
   */
  group?: string
  /**
   * Color of the bubble
   * @values primary, secondary, accent, info, success, warning, destructive, contrast, neutral, surface, container
   * @default contrast
   */
  color?: MazPopoverProps['color']
  /**
   * Distance between the trigger and the bubble, in pixels
   * @default 8
   */
  offset?: number
  /**
   * Disables the tooltip
   * @default false
   */
  disabled?: boolean
  /**
   * Transition of the bubble
   * @default 'scale-pop'
   */
  transition?: MazPopoverProps['transition']
  /**
   * CSS classes of the bubble
   */
  panelClass?: MazPopoverProps['panelClass']
}

defineOptions({
  name: 'MazTooltip',
})

const {
  text,
  shortcut,
  position = 'top',
  delay = 300,
  group,
  color = 'contrast',
  offset = 8,
  disabled = false,
  transition = 'scale-pop',
  panelClass,
} = defineProps<MazTooltipProps>()

const emits = defineEmits<{
  /** Emitted when the tooltip opens */
  open: []
  /** Emitted when the tooltip closes */
  close: []
}>()

defineSlots<{
  /** The element the tooltip describes: a button, an icon... */
  default?: () => unknown
  /** Rich content of the bubble, instead of `text` */
  content?: () => unknown
}>()

/**
 * Open state, to open the tooltip yourself
 * @model
 */
const isOpen = defineModel<boolean>({ default: false })

const slots = useSlots()
const popover = useTemplateRef('popover')
const { shouldReduceMotion } = useReducedMotion()

const GROUP_GRACE = 100
const SLIDE_DURATION = 180

const key = {}
const member: TooltipGroupMember = {
  dismiss() {
    const rect = popover.value?.panelRef?.getBoundingClientRect()

    cancelTimers()

    const panel = popover.value?.panelRef

    if (panel)
      panel.style.transition = 'none'

    isOpen.value = false

    return rect
  },
}

let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined

const hasContent = computed(() => !!text || hasSlotContent(slots.content))

function cancelTimers() {
  clearTimeout(openTimer)
  clearTimeout(closeTimer)
}

function openNow() {
  if (disabled || !hasContent.value)
    return

  let from: DOMRect | undefined

  if (group) {
    const previous = getActiveTooltip(group)

    if (previous && previous !== member)
      from = previous.dismiss()

    setActiveTooltip(group, member)
  }

  isOpen.value = true

  if (from && !shouldReduceMotion.value)
    void slideFrom(from)
}

function show() {
  cancelTimers()

  if (isOpen.value)
    return

  const wait = shouldSkipTooltipDelay() ? 0 : delay

  if (wait > 0)
    openTimer = setTimeout(openNow, wait)
  else
    openNow()
}

function hide(event?: Event) {
  cancelTimers()

  if (!isOpen.value)
    return

  // A short grace lets the pointer move onto the bubble (WCAG 1.4.13) or to the next tooltip of the group
  if (group || event?.type === 'mouseleave')
    closeTimer = setTimeout(() => (isOpen.value = false), GROUP_GRACE)
  else
    isOpen.value = false
}

function keepOpen() {
  cancelTimers()
}

async function slideFrom(from: DOMRect) {
  await nextTick()

  requestAnimationFrame(() => {
    const panel = popover.value?.panelRef

    if (!panel)
      return

    const to = panel.getBoundingClientRect()

    panel.style.transition = 'none'
    panel.animate?.(
      [
        { translate: `${from.left - to.left}px ${from.top - to.top}px` },
        { translate: '0 0' },
      ],
      {
        duration: SLIDE_DURATION * (shouldReduceMotion.value ? 0 : 1),
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    )
  })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    cancelTimers()
    isOpen.value = false
  }
}

watch(isOpen, (value) => {
  if (value) {
    markTooltipOpen(key)
    emits('open')
  }
  else {
    markTooltipClosed(key)
    emits('close')

    if (group)
      releaseActiveTooltip(group, member)
  }
})

watch(() => disabled, (value) => {
  if (value)
    isOpen.value = false
})

onBeforeUnmount(() => {
  cancelTimers()
  forgetTooltip(key)

  if (group)
    releaseActiveTooltip(group, member)
})

defineExpose({
  /** Opens the tooltip without delay */
  open: openNow,
  /** Closes the tooltip */
  close: () => {
    cancelTimers()
    isOpen.value = false
  },
})
</script>

<template>
  <MazPopover
    ref="popover"
    v-model="isOpen"
    class="m-tooltip"
    trigger="manual"
    role="tooltip"
    :position
    :color
    :offset
    :transition
    :disabled="disabled || !hasContent"
    :close-on-click-outside="false"
    :trap-focus="false"
    :panel-class="['m-tooltip-panel maz:max-w-xs maz:p-0 maz:text-sm maz:break-words maz:whitespace-pre-wrap', panelClass]"
  >
    <template #trigger>
      <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
      <span
        class="m-tooltip__trigger"
        @mouseenter="show"
        @mouseleave="hide"
        @focusin="show"
        @focusout="hide"
        @keydown="onKeydown"
        @pointerdown="hide"
      >
        <!-- @slot The element the tooltip describes -->
        <slot />
      </span>
    </template>

    <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
    <span class="m-tooltip__content maz:flex maz:items-center maz:gap-2 maz:p-2" @mouseenter="keepOpen" @mouseleave="hide">
      <!-- @slot Rich content of the bubble, instead of `text` -->
      <slot name="content">
        <span>{{ text }}</span>
      </slot>
      <kbd v-if="shortcut" dir="ltr" class="m-tooltip__kbd">{{ shortcut }}</kbd>
    </span>
  </MazPopover>
</template>

<style scoped>
.m-tooltip__trigger {
  display: contents;
}

.m-tooltip__kbd {
  padding-inline: 0.375rem;
  border-radius: 0.25rem;
  background-color: color-mix(in oklab, currentcolor 18%, transparent);
  font-family: inherit;
  font-size: 0.75em;
  line-height: 1.5;
  white-space: nowrap;
}
</style>
