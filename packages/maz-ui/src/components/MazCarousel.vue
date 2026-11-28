<script lang="ts" setup>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import { MazChevronLeft } from '@maz-ui/icons/raw/MazChevronLeft'
import { MazChevronRight } from '@maz-ui/icons/raw/MazChevronRight'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { useResizeObserver } from '../composables/useResizeObserver.ts'
import MazIcon from './MazIcon.vue'

const {
  hideScrollButtons = false,
  hideScrollbar = false,
  translations,
  title,
  counter = false,
  progress = false,
  dragScroll = false,
} = defineProps<MazCarouselProps>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MazRollingText = defineAsyncComponent(() => import('./MazRollingText.vue'))

export interface MazCarouselProps {
  /**
   * Hide display the scroll buttons
   * @default false
   */
  hideScrollButtons?: boolean
  /**
   * Translations of the carousel
   * @type {DeepPartial<MazUiTranslationsNestedSchema['carousel']>}
   * @default Translations from @maz-ui/translations
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['carousel']>
  /**
   * Hide the scrollbar when not active
   * @default false
   */
  hideScrollbar?: boolean

  /**
   * The title of the carousel
   */
  title?: string
  /**
   * Show the current page and the page count in the header (`2 / 5`), the current page rolls
   * @default false
   */
  counter?: boolean
  /**
   * Show a thin progress bar under the items: the part of the items already seen
   * @default false
   */
  progress?: boolean
  /**
   * Scroll the items by dragging them with the mouse, with a little inertia on release (touch screens already scroll)
   * @default false
   */
  dragScroll?: boolean
}

const slots = useSlots()

const isScrolled = ref(false)
const isScrolledMax = ref(false)
const MazCarouselItems = ref<HTMLDivElement>()

const { t } = useTranslations()
const messages = computed<MazUiTranslationsNestedSchema['carousel']>(() => ({
  ariaLabel: {
    previousButton: translations?.ariaLabel?.previousButton ?? t('carousel.ariaLabel.previousButton'),
    nextButton: translations?.ariaLabel?.nextButton ?? t('carousel.ariaLabel.nextButton'),
  },
}))

const { shouldReduceMotion } = useReducedMotion()

const scrollRatio = ref(0)
const pageCount = ref(1)
const currentPage = ref(1)
const isDragging = ref(false)

function hasHeader() {
  return !hideScrollButtons || slots.title || title || counter
}

function hasTitle() {
  return !!slots.title || !!title
}

function getDirection(items: Element) {
  return getComputedStyle(items).direction === 'rtl'
    ? -1
    : 1
}

function next() {
  const items = MazCarouselItems.value
  items?.scrollTo(items.scrollLeft + items.clientWidth * getDirection(items), 0)
}

function previous() {
  const items = MazCarouselItems.value
  items?.scrollTo(items.scrollLeft - items.clientWidth * getDirection(items), 0)
}

function updateMetrics(target: Element) {
  const position = Math.abs(target.scrollLeft)

  scrollRatio.value = target.scrollWidth > 0
    ? Math.min(1, Math.max(0, (position + target.clientWidth) / target.scrollWidth))
    : 0
  pageCount.value = target.clientWidth > 0
    ? Math.max(1, Math.ceil(target.scrollWidth / target.clientWidth))
    : 1
  currentPage.value = target.clientWidth > 0
    ? Math.min(pageCount.value, Math.round(position / target.clientWidth) + 1)
    : 1
}

function setScrollState(event: Event) {
  const target = event.target as Element | undefined

  if (!target)
    return

  const position = target.scrollLeft * getDirection(target)

  isScrolled.value = position >= 20

  const itemsScrollWidth = target.scrollWidth - target.clientWidth
  isScrolledMax.value = position >= itemsScrollWidth - 20

  updateMetrics(target)
}

useResizeObserver(MazCarouselItems, () => {
  if (MazCarouselItems.value)
    updateMetrics(MazCarouselItems.value)
})

