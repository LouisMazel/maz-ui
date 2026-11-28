<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { useResizeObserver } from '../composables/useResizeObserver.ts'
import { getFocusableElements, trapTabKey } from '../utils/focusable.ts'
import { addOverlayLayer, isTopOverlayLayer, removeOverlayLayer } from '../utils/overlayLayers.ts'
import MazBtn from './MazBtn.vue'
import MazRollingText from './MazRollingText.vue'

export type MazTourTarget = string | HTMLElement | (() => HTMLElement | null | undefined)

export type MazTourPlacement = 'auto' | 'top' | 'bottom' | 'start' | 'end'

export interface MazTourStep {
  /**
   * The element to highlight: a CSS selector, an element or a function returning one.
   * Without target (or when it is not found or not visible), the card is centered on a dark page.
   */
  target?: MazTourTarget
  /**
   * Title of the step
   */
  title: string
  /**
   * Text of the step
   */
  description?: string
  /**
   * Side of the target where the card goes. `start` and `end` follow the reading direction.
   * The card flips to the opposite side when there is no room.
   * @values `'auto' | 'top' | 'bottom' | 'start' | 'end'`
   * @default 'auto'
   */
  placement?: MazTourPlacement
}

export interface MazTourProps {
  /**
   * The steps of the tour, in order
   */
  steps: MazTourStep[]
  /**
   * The tour is shown
   * @model open
   * @default false
   */
  open?: boolean
  /**
   * Index of the current step (0 is the first)
   * @model step
   * @default 0
   */
  step?: number
  /**
   * Space between the target and the edge of the hole, in pixels
   * @default 8
   */
  padding?: number
  /**
   * Corner radius of the hole, in pixels
   * @default 12
   */
  radius?: number
  /**
   * Escape skips the tour
   * @default true
   */
  closeOnEscape?: boolean
  /**
   * Scrolls the target into view when it is not fully visible
   * @default true
   */
  scrollIntoView?: boolean
  /**
   * Accessible name of the tour when a step has no title. The title of the step names the card otherwise.
   * @default 'Guided tour'
   */
  label?: string
}

const {
  steps,
  padding = 8,
  radius = 12,
  closeOnEscape = true,
  scrollIntoView = true,
  label,
} = defineProps<MazTourProps>()

const emits = defineEmits<{
  /**
   * Emitted when the current step changes
   * @property {number} index - Index of the new step
   */
  change: [index: number]
  /**
   * Emitted when the last step is done
   */
  finish: []
  /**
   * Emitted when the tour is skipped (button or Escape)
   */
  skip: []
}>()

defineSlots<{
  /**
   * Title of the step, replaces `step.title`
   * @binding {MazTourStep} step - The current step
   * @binding {number} index - Index of the step
   * @binding {number} total - Number of steps
   */
  title?: (props: { step: MazTourStep, index: number, total: number }) => any
  /**
   * Text of the step, replaces `step.description`
   * @binding {MazTourStep} step - The current step
   * @binding {number} index - Index of the step
   * @binding {number} total - Number of steps
   */
  description?: (props: { step: MazTourStep, index: number, total: number }) => any
}>()

const { t } = useTranslations()

interface Box {
  x: number
  y: number
  width: number
  height: number
}

const GAP = 12
const MARGIN = 12

const open = defineModel<boolean>('open', { default: false })
const stepIndex = defineModel<number>('step', { default: 0 })

const { shouldReduceMotion } = useReducedMotion()

const titleId = useId()
const descriptionId = useId()
const cardRef = useTemplateRef<HTMLElement>('card')
const nextButton = useTemplateRef<{ $el: HTMLElement }>('nextButton')

const isMounted = ref(false)
const isReady = ref(false)
const glide = ref(false)
const hole = ref<Box>()
const cardBox = ref({ width: 0, height: 0 })
const viewport = ref({ width: 0, height: 0 })
const isRtl = ref(false)
const targetElement = shallowRef<HTMLElement>()

const total = computed(() => steps.length)
const index = computed(() => Math.min(Math.max(stepIndex.value, 0), Math.max(total.value - 1, 0)))
const current = computed<MazTourStep | undefined>(() => steps[index.value])
const isFirst = computed(() => index.value === 0)
const isLast = computed(() => index.value === total.value - 1)
const isVisible = computed(() => isMounted.value && open.value && total.value > 0)

