<script lang="ts" setup>
import type { VNode } from 'vue'
import type { MazColor, MazSize } from './types'
import { computed } from 'vue'
import { hasSlotContent } from '../utils/hasSlotContent'
import { getColor } from './types'

export type MazIndicatorPosition = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'

export interface MazIndicatorProps {
  /**
   * Content of the indicator: a number for a counter (notifications, unread
   * messages) or a short text. Without it, the indicator is a dot (a status)
   */
  content?: number | string
  /**
   * Highest number displayed by a counter: above, it shows `{max}+`
   * @default 99
   */
  max?: number
  /**
   * Show the counter when its content is `0` (hidden by default, like an empty notification count)
   * @default false
   */
  showZero?: boolean
  /**
   * Color of the indicator
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast'`
   * @default 'primary'
   */
  color?: Exclude<MazColor, 'transparent'>
  /**
   * Corner of the wrapped content where the indicator sits (with a default slot or `attached`)
   * @values `'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'`
   * @default 'top-end'
   */
  position?: MazIndicatorPosition
  /**
   * Shape of the wrapped content: on a `circular` one (an avatar), the indicator
   * moves in to stay on the edge of the circle
   * @values `'rectangular' | 'circular'`
   * @default 'rectangular'
   */
  overlap?: 'rectangular' | 'circular'
  /**
   * Size of the indicator. Without it, it follows the font size of its context
   * @values `'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
   */
  size?: MazSize
  /**
   * Ring around the indicator to detach it from the wrapped content. It takes
   * the container background: override `--m-indicator-ring` on another surface
   * @default true with a default slot or `attached`, false otherwise
   */
  bordered?: boolean
  /**
   * Animated halo around the indicator (a live status). Disabled when the user reduces motion
   * @default false
   */
  pulse?: boolean
  /**
   * Place the indicator on a corner of its nearest positioned parent instead of
   * inline, to add it to an element without wrapping it
   * @default false
   */
  attached?: boolean
  /**
   * Hide the indicator (the wrapped content stays)
   * @default false
   */
  invisible?: boolean
  /**
   * Accessible name of the indicator ("Online", "3 unread messages"...).
   * Without it, the indicator is decorative and hidden from assistive technologies
   */
  label?: string
}

const {
  content,
  max = 99,
  showZero = false,
  color = 'primary',
  position = 'top-end',
  overlap = 'rectangular',
  size,
  bordered = undefined,
  pulse = false,
  attached = false,
  invisible = false,
  label,
} = defineProps<MazIndicatorProps>()

const slots = defineSlots<{
  /** Content on a corner of which the indicator sits (an avatar, a button, an icon) */
  default?: () => VNode[]
  /** Replace the text of a counter */
  content?: (props: {
    /** The text of the counter (`99+` above `max`) */
    text: string
  }) => VNode[]
}>()

const isWrapper = computed(() => hasSlotContent(slots.default))

const isPlaced = computed(() => isWrapper.value || attached)

const isDot = computed(() => content === undefined || content === null || content === '')

const isVisible = computed(() => !invisible && (showZero || content !== 0))

const text = computed(() => {
  if (typeof content === 'number') {
    return content > max
      ? `${max}+`
      : String(content)
  }
  return content ?? ''
})

const resolvedColor = computed(() => getColor(color))

const SIZE_CLASS = {
  mini: 'maz:text-[0.5rem]',
  xs: 'maz:text-[0.5625rem]',
  sm: 'maz:text-[0.625rem]',
  md: 'maz:text-[0.6875rem]',
  lg: 'maz:text-xs',
  xl: 'maz:text-sm',
} as const satisfies Record<MazSize, string>

