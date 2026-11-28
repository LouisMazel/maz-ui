<script lang="ts" setup>
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { observeIntersection } from '../utils/reveal.ts'

export interface MazBeforeAfterProps {
  /** Source of the "before" image. Use the `before` slot for anything else */
  before?: string
  /** Source of the "after" image. Use the `after` slot for anything else */
  after?: string
  /**
   * Alternative text of the "before" image. Leave it empty when the images are decorative
   * @default ''
   */
  beforeAlt?: string
  /**
   * Alternative text of the "after" image. Leave it empty when the images are decorative
   * @default ''
   */
  afterAlt?: string
  /**
   * Direction of the comparison: `horizontal` moves a vertical handle left and right, `vertical` moves a horizontal handle up and down
   * @values `'horizontal' | 'vertical'`
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Text of the "before" label. Defaults to the translation of "Before". `false` hides both labels
   */
  beforeLabel?: string | false
  /**
   * Text of the "after" label. Defaults to the translation of "After". `false` hides both labels
   */
  afterLabel?: string | false
  /**
   * Accessible name of the handle. Defaults to the translation of "Resize"
   */
  label?: string
  /**
   * Share of the position moved by one arrow key press, in percent (`PageUp` and `PageDown` move ten times more)
   * @default 2
   */
  step?: number
  /**
   * Aspect ratio of the component (`16 / 9`, `4 / 3`...). Without it, the size of the images decides. Needed when the images are in slots
   */
  aspectRatio?: string
  /**
   * Swing the handle once when the component first becomes visible, to show that it moves. Off when the user reduces motion
   * @default true
   */
  hint?: boolean
}

const {
  before = undefined,
  after = undefined,
  beforeAlt = '',
  afterAlt = '',
  orientation = 'horizontal',
  beforeLabel = undefined,
  afterLabel = undefined,
  label = undefined,
  step = 2,
  aspectRatio = undefined,
  hint = true,
} = defineProps<MazBeforeAfterProps>()

/**
 * Position of the handle in percent of the component, from its start (0 shows only the "after", 100 only the "before")
 * @default 50
 */
const model = defineModel<number>({ default: 50 })

const { t } = useTranslations()

const { shouldReduceMotion } = useReducedMotion()

const root = useTemplateRef<HTMLElement>('root')
const handle = useTemplateRef<HTMLElement>('handle')

const shown = ref(model.value)
const isDragging = ref(false)
let isRtl = false
let hintFrame: number | undefined
let stopObserving: (() => void) | undefined

const isVertical = computed(() => orientation === 'vertical')
const beforeText = computed(() => beforeLabel === false ? '' : (beforeLabel ?? t('aria.before')))
const afterText = computed(() => afterLabel === false ? '' : (afterLabel ?? t('aria.after')))
const showLabels = computed(() => beforeLabel !== false && afterLabel !== false)
const rounded = computed(() => Math.round(model.value))
const valueText = computed(() => `${beforeText.value || t('aria.before')} ${rounded.value}%, ${afterText.value || t('aria.after')} ${100 - rounded.value}%`)

watch(model, (value) => {
  shown.value = value
})

function clamp(value: number) {
  return Math.min(100, Math.max(0, value))
}

function setPosition(value: number) {
  const next = Math.round(clamp(value) * 10) / 10
  shown.value = next
  model.value = next
}

function cancelHint() {
  if (hintFrame !== undefined) {
    cancelAnimationFrame(hintFrame)
    hintFrame = undefined
    shown.value = model.value
  }
}

function playHint() {
  const duration = 1100
  const amplitude = 9
  const base = model.value
  const start = performance.now()

  function frame(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    shown.value = base + Math.sin(progress * Math.PI * 3) * amplitude * (1 - progress)

    if (progress < 1) {
      hintFrame = requestAnimationFrame(frame)
      return
    }

    hintFrame = undefined
    shown.value = model.value
  }

  hintFrame = requestAnimationFrame(frame)
}

