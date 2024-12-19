<script lang="ts" setup>
import { defineAsyncComponent, ref, useSlots } from 'vue'

const props = withDefaults(defineProps<MazCarouselProps>(), {
  ariaLabelPreviousButton: 'Scroll to previous items',
  ariaLabelNextButton: 'Scroll to next items',
})

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const ChevronLeftIcon = defineAsyncComponent(() => import('../../icons/chevron-left.svg'))
const ChevronRightIcon = defineAsyncComponent(() => import('../../icons/chevron-right.svg'))

export interface MazCarouselProps {
  /** Do not display the scroll buttons */
  noScrollBtn?: boolean
  /** Aria label for the previous button */
  ariaLabelPreviousButton?: string
  /** Aria label for the next button */
  ariaLabelNextButton?: string
  /** Hide the scrollbar when not active */
  hideScrollbar?: boolean
}

const slots = useSlots()

const isScrolled = ref(false)
const isScrolledMax = ref(false)
const MazCarouselItems = ref<HTMLDivElement>()

function hasHeader() {
  return !props.noScrollBtn || slots.title
}

function hasTitle() {
  return !!slots.title
}

function next() {
  const items = MazCarouselItems.value
  items?.scrollTo(items.scrollLeft + items.clientWidth, 0)
}

function previous() {
  const items = MazCarouselItems.value
  items?.scrollTo(items.scrollLeft - items.clientWidth, 0)
}

function setScrollState(event: Event) {
  const target = event.target as Element | undefined

  if (!target)
    return

  isScrolled.value = target.scrollLeft >= 20

  const itemsScrollWidth = target.scrollWidth - target.clientWidth
  isScrolledMax.value = target.scrollLeft >= itemsScrollWidth - 20
}
</script>

<template>
  <div
    class="m-carousel m-reset-css"
    :class="{
      '--hide-scrollbar': hideScrollbar,
    }"
  >
    <div v-if="hasHeader()" class="m-carousel__header" :class="{ '--has-title': hasTitle() }">
      <div v-if="hasTitle()">
        <slot name="title" />
      </div>
      <div v-if="!noScrollBtn" class="m-carousel__header__actions">
        <MazBtn
          color="transparent"
          class="m-carousel__btn"
          :class="{ '--muted': !isScrolled }"
          no-elevation
          fab
          :aria-label="ariaLabelPreviousButton"
          @click="previous"
        >
          <slot name="previous-icon">
            <ChevronLeftIcon class="maz-text-lg" />
          </slot>
        </MazBtn>
        <MazBtn
          color="transparent"
          class="m-carousel__btn"
          :class="{ '--muted': isScrolledMax }"
          fab
          no-elevation
          :aria-label="ariaLabelNextButton"
          @click="next"
        >
          <slot name="next-icon">
            <ChevronRightIcon class="maz-text-lg" />
          </slot>
        </MazBtn>
      </div>
    </div>
    <div ref="MazCarouselItems" class="m-carousel__items" @scroll="setScrollState">
      <!-- Insert your items -->
      <slot />
      <div class="m-carousel__items__spacer" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .m-carousel {
  @apply maz-relative maz-flex maz-flex-col;

  &__header {
    @apply maz-flex maz-items-center maz-justify-end;

    &.--has-title {
      @apply maz-justify-between;
    }

    &__actions {
      @apply maz-flex maz-flex-1 maz-justify-end maz-space-x-2;
    }
  }

  &__items {
    @apply maz-z-1 maz-flex maz-flex-1 maz-items-center maz-justify-start
        maz-space-x-5 maz-overflow-y-hidden maz-py-4 maz-pl-3;

    scroll-behavior: smooth;

    &__spacer {
      flex: 0 0 1px;
      width: 1px;
      height: 1px;
    }
  }

  &__btn.--muted {
    @apply maz-text-muted;
    @apply maz-fill-current;
  }

  :not(.--hide-scrollbar) .m-carousel__items {
    @apply maz-overflow-x-auto;
  }

  &.--hide-scrollbar .m-carousel__items {
    @apply maz-overflow-x-hidden;
  }

  &.--hide-scrollbar:hover .m-carousel__items,
  &.--hide-scrollbar:focus-within .m-carousel__items,
  &.--hide-scrollbar:active .m-carousel__items,
  &.--hide-scrollbar:focus .m-carousel__items {
    @apply maz-overflow-x-auto;
  }
}
</style>