/** The center of the indicator on the corner of a rectangle, or on the edge of a circle (at 45°, 14.6% from its box) */
const POSITION_CLASS = {
  rectangular: {
    'top-start': 'maz:top-0 maz:start-0 maz:-translate-x-1/2 maz:-translate-y-1/2 maz:rtl:translate-x-1/2',
    'top-end': 'maz:top-0 maz:end-0 maz:translate-x-1/2 maz:-translate-y-1/2 maz:rtl:-translate-x-1/2',
    'bottom-start': 'maz:bottom-0 maz:start-0 maz:-translate-x-1/2 maz:translate-y-1/2 maz:rtl:translate-x-1/2',
    'bottom-end': 'maz:bottom-0 maz:end-0 maz:translate-x-1/2 maz:translate-y-1/2 maz:rtl:-translate-x-1/2',
  },
  circular: {
    'top-start': 'maz:top-[14.6%] maz:start-[14.6%] maz:-translate-x-1/2 maz:-translate-y-1/2 maz:rtl:translate-x-1/2',
    'top-end': 'maz:top-[14.6%] maz:end-[14.6%] maz:translate-x-1/2 maz:-translate-y-1/2 maz:rtl:-translate-x-1/2',
    'bottom-start': 'maz:bottom-[14.6%] maz:start-[14.6%] maz:-translate-x-1/2 maz:translate-y-1/2 maz:rtl:translate-x-1/2',
    'bottom-end': 'maz:bottom-[14.6%] maz:end-[14.6%] maz:translate-x-1/2 maz:translate-y-1/2 maz:rtl:-translate-x-1/2',
  },
} as const

const indicatorClass = computed(() => [
  `--${resolvedColor.value}`,
  size ? SIZE_CLASS[size] : 'maz:text-[0.75em]',
  isDot.value
    ? '--dot maz:size-[0.8em]'
    : 'maz:h-[1.6em] maz:min-w-[1.6em] maz:px-[0.45em]',
  isPlaced.value
    ? ['maz:pointer-events-none maz:absolute maz:z-1', POSITION_CLASS[overlap][position]]
    : 'maz:relative maz:align-middle',
  { '--bordered': bordered ?? isPlaced.value },
])

const indicatorStyle = computed(() => ({
  backgroundColor: `var(--maz-${resolvedColor.value})`,
  color: `var(--maz-${resolvedColor.value}-foreground)`,
}))
</script>

<template>
  <span v-if="isWrapper" class="m-indicator m-reset-css maz:relative maz:inline-flex maz:flex-none maz:align-middle">
    <!-- @slot default - Content on a corner of which the indicator sits (an avatar, a button, an icon) -->
    <slot />
    <span
      v-if="isVisible"
      class="m-indicator__badge maz:isolate maz:inline-flex maz:flex-center maz:rounded-full maz:leading-none maz:font-semibold maz:whitespace-nowrap maz:tabular-nums"
      :class="indicatorClass"
      :style="indicatorStyle"
      :role="label ? 'img' : undefined"
      :aria-label="label"
      :aria-hidden="label ? undefined : 'true'"
    >
      <span v-if="pulse" class="maz:absolute maz:inset-0 maz:-z-1 maz:animate-ping maz:rounded-full maz:bg-inherit maz:opacity-60 maz:motion-reduce:animate-none" />
      <!-- @slot content - Replace the text of a counter -->
      <slot v-if="!isDot" name="content" :text="text">{{ text }}</slot>
    </span>
  </span>

  <span
    v-else-if="isVisible"
    class="m-indicator m-indicator__badge m-reset-css maz:isolate maz:inline-flex maz:flex-none maz:flex-center maz:rounded-full maz:leading-none maz:font-semibold maz:whitespace-nowrap maz:tabular-nums"
    :class="indicatorClass"
    :style="indicatorStyle"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
  >
    <span v-if="pulse" class="maz:absolute maz:inset-0 maz:-z-1 maz:animate-ping maz:rounded-full maz:bg-inherit maz:opacity-60 maz:motion-reduce:animate-none" />
    <slot v-if="!isDot" name="content" :text="text">{{ text }}</slot>
  </span>
</template>

<style scoped>
/* The ring takes the color of the background behind the indicator: override `--m-indicator-ring` on another surface. */
.m-indicator__badge.--bordered {
  box-shadow: 0 0 0 0.15em var(--m-indicator-ring, var(--maz-container-bg, var(--maz-surface)));
}
</style>