function updateFromPointer(event: PointerEvent) {
  const rect = root.value?.getBoundingClientRect()
  if (!rect || !rect.width || !rect.height)
    return

  let ratio = isVertical.value
    ? (event.clientY - rect.top) / rect.height
    : (event.clientX - rect.left) / rect.width

  if (!isVertical.value && isRtl)
    ratio = 1 - ratio

  setPosition(ratio * 100)
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0 || !root.value)
    return

  cancelHint()
  isRtl = getComputedStyle(root.value).direction === 'rtl'
  isDragging.value = true
  root.value.setPointerCapture?.(event.pointerId)
  updateFromPointer(event)
  handle.value?.focus({ preventScroll: true })
}

function onPointerMove(event: PointerEvent) {
  if (isDragging.value)
    updateFromPointer(event)
}

function onPointerUp(event: PointerEvent) {
  if (!isDragging.value)
    return

  isDragging.value = false
  root.value?.releasePointerCapture?.(event.pointerId)
}

function onKeydown(event: KeyboardEvent) {
  const direction = isVertical.value || !(root.value && getComputedStyle(root.value).direction === 'rtl') ? 1 : -1
  const forward = isVertical.value ? 'ArrowDown' : 'ArrowRight'
  const backward = isVertical.value ? 'ArrowUp' : 'ArrowLeft'
  const big = step * 10
  let next: number | undefined

  switch (event.key) {
    case forward: {
      next = model.value + step * direction
      break
    }
    case backward: {
      next = model.value - step * direction
      break
    }
    case 'PageUp': {
      next = model.value + big
      break
    }
    case 'PageDown': {
      next = model.value - big
      break
    }
    case 'Home': {
      next = 0
      break
    }
    case 'End': {
      next = 100
      break
    }
  }

  if (next === undefined)
    return

  event.preventDefault()
  cancelHint()
  setPosition(next)
}

onMounted(() => {
  if (!hint || shouldReduceMotion.value || !root.value)
    return

  stopObserving = observeIntersection(root.value, (entry) => {
    if (!entry.isIntersecting)
      return

    stopObserving?.()
    stopObserving = undefined

    if (!isDragging.value && !shouldReduceMotion.value)
      playHint()
  }, { threshold: 0.6 })
})

onBeforeUnmount(() => {
  stopObserving?.()
  if (hintFrame !== undefined)
    cancelAnimationFrame(hintFrame)
})
</script>

<template>
  <div
    ref="root"
    class="m-before-after m-reset-css maz:relative maz:grid maz:overflow-hidden maz:rounded-lg maz:bg-surface-600"
    :class="[isVertical ? 'm-before-after--vertical' : 'm-before-after--horizontal', { 'm-before-after--dragging': isDragging }]"
    :style="{ '--m-before-after-position': `${shown}%`, 'aspectRatio': aspectRatio }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="m-before-after__layer m-before-after__layer--before">
      <!--
        @slot before - The "before" content, instead of the `before` image
      -->
      <slot name="before">
        <img
          v-if="before"
          class="m-before-after__image"
          :src="before"
          :alt="beforeAlt"
          draggable="false"
        >
      </slot>
      <span v-if="showLabels && beforeText" class="m-before-after__label m-before-after__label--before">{{ beforeText }}</span>
    </div>

    <div class="m-before-after__layer m-before-after__layer--after">
      <!--
        @slot after - The "after" content, instead of the `after` image
      -->
      <slot name="after">
        <img
          v-if="after"
          class="m-before-after__image"
          :src="after"
          :alt="afterAlt"
          draggable="false"
        >
      </slot>
      <span v-if="showLabels && afterText" class="m-before-after__label m-before-after__label--after">{{ afterText }}</span>
    </div>

    <div
      ref="handle"
      class="m-before-after__handle"
      role="slider"
      tabindex="0"
      :aria-label="label ?? t('aria.resize')"
      :aria-orientation="orientation"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="rounded"
      :aria-valuetext="valueText"
      @keydown="onKeydown"
    >
      <span class="m-before-after__line" />
      <span class="m-before-after__grip" aria-hidden="true">
        <svg
          class="m-before-after__arrows"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
        </svg>
      </span>
    </div>
  </div>
