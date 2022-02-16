<template>
  <div class="m-carousel maz-flex maz-flex-col">
    <div
      v-if="hasHeader()"
      class="m-carousel__header maz-flex maz-items-center"
    >
      <!-- Title of the carousel -->
      <slot name="title" />
      <div
        v-if="scrollBtn"
        class="m-carousel__header__actions maz-flex maz-flex-1 maz-justify-end maz-space-x-2"
      >
        <MazBtn
          color="transparent"
          class="m-carousel__btn"
          :class="{ 'm-carousel__btn--muted': !isScrolled }"
          fab
          @click="previous"
        >
          <!-- Replace the default `<svg />` icon -->
          <slot name="previous-icon">
            <!-- `<svg />` -->
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              accent="#03A89D"
              class="display:inline-block"
            >
              <g
                id="ChevronLeft"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <polygon
                  id="Fill"
                  fill="currentColor"
                  points="6.25 10 12.5 3.75 13.375 4.625 8 10 13.375 15.375 12.5 16.25"
                />
              </g>
            </svg>
          </slot>
        </MazBtn>
        <MazBtn
          color="transparent"
          class="m-carousel__btn"
          :class="{ 'm-carousel__btn--muted': isScrolledMax }"
          fab
          @click="next"
        >
          <!-- Replace the default `<svg />` icon -->
          <slot name="next-icon">
            <!-- `<svg />` -->
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              accent="#03A89D"
              class="display:inline-block"
            >
              <g
                id="ChevronRight"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <polygon
                  id="Fill"
                  fill="currentColor"
                  points="13.75 10 7.5 16.25 6.625 15.375 12 10 6.625 4.625 7.5 3.75"
                />
              </g>
            </svg>
          </slot>
        </MazBtn>
      </div>
    </div>
    <div
      ref="MazCarouselItems"
      class="m-carousel__items maz-flex maz-flex-1 maz-items-center maz-py-4 maz-pl-3"
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
  // import MazBtn from './../MazBtn/MazBtn.vue'

  const props = defineProps({
    scrollBtn: { type: Boolean, default: true },
  })

  const slots = useSlots()

  const isScrolled = ref(false)
  const isScrolledMax = ref(false)
  const MazCarouselItems = ref<HTMLDivElement>()

  const hasHeader = () => {
    return props.scrollBtn || slots['title']
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
    position: relative;
    width: 100%;

    &__items {
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow-y: hidden;
      overflow-x: auto;
      scroll-behavior: smooth;

      @apply maz-space-x-6;

      &__spacer {
        flex: 0 0 1px;
        width: 1px;
        height: 1px;
      }
    }

    &__btn {
      @apply maz-text-gray-800;

      &--muted {
        @apply maz-text-gray-400;
        @apply maz-fill-current;
      }
    }
  }
</style>
