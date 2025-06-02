<script lang="ts" setup>
import type { MazGalleryImage } from './types'
import { computed, defineAsyncComponent, onBeforeMount } from 'vue'
import { vFullscreenImg } from '../directives/vFullscreenImg'
import { vLazyImg } from '../directives/vLazyImg'

export interface MazGalleryProps {
  /**
   *  Array of string or object: `['https://via.placeholder.com/500', 'https://via.placeholder.com/600']` or `[{ slug: 'https://via.placeholder.com/500', alt: 'image descripton' }, { slug: 'https://via.placeholder.com/600', alt: 'image descripton' }]`
   */
  images: MazGalleryImage[]
  /**
   * Images count shown (max: 5)
   * @type number
   * @default 5
   */
  imagesShownCount?: number
  /**
   * Remove transparent layer with the remain count (ex: +2)
   * @type boolean
   * @default false
   */
  noRemaining?: boolean
  /**
   * Height of gallery
   * @type number | string
   * @default 150
   */
  height?: number | string
  /**
   * Remove default height - useful to set height with css
   * @type boolean
   * @default false
   */
  noHeight?: boolean
  /**
   * Width of gallery
   * @type number | string
   * @default '100%'
   */
  width?: number | string
  /**
   * Remove default width
   * @type boolean
   * @default false
   */
  noWidth?: boolean
  /**
   * Disable the border radius of the gallery
   * @type boolean
   * @default false
   */
  noRadius?: boolean
  /**
   * Disable full size display when clicking on image
   * @type boolean
   * @default false
   */
  noZoom?: boolean
  /**
   * Layer with photography icon when no images is provided
   * @type boolean
   * @default true
   */
  hasEmptyLayer?: boolean
  /**
   * Lazy load image - if false, images are directly loaded
   * @type boolean
   * @default true
   */
  lazy?: boolean
  /**
   * Disable blur effect on image hover
   * @type boolean
   * @default true
   */
  blur?: boolean
  /**
   * Disable scale animation effect on image hover
   * @type boolean
   * @default true
   */
  scale?: boolean
  /**
   * Choose color of borders between images - Should be a CSS color or CSS variable - Ex: `#000` or `var(--maz-color-bg-light)`
   * @type string
   * @default 'transparent'
   */
  separatorColor?: string
}

const {
  images = [],
  imagesShownCount = 5,
  noRemaining = false,
  height = 150,
  noHeight = false,
  width = '100%',
  noWidth = false,
  noRadius = false,
  noZoom = false,
  hasEmptyLayer = true,
  lazy = true,
  blur = true,
  scale = true,
  separatorColor = 'transparent',
} = defineProps<MazGalleryProps>()

const NoPhotographyIcon = defineAsyncComponent(() => import('../../icons/no-photography.svg'))

onBeforeMount(() => {
  if (imagesShownCount > 5)

    console.warn('[MazUI](m-gallery) The maximum of "images-shown-count" is 5')
})

const sizeStyle = computed(() => {
  return {
    ...(noWidth
      ? {}
      : {
          flex: `0 0 ${typeof width}` === 'number' ? `${width}px` : width,
          width: typeof width === 'number' ? `${width}px` : width,
        }),
    ...(noHeight
      ? {}
      : {
          height: typeof height === 'number' ? `${height}px` : `${height}`,
          minHeight: typeof height === 'number' ? `${height}px` : `${height}`,
        }),
  }
})
const imagesCount = computed(() => {
  return imagesShownCount <= 5 ? imagesShownCount : 5
})
const numberImagesRemaining = computed(() => {
  return (
    images.length
    - (images.length < imagesCount.value ? images.length : imagesCount.value)
  )
})
const imagesNormalized = computed(() => {
  return images.map(image =>
    typeof image === 'object'
      ? { ...image, thumbnail: image.thumbnail ?? image.src }
      : { src: image, thumbnail: image, alt: undefined },
  )
})
const imagesShown = computed(() => {
  return imagesNormalized.value.slice(0, imagesCount.value)
})
const imagesHidden = computed(() => {
  return imagesNormalized.value.slice(imagesCount.value, images.length)
})
function shouldHaveRemainingLayer(index: number): boolean {
  if (noRemaining)
    return false

  return (numberImagesRemaining.value && index + 1) === imagesShown.value.length
}
</script>

