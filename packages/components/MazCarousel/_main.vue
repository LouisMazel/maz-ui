<template>
  <div class="maz-carousel maz-flex maz-direction-column">
    <div class="maz-carousel__header maz-flex maz-align-center">
      <!-- Title of the carousel -->
      <slot name="title" />
      <div class="maz-carousel__header__actions maz-flex-1 maz-text-right">
        <MazBtn
          color="transparent"
          outline
          class="maz-carousel__btn"
          :class="{ 'maz-carousel__btn--muted': !isScrolled }"
          fab
          size="sm"
          @click="previous"
        >
          <!-- Replace the default `<svg />` icon -->
          <slot name="previous-icon">
            <!-- `<svg />` -->
            <svg
              data-v-08533ec6=""
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
          outline
          class="maz-carousel__btn"
          :class="{ 'maz-carousel__btn--muted': isScrolledMax }"
          fab
          size="sm"
          @click="next"
        >
          <!-- Replace the default `<svg />` icon -->
          <slot name="next-icon">
            <!-- `<svg />` -->
            <svg
              data-v-08533ec6=""
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
      class="maz-carousel__items maz-flex maz-align-center maz-flex-1 maz-py-4 maz-pl-3"
      @scroll="setScrollState"
    >
      <!-- Insert your items -->
      <slot />
      <div class="maz-carousel__items__spacer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MazCarousel',
  data () {
    return {
      isScrolled: false,
      isScrolledMax: false
    }
  },
  methods: {
    next () {
      const { $refs } = this
      const items = $refs.MazCarouselItems
      items.scrollTo(items.scrollLeft + items.clientWidth, 0)
    },
    previous () {
      const { $refs } = this
      const items = $refs.MazCarouselItems
      items.scrollTo(items.scrollLeft - items.clientWidth, 0)
    },
    setScrollState (e) {
      const target = e.target

      if (target.scrollLeft >= 20) {
        this.isScrolled = true
      } else this.isScrolled = false

      const itemsScrollWidth = target.scrollWidth - target.clientWidth
      if (target.scrollLeft >= itemsScrollWidth - 20) {
        this.isScrolledMax = true
      } else this.isScrolledMax = false
    }
  }
}
</script>