const stepLabel = computed(() => t('tour.stepOf', { step: index.value + 1, total: total.value }))
const cardLabel = computed(() => current.value?.title ?? label ?? t('tour.label'))

const layer = {
  contains: (target: Node) => !!cardRef.value?.contains(target),
}

function resolveTarget(target: MazTourTarget | undefined): HTMLElement | undefined {
  if (!target)
    return undefined

  const element = typeof target === 'string'
    ? document.querySelector<HTMLElement>(target)
    : typeof target === 'function'
      ? target()
      : target

  return element ?? undefined
}

function isInView(rect: DOMRect) {
  return rect.top >= MARGIN
    && rect.left >= MARGIN
    && rect.bottom <= document.documentElement.clientHeight - MARGIN
    && rect.right <= document.documentElement.clientWidth - MARGIN
}

function measure() {
  const element = targetElement.value
  const rect = element?.getBoundingClientRect()

  viewport.value = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }
  isRtl.value = getComputedStyle(document.documentElement).direction === 'rtl'

  hole.value = rect && (rect.width > 0 || rect.height > 0)
    ? {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      }
    : undefined

  const card = cardRef.value

  if (card)
    cardBox.value = { width: card.offsetWidth, height: card.offsetHeight }
}

/**
 * Finds the target of the step, scrolls it into view when asked, measures it and lets the hole glide to it
 */
async function update(options: { reveal: boolean, glide: boolean }) {
  const canGlide = options.glide && !shouldReduceMotion.value && isReady.value
  const hadHole = !!hole.value

  glide.value = canGlide

  if (options.reveal) {
    targetElement.value = resolveTarget(current.value?.target)

    if (scrollIntoView && targetElement.value && !isInView(targetElement.value.getBoundingClientRect()))
      targetElement.value.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' })
  }

  measure()
  isReady.value = true

  if (canGlide && !hadHole && hole.value) {
    const target = hole.value

    glide.value = false
    hole.value = { x: target.x + target.width / 2, y: target.y + target.height / 2, width: 0, height: 0 }

    await nextTick()
    document.body.getBoundingClientRect()
    glide.value = true
    hole.value = target
  }
}

let frame: number | undefined

function scheduleUpdate() {
  if (frame !== undefined)
    return

  frame = requestAnimationFrame(() => {
    frame = undefined

    if (isVisible.value)
      update({ reveal: false, glide: false })
  })
}

useResizeObserver(() => targetElement.value, scheduleUpdate)
useResizeObserver(cardRef, scheduleUpdate)

const cardPosition = computed(() => {
  const { width, height } = cardBox.value
  const view = viewport.value
  const box = hole.value

  if (!box) {
    return { x: (view.width - width) / 2, y: (view.height - height) / 2 }
  }

  const start = isRtl.value
    ? 'right'
    : 'left'
  const end = isRtl.value
    ? 'left'
    : 'right'
  const requested = current.value?.placement ?? 'auto'
  const physical = requested === 'start'
    ? start
    : requested === 'end'
      ? end
      : requested

  const space = {
    top: box.y,
    bottom: view.height - box.y - box.height,
    left: box.x,
    right: view.width - box.x - box.width,
  }
  const need = {
    top: height + GAP + MARGIN,
    bottom: height + GAP + MARGIN,
    left: width + GAP + MARGIN,
    right: width + GAP + MARGIN,
  }
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const
  type Side = keyof typeof space

  const fits = (side: Side) => space[side] >= need[side]
  let side: Side

  if (physical !== 'auto' && fits(physical as Side)) {
    side = physical as Side
  }
  else if (physical !== 'auto' && fits(opposite[physical as Side])) {
    side = opposite[physical as Side]
  }
  else {
    const order: Side[] = ['bottom', 'top', start, end]

    side = order.find(fits) ?? order.toSorted((a, b) => space[b] - space[a])[0]!
  }

  const centerX = box.x + box.width / 2 - width / 2
  const centerY = box.y + box.height / 2 - height / 2
  const raw = {
    top: { x: centerX, y: box.y - height - GAP },
    bottom: { x: centerX, y: box.y + box.height + GAP },
    left: { x: box.x - width - GAP, y: centerY },
    right: { x: box.x + box.width + GAP, y: centerY },
  }[side]

  return {
    x: Math.max(MARGIN, Math.min(raw.x, view.width - width - MARGIN)),
    y: Math.max(MARGIN, Math.min(raw.y, view.height - height - MARGIN)),
  }
})