const DRAG_THRESHOLD = 4
const INERTIA_TIME_CONSTANT = 325

let dragStartX = 0
let dragStartScroll = 0
let lastX = 0
let lastTime = 0
let velocity = 0
let hasMoved = false
let inertiaFrame: number | undefined

function stopInertia() {
  if (inertiaFrame !== undefined) {
    cancelAnimationFrame(inertiaFrame)
    inertiaFrame = undefined
  }
}

function onDragStart(event: PointerEvent) {
  const items = MazCarouselItems.value

  if (!dragScroll || !items || event.pointerType !== 'mouse' || event.button !== 0)
    return

  stopInertia()
  dragStartX = event.clientX
  dragStartScroll = items.scrollLeft
  lastX = event.clientX
  lastTime = event.timeStamp
  velocity = 0
  hasMoved = false
  isDragging.value = true
}

function onDragMove(event: PointerEvent) {
  const items = MazCarouselItems.value

  if (!isDragging.value || !items)
    return

  const distance = event.clientX - dragStartX

  if (!hasMoved && Math.abs(distance) < DRAG_THRESHOLD)
    return

  if (!hasMoved) {
    hasMoved = true
    items.setPointerCapture?.(event.pointerId)
  }

  const elapsed = event.timeStamp - lastTime

  if (elapsed > 0)
    velocity = (event.clientX - lastX) / elapsed

  lastX = event.clientX
  lastTime = event.timeStamp
  items.scrollLeft = dragStartScroll - distance
}

function runInertia(items: HTMLElement) {
  let previousTime: number | undefined

  const step = (time: number) => {
    const elapsed = previousTime === undefined
      ? 16
      : time - previousTime

    previousTime = time
    velocity *= Math.exp(-elapsed / INERTIA_TIME_CONSTANT)
    const before = items.scrollLeft

    items.scrollLeft -= velocity * elapsed

    if (Math.abs(velocity) < 0.02 || items.scrollLeft === before) {
      inertiaFrame = undefined
      isDragging.value = false
      return
    }

    inertiaFrame = requestAnimationFrame(step)
  }

  inertiaFrame = requestAnimationFrame(step)
}

function onDragEnd() {
  const items = MazCarouselItems.value

  if (!isDragging.value || !items)
    return

  if (hasMoved && !shouldReduceMotion.value && Math.abs(velocity) > 0.05) {
    runInertia(items)
    return
  }

  isDragging.value = false
}

function onClickCapture(event: MouseEvent) {
  if (hasMoved) {
    event.stopPropagation()
    event.preventDefault()
    hasMoved = false
  }
}

function onNativeDragStart(event: Event) {
  if (dragScroll)
    event.preventDefault()
}

const POINTER_LISTENERS = [
  ['pointerdown', onDragStart],
  ['pointermove', onDragMove],
  ['pointerup', onDragEnd],
  ['pointercancel', onDragEnd],
  ['dragstart', onNativeDragStart],
] as const

onMounted(() => {
  for (const [name, listener] of POINTER_LISTENERS)
    MazCarouselItems.value?.addEventListener(name, listener as EventListener)

  MazCarouselItems.value?.addEventListener('click', onClickCapture, true)
})

onBeforeUnmount(() => {
  stopInertia()

  for (const [name, listener] of POINTER_LISTENERS)
    MazCarouselItems.value?.removeEventListener(name, listener as EventListener)

  MazCarouselItems.value?.removeEventListener('click', onClickCapture, true)
})
</script>