<template>
  <div
    v-if="images.length > 0 || hasEmptyLayer"
    class="m-gallery m-reset-css"
    :style="[sizeStyle, { '--gallery-separator-color': separatorColor }]"
    :class="{ 'maz-rounded': !noRadius }"
  >
    <section class="m-gallery__wrapper maz-flex maz-flex-1">
      <figure
        v-for="(image, i) in imagesShown"
        :key="i"
        class="m-gallery__item !maz-my-0 maz-flex maz-flex-center"
        :class="[`m-gallery__item--${i + 1}`]"
      >
        <img
          v-lazy-img:bg-image="{ src: image.thumbnail, disabled: !lazy }"
          v-fullscreen-img="{
            src: image.src,
            alt: image.alt,
            disabled: noZoom || shouldHaveRemainingLayer(i),
            blurOnHover: blur,
            scaleOnHover: scale,
          }"
          class="m-gallery__item__image maz-flex-1"
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          :alt="image.alt"
          loading="lazy"
        >
        <div
          v-if="shouldHaveRemainingLayer(i)"
          v-fullscreen-img="{
            src: image.src,
            alt: image.alt,
            disabled: noZoom,
            blurOnHover: false,
            scaleOnHover: scale,
          }"
          class="m-gallery__remaining-layer maz-flex maz-bg-overlay maz-flex-center"
        >
          <span class="maz-text-2xl maz-text-white">+{{ numberImagesRemaining }}</span>
        </div>
      </figure>
      <div
        v-if="hasEmptyLayer && images.length === 0"
        class="empty-layer maz-flex maz-w-full maz-bg-color-light maz-text-normal maz-flex-center"
        :class="{ 'maz-rounded-xl': !noRadius }"
        :style="[sizeStyle]"
      >
        <NoPhotographyIcon class="maz-h-8 maz-w-8" />
      </div>
    </section>
    <div
      v-for="(image, i) in imagesHidden"
      :key="i"
      v-fullscreen-img="{ src: image.src, disabled: noZoom }"
      class="m-gallery__hidden"
    />
  </div>
</template>

<style lang="postcss" scoped>
.m-gallery {
  @apply maz-relative maz-overflow-hidden maz-flex;

  &__hidden {
    @apply maz-hidden;
  }

  &__item {
    @apply maz-absolute maz-top-0 maz-m-0 maz-h-1/2 maz-w-full
        maz-overflow-hidden maz-border-l-2 maz-p-0;

    border-color: var(--gallery-separator-color);

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
      @apply maz-border-t-2;

      border-color: var(--gallery-separator-color);
      top: 50%;
      left: 50%;
      width: 25%;

      &:last-child {
        left: 75%;
        width: 25%;
      }
    }

    &--5 {
      @apply maz-border-t-2;

      border-color: var(--gallery-separator-color);
      top: 50%;
      left: 75%;
      width: 25%;
    }

    &:first-child {
      border-left: 0;
    }

    &--3:last-child,
    &--3:nth-last-child(2),
    &--4:last-child,
    &--5 {
      @apply maz-border-t-2;

      border-color: var(--gallery-separator-color);
    }

    &__image {
      height: 100%;
      max-width: 100%;
      width: 100%;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: hsl(0deg 0% 0% / 50%);
    }
  }

  &__remaining-layer {
    position: absolute;
    inset: 0;

    a span {
      color: hsl(0deg 0% 100%);
      font-size: 2rem;
    }
  }
}
</style>