const holeStyle = computed<CSSProperties>(() => {
  const box = hole.value ?? {
    x: viewport.value.width / 2,
    y: viewport.value.height / 2,
    width: 0,
    height: 0,
  }

  return {
    top: '0px',
    left: '0px',
    width: `${box.width}px`,
    height: `${box.height}px`,
    transform: `translate(${box.x}px, ${box.y}px)`,
    borderRadius: `${hole.value ? radius : 0}px`,
  }
})

const cardStyle = computed<CSSProperties>(() => ({
  top: '0px',
  left: '0px',
  transform: `translate(${cardPosition.value.x}px, ${cardPosition.value.y}px)`,
}))

function previous() {
  if (!isFirst.value)
    stepIndex.value = index.value - 1
}

function close() {
  open.value = false
}

function skip() {
  emits('skip')
  close()
}

function finish() {
  emits('finish')
  close()
}

function next() {
  if (isLast.value)
    finish()
  else
    stepIndex.value = index.value + 1
}

function goTo(newIndex: number) {
  stepIndex.value = Math.min(Math.max(newIndex, 0), Math.max(total.value - 1, 0))
}

function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || !isTopOverlayLayer(layer))
    return

  const forward = isRtl.value
    ? 'ArrowLeft'
    : 'ArrowRight'
  const backward = isRtl.value
    ? 'ArrowRight'
    : 'ArrowLeft'

  if (event.key === 'Escape' && closeOnEscape) {
    event.preventDefault()
    skip()
  }
  else if (event.key === forward) {
    event.preventDefault()
    next()
  }
  else if (event.key === backward) {
    event.preventDefault()
    previous()
  }
}

function onTrapKeydown(event: KeyboardEvent) {
  if (isTopOverlayLayer(layer))
    trapTabKey(event, cardRef.value)
}

let returnFocus: HTMLElement | null = null

function focusCard() {
  const button = nextButton.value?.$el

  if (button)
    button.focus({ preventScroll: true })
  else
    getFocusableElements(cardRef.value)[0]?.focus({ preventScroll: true })
}

function activate() {
  returnFocus = document.activeElement as HTMLElement | null
  addOverlayLayer(layer)
  globalThis.addEventListener('keydown', onKeydown)
  document.addEventListener('keydown', onTrapKeydown)
  globalThis.addEventListener('resize', scheduleUpdate)
  globalThis.addEventListener('scroll', scheduleUpdate, { capture: true, passive: true })

  update({ reveal: true, glide: false })
  focusCard()
}

function deactivate() {
  removeOverlayLayer(layer)
  globalThis.removeEventListener('keydown', onKeydown)
  document.removeEventListener('keydown', onTrapKeydown)
  globalThis.removeEventListener('resize', scheduleUpdate)
  globalThis.removeEventListener('scroll', scheduleUpdate, { capture: true })

  if (frame !== undefined) {
    cancelAnimationFrame(frame)
    frame = undefined
  }

  returnFocus?.focus({ preventScroll: true })
  returnFocus = null
}

function onAfterLeave() {
  isReady.value = false
  targetElement.value = undefined
  hole.value = undefined

  if (stepIndex.value !== 0)
    stepIndex.value = 0
}

watch(isVisible, (visible) => {
  if (visible)
    activate()
  else
    deactivate()
}, { flush: 'post' })

watch(index, async (newIndex, oldIndex) => {
  if (newIndex === oldIndex || !isVisible.value)
    return

  emits('change', newIndex)
  await update({ reveal: true, glide: true })

  await nextTick()
  if (!glide.value)
    measure()

  if (!cardRef.value?.contains(document.activeElement))
    focusCard()
}, { flush: 'post' })

onMounted(() => {
  isMounted.value = true
})

onBeforeUnmount(() => {
  if (isVisible.value)
    deactivate()
})

defineExpose({
  /** Goes to the next step, or finishes the tour on the last one */
  next,
  /** Goes to the previous step */
  previous,
  /** Goes to a step by its index */
  goTo,
  /** Skips the tour */
  skip,
  /** Finishes the tour */
  finish,
})
</script>