</template>

<style scoped>
.m-before-after {
  --m-before-after-direction: 1;

  touch-action: pan-y;
  cursor: ew-resize;
  user-select: none;
}

.m-before-after:dir(rtl) {
  --m-before-after-direction: -1;
}

.m-before-after--vertical {
  touch-action: pan-x;
  cursor: ns-resize;
}

.m-before-after__layer {
  position: relative;
  grid-area: 1 / 1;
  min-inline-size: 0;
  min-block-size: 0;
}

.m-before-after__image {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
  pointer-events: none;
}

.m-before-after--horizontal .m-before-after__layer--after {
  clip-path: inset(0 0 0 var(--m-before-after-position));
}

.m-before-after--horizontal:dir(rtl) .m-before-after__layer--after {
  clip-path: inset(0 var(--m-before-after-position) 0 0);
}

.m-before-after--vertical .m-before-after__layer--after {
  clip-path: inset(var(--m-before-after-position) 0 0 0);
}

.m-before-after__label {
  position: absolute;
  padding-block: 0.25rem;
  padding-inline: 0.625rem;
  border-radius: 9999px;
  background-color: color-mix(in oklab, var(--maz-surface, white) 82%, transparent);
  color: var(--maz-foreground, black);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25;
  pointer-events: none;
  box-shadow: 0 1px 3px rgb(0 0 0 / 20%);
}

.m-before-after--horizontal .m-before-after__label {
  inset-block-start: 0.75rem;
}

.m-before-after--horizontal .m-before-after__label--before {
  inset-inline-start: 0.75rem;
}

.m-before-after--horizontal .m-before-after__label--after {
  inset-inline-end: 0.75rem;
}

.m-before-after--vertical .m-before-after__label {
  inset-inline-start: 0.75rem;
}

.m-before-after--vertical .m-before-after__label--before {
  inset-block-start: 0.75rem;
}

.m-before-after--vertical .m-before-after__label--after {
  inset-block-end: 0.75rem;
}

.m-before-after__handle {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: var(--maz-foreground, black);
  outline: none;
  cursor: inherit;
}

.m-before-after--horizontal .m-before-after__handle {
  inset-block: 0;
  inset-inline-start: var(--m-before-after-position);
  inline-size: 2.75rem;
  translate: calc(-50% * var(--m-before-after-direction)) 0;
}

.m-before-after--vertical .m-before-after__handle {
  inset-inline: 0;
  inset-block-start: var(--m-before-after-position);
  block-size: 2.75rem;
  translate: 0 -50%;
}

.m-before-after__line {
  position: absolute;
  background-color: var(--maz-surface, white);
  box-shadow: 0 0 6px rgb(0 0 0 / 35%);
}

.m-before-after--horizontal .m-before-after__line {
  inset-block: 0;
  inline-size: 2px;
}

.m-before-after--vertical .m-before-after__line {
  inset-inline: 0;
  block-size: 2px;
}

.m-before-after__grip {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  border-radius: 9999px;
  background-color: var(--maz-surface, white);
  box-shadow: 0 2px 8px rgb(0 0 0 / 30%);
  transition: scale calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-before-after--vertical .m-before-after__arrows {
  rotate: 90deg;
}

.m-before-after__arrows {
  inline-size: 1.25rem;
  block-size: 1.25rem;
}

.m-before-after__handle:focus-visible .m-before-after__grip {
  outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
  outline-offset: 2px;
}

.m-before-after--dragging .m-before-after__grip {
  scale: 1.1;
}

@media (prefers-reduced-motion: reduce) {
  .m-before-after__grip {
    transition: none;
  }
}
</style>