<template>
  <div
    class="m-carousel m-reset-css maz:relative maz:flex maz:flex-col"
    :class="{
      '--hide-scrollbar': hideScrollbar,
      '--drag-scroll': dragScroll,
      '--dragging': isDragging,
    }"
  >
    <div v-if="hasHeader()" class="m-carousel__header maz:flex maz:items-center" :class="[hasTitle() ? '--has-title' : '', hasTitle() ? 'maz:justify-between' : 'maz:justify-end']">
      <div v-if="hasTitle()">
        <slot name="title">
          <h4 class="maz:text-title-3">
            {{ title }}
          </h4>
        </slot>
      </div>
      <div v-if="!hideScrollButtons || counter" class="m-carousel__header__actions maz:flex maz:flex-1 maz:items-center maz:justify-end maz:space-x-2">
        <span v-if="counter && pageCount > 1" class="m-carousel__counter maz:inline-flex maz:items-center maz:gap-1 maz:text-sm maz:text-muted maz:tabular-nums" aria-hidden="true">
          <MazRollingText :value="currentPage" />
          <span>/</span>
          <span>{{ pageCount }}</span>
        </span>
        <MazBtn
          v-if="!hideScrollButtons"
          color="transparent"
          class="m-carousel__btn"
          :class="{ '--muted': !isScrolled }"
          fab
          :aria-label="messages.ariaLabel.previousButton"
          @click="previous"
        >
          <slot name="previous-icon">
            <MazIcon :icon="MazChevronLeft" class="maz:text-lg" />
          </slot>
        </MazBtn>
        <MazBtn
          v-if="!hideScrollButtons"
          color="transparent"
          class="m-carousel__btn"
          :class="{ '--muted': isScrolledMax }"
          fab
          :aria-label="messages.ariaLabel.nextButton"
          @click="next"
        >
          <slot name="next-icon">
            <MazIcon :icon="MazChevronRight" class="maz:text-lg" />
          </slot>
        </MazBtn>
      </div>
    </div>
    <div ref="MazCarouselItems" class="m-carousel__items maz:z-1 maz:flex maz:flex-1 maz:items-center maz:justify-start maz:space-x-5 maz:overflow-y-hidden maz:py-4 maz:ps-3" :class="hideScrollbar ? 'maz:overflow-x-hidden' : 'maz:overflow-x-auto'" @scroll="setScrollState">
      <!-- Insert your items -->
      <slot />
      <div class="m-carousel__items__spacer" />
    </div>
    <div v-if="progress" class="m-carousel__progress maz:h-0.5 maz:w-full maz:overflow-hidden maz:rounded-full maz:bg-foreground/10" aria-hidden="true">
      <div class="m-carousel__progress-bar maz:size-full maz:rounded-full maz:bg-primary" :style="{ transform: `scaleX(${scrollRatio})` }" />
    </div>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-carousel {
  &.--hide-scrollbar:hover .m-carousel__items,
  &.--hide-scrollbar:focus-within .m-carousel__items,
  &.--hide-scrollbar:active .m-carousel__items,
  &.--hide-scrollbar:focus .m-carousel__items {
    @apply maz:overflow-x-auto;
  }
}

.m-carousel.--drag-scroll .m-carousel__items {
  cursor: grab;
}

.m-carousel.--dragging .m-carousel__items {
  scroll-behavior: auto;
  user-select: none;
}

.m-carousel.--dragging.--drag-scroll .m-carousel__items {
  cursor: grabbing;
}

.m-carousel__progress-bar {
  transform-origin: left;
  transition: transform calc(var(--maz-motion-fast) * var(--maz-motion-scale)) var(--maz-easing-out);
}

[dir='rtl'] .m-carousel__progress-bar {
  transform-origin: right;
}

.m-carousel__btn.--muted {
  @apply maz:text-muted maz:fill-current;
}

.m-carousel__items {
  @apply maz:scroll-smooth maz:scrollbar-thin maz:scrollbar-thumb-surface-600 maz:scrollbar-track-transparent;

  &::-webkit-scrollbar {
    inline-size: 0.1875rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    @apply maz:bg-surface-600 maz:dark:bg-surface-400;

    border-radius: 1000px;
  }
}

.m-carousel__items__spacer {
  flex: 0 0 1px;
  inline-size: 1px;
  block-size: 1px;
}
</style>
