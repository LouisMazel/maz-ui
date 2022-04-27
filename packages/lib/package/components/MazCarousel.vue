<template>
  <div class="m-carousel">
    <div
      v-if="hasHeader()"
      class="m-carousel__header"
      :class="{ '--has-title': hasTitle() }"
    >
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
          @click="previous"
        >
          <slot name="previous-icon">
            <MazIcon :src="ChevronLeftIcon" />
          </slot>
        </MazBtn>
        <MazBtn
          color="transparent"
          class="m-carousel__btn"
          :class="{ '--muted': isScrolledMax }"
          fab
          no-elevation
          @click="next"
        >
          <slot name="next-icon">
            <MazIcon :src="ChevronRightIcon" />
          </slot>
        </MazBtn>
      </div>
    </div>
    <div
      ref="MazCarouselItems"
      class="m-carousel__items"
      @scroll="setScrollState"
    >
      <!-- Insert your items -->
      <slot />
      <div class="m-carousel__items__spacer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, useSlots } from 'vue'
  import MazBtn from './MazBtn.vue'
  import MazIcon from './MazIcon.vue'
  import ChevronLeftIcon from '@package/icons/chevron-left.svg'
  import ChevronRightIcon from '@package/icons/chevron-right.svg'

  const props = defineProps({
    noScrollBtn: { type: Boolean, default: false },
  })

  const slots = useSlots()

  const isScrolled = ref(false)
  const isScrolledMax = ref(false)
  const MazCarouselItems = ref<HTMLDivElement>()

  const hasHeader = () => {
    return !props.noScrollBtn || slots['title']
  }

  const hasTitle = () => {
    return !!slots['title']
  }

  const next = () => {
    const items = MazCarouselItems.value
    items?.scrollTo(items.scrollLeft + items.clientWidth, 0)
  }

  const previous = () => {
    const items = MazCarouselItems.value
    items?.scrollTo(items.scrollLeft - items.clientWidth, 0)
  }

  const setScrollState = (event: UIEvent) => {
    const target = event.target as Element | undefined

    if (!target) return

    if (target.scrollLeft >= 20) {
      isScrolled.value = true
    } else isScrolled.value = false

    const itemsScrollWidth = target.scrollWidth - target.clientWidth
    if (target.scrollLeft >= itemsScrollWidth - 20) {
      isScrolledMax.value = true
    } else isScrolledMax.value = false
  }
</script>

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
        maz-space-x-5 maz-overflow-x-auto maz-overflow-y-hidden maz-py-4 maz-pl-3;

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
  }
</style>
