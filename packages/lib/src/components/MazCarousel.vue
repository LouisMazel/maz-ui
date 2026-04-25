<script lang="ts" setup>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import { MazChevronLeft } from '@maz-ui/icons/static/MazChevronLeft'
import { MazChevronRight } from '@maz-ui/icons/static/MazChevronRight'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, ref, useSlots } from 'vue'

const {
  hideScrollButtons = false,
  hideScrollbar = false,
  translations,
  title,
} = defineProps<MazCarouselProps>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

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

function hasHeader() {
  return !hideScrollButtons || slots.title || title
}

function hasTitle() {
  return !!slots.title || !!title
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
    class="m-carousel m-reset-css maz:relative maz:flex maz:flex-col"
    :class="{
      '--hide-scrollbar': hideScrollbar,
    }"
  >
    <div v-if="hasHeader()" class="m-carousel__header maz:flex maz:items-center" :class="hasTitle() ? 'maz:justify-between' : 'maz:justify-end'">
      <div v-if="hasTitle()">
        <slot name="title">
          <h4 class="maz:text-xl maz:font-semibold">
            {{ title }}
          </h4>
        </slot>
      </div>
      <div v-if="!hideScrollButtons" class="m-carousel__header__actions maz:flex maz:flex-1 maz:justify-end maz:space-x-2">
        <MazBtn
          color="transparent"
          class="m-carousel__btn"
          :class="{ '--muted': !isScrolled }"
          fab
          :aria-label="messages.ariaLabel.previousButton"
          @click="previous"
        >
          <slot name="previous-icon">
            <MazChevronLeft class="maz:text-lg" />
          </slot>
        </MazBtn>
        <MazBtn
          color="transparent"
          class="m-carousel__btn"
          :class="{ '--muted': isScrolledMax }"
          fab
          :aria-label="messages.ariaLabel.nextButton"
          @click="next"
        >
          <slot name="next-icon">
            <MazChevronRight class="maz:text-lg" />
          </slot>
        </MazBtn>
      </div>
    </div>
    <div ref="MazCarouselItems" class="m-carousel__items maz:z-1 maz:flex maz:flex-1 maz:items-center maz:justify-start maz:space-x-5 maz:overflow-y-hidden maz:py-4 maz:ps-3" :class="hideScrollbar ? 'maz:overflow-x-hidden' : 'maz:overflow-x-auto'" @scroll="setScrollState">
      <!-- Insert your items -->
      <slot />
      <div class="m-carousel__items__spacer" />
    </div>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-carousel {
  &__items {
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: var(--maz-background-600) transparent;

    &::-webkit-scrollbar {
      width: 0.1875rem;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      @apply maz:bg-surface-600 maz:dark:bg-surface-400;

      border-radius: 1000px;
    }

    &__spacer {
      flex: 0 0 1px;
      width: 1px;
      height: 1px;
    }
  }

  &__btn.--muted {
    @apply maz:text-muted maz:fill-current;
  }

  &.--hide-scrollbar:hover .m-carousel__items,
  &.--hide-scrollbar:focus-within .m-carousel__items,
  &.--hide-scrollbar:active .m-carousel__items,
  &.--hide-scrollbar:focus .m-carousel__items {
    @apply maz:overflow-x-auto;
  }
}
</style>
