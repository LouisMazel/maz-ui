<template>
  <section
    v-if="images.length || hasEmptyLayer"
    class="maz-base-component maz-gallery maz-flex"
    :style="[sizeStyle]"
    :class="{ 'maz-border-radius': radius }"
  >
    <figure
      v-for="(image, i) in imagesShown"
      :key="i"
      class="maz-gallery__item maz-flex maz-flex-center"
      :class="`maz-gallery__item--${i + 1}`"
    >
      <img
        v-zoom-img="hasZoom ? `/${image.slug}` : { disabled: true }"
        v-lazy:background-image="`/${image.slug}`"
        class="maz-gallery__item__image maz-flex-1"
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        :alt="image.filename"
      />
      <div
        v-if="numberImagesRemaining && i + 1 === imagesShown.length && !noRemaining"
        class="maz-gallery__remaining-layer maz-flex maz-flex-center maz-bg-overlay"
      >
        <span>+{{ numberImagesRemaining }}</span>
      </div>
    </figure>
    <div
      v-if="hasEmptyLayer && !images.length"
      class="maz-bg-color-light maz-flex maz-flex-center maz-w-100"
      :class="{ 'maz-border-radius': radius }"
      :style="[sizeStyle]"
    >
      <i class="material-icons maz-text-muted">no_photography</i>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import imgDirective from 'vue-zoom-img'

export default defineComponent({
  name: 'MazGallery',
  props: {
    images: { type: Array, required: true },
    imagesShownNumber: { type: Number, default: 5 },
    noRemaining: { type: Boolean, default: false },
    height: { type: [Number, String], default: 150 },
    noHeight: { type: Boolean, default: false },
    width: { type: [Number, String], default: '100%' },
    noWidth: { type: Boolean, default: false },
    radius: { type: Boolean, default: false },
    hasZoom: { type: Boolean, default: false },
    hasEmptyLayer: { type: Boolean, default: false }
  },
  directives: {
    'zoom-img': imgDirective
  },
  setup (props) {
    const numberImagesRemaining = computed(() => {
      const { images, imagesShownNumber } = props
      return images.length - (images.length < imagesShownNumber ? images.length : imagesShownNumber)
    })
    const imagesShown = computed(() => props.images.slice(0, props.imagesShownNumber))

    const sizeStyle = computed(() => ({
      ...(!props.noWidth ? { flex: `0 0 ${Number.isInteger(props.width) ? `${props.width}px` : props.width}` } : {}),
      ...(!props.noHeight
        ? {
          height: Number.isInteger(props.height) ? `${props.height}px` : `${props.height}`,
          minHeight: Number.isInteger(props.height) ? `${props.height}px` : `${props.height}`
        }
        : {})
    }))

    return {
      numberImagesRemaining,
      imagesShown,
      sizeStyle
    }
  }
})
</script>

<style lang="scss" scoped>
  .maz-gallery {
    position: relative;
    overflow: hidden;

    &__item {
      position: absolute;
      top: 0;
      height: 50%;
      padding: 0;
      width: 100%;
      border-left: var(--maz-border-width) solid transparent;

      &--1 {
        left: 0;
        height: 100%;

        &:not(:last-child) {
          width: 50%;
        }
      }

      &--2 {
        left: 50%;
        width: 50%;
        height: 50%;

        &:last-child {
          height: 100%;
        }

        &:nth-last-child(4) {
          width: 25%;
        }
      }

      &--3 {
        top: 50%;
        left: 50%;
        width: 25%;

        &:last-child {
          width: 50%;
        }

        &:nth-last-child(3) {
          top: 0;
          left: 75%;
        }
      }

      &--4 {
        top: 50%;
        left: 50%;
        width: 25%;
        border-top: var(--maz-border-width) solid transparent;

        &:last-child {
          left: 75%;
          width: 25%;
        }
      }

      &--5 {
        top: 50%;
        left: 75%;
        width: 25%;
        border-top: var(--maz-border-width) solid transparent;
      }

      &:first-child {
        border-left: 0;
      }

      &--3:last-child,
      &--3:nth-last-child(2),
      &--4:last-child,
      &--5 {
        border-top: var(--maz-border-width) solid transparent;
      }

      &__image {
        // display: block;
        height: 100%;
        max-width: 100%;
        width: 100%;
        background-position: center center;
        background-size: cover;
        background-color: rgba(0, 0, 0, .05);
      }
    }

    &__remaining-layer {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;

      span {
        color: white;
        font-size: 2rem;
      }
    }
  }
</style>