<template>
  <Teleport to="body">
    <Transition name="m-tour" appear @after-leave="onAfterLeave">
      <div
        v-if="isVisible"
        class="m-tour maz:fixed maz:inset-0 maz:z-default-backdrop maz:overflow-hidden"
        :class="{ '--glide': glide, '--ready': isReady }"
      >
        <div class="m-tour__veil maz:absolute maz:inset-0" aria-hidden="true" />
        <div class="m-tour__hole" :style="holeStyle" aria-hidden="true" />
        <div
          ref="card"
          role="dialog"
          aria-modal="true"
          :aria-label="current ? undefined : cardLabel"
          :aria-labelledby="current ? titleId : undefined"
          :aria-describedby="current?.description || $slots.description ? descriptionId : undefined"
          tabindex="-1"
          class="m-tour__card maz:absolute maz:w-80 maz:max-w-[calc(100%-1.5rem)] maz:rounded-xl maz:border maz:border-divider maz:bg-container maz:p-4 maz:text-foreground maz:shadow-elevation maz:outline-hidden"
          :style="cardStyle"
        >
          <template v-if="current">
            <p class="maz:mb-1 maz:flex maz:text-caption maz:text-muted maz:tabular-nums" aria-hidden="true">
              <span dir="ltr" class="maz:inline-flex maz:items-center maz:gap-1">
                <MazRollingText :value="index + 1" />
                <span>/</span>
                <span>{{ total }}</span>
              </span>
            </p>
            <span class="maz:sr-only" aria-live="polite">{{ stepLabel }}</span>

            <h2 :id="titleId" class="maz:text-title-4">
              <!--
                @slot title - Replaces the title of the step
                  @binding {MazTourStep} step - The current step
                  @binding {number} index - Index of the step
                  @binding {number} total - Number of steps
              -->
              <slot name="title" :step="current" :index="index" :total="total">
                {{ current.title }}
              </slot>
            </h2>

            <div v-if="current.description || $slots.description" :id="descriptionId" class="maz:mt-1 maz:text-body-sm maz:text-muted">
              <!--
                @slot description - Replaces the text of the step
                  @binding {MazTourStep} step - The current step
                  @binding {number} index - Index of the step
                  @binding {number} total - Number of steps
              -->
              <slot name="description" :step="current" :index="index" :total="total">
                {{ current.description }}
              </slot>
            </div>

            <div class="maz:mt-4 maz:flex maz:items-center maz:justify-between maz:gap-2">
              <MazBtn v-if="!isLast" size="sm" variant="ghost" color="contrast" @click="skip">
                {{ t('tour.skip') }}
              </MazBtn>
              <span v-else />

              <div class="maz:flex maz:items-center maz:gap-2">
                <MazBtn v-if="!isFirst" size="sm" variant="outline" color="contrast" @click="previous">
                  {{ t('tour.previous') }}
                </MazBtn>
                <MazBtn ref="nextButton" size="sm" color="primary" @click="next">
                  {{ isLast ? t('tour.done') : t('tour.next') }}
                </MazBtn>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-tour {
  --m-tour-duration: calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1));

  &.m-tour-enter-active {
    transition: opacity calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1))
      var(--maz-easing-out, ease-out);
  }

  &.m-tour-leave-active {
    transition: opacity calc(var(--maz-motion-fast, 100ms) * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in);
  }

  &.m-tour-enter-from,
  &.m-tour-leave-to {
    opacity: 0;
  }
}

.m-tour__hole {
  position: absolute;
  pointer-events: none;
  box-shadow:
    0 0 0 2px color-mix(in oklab, var(--maz-primary) 70%, transparent),
    0 0 0 100vmax color-mix(in oklab, var(--maz-overlay) 60%, transparent);
}

.m-tour__card {
  opacity: 0;
}

.m-tour.--ready .m-tour__card {
  opacity: 1;
}

.m-tour.--glide .m-tour__hole {
  transition-property: transform, inline-size, block-size, border-radius;
  transition-duration: var(--m-tour-duration);
  transition-timing-function: var(--maz-easing-in-out, ease-in-out);
}

.m-tour.--glide .m-tour__card {
  transition-property: transform;
  transition-duration: var(--m-tour-duration);
  transition-timing-function: var(--maz-easing-in-out, ease-in-out);
}
</style>
