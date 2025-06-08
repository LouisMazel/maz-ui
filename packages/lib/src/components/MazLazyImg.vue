<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { VLazyImgOptions } from '../directives/vLazyImg'
import { computed, defineAsyncComponent } from 'vue'

import { vLazyImg } from '../directives/vLazyImg'

interface Source {
  srcset?: string
  media?: string
}

interface DataImage {
  sources?: Source[]
}

export type MazImage = DataImage | string

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazLazyImgProps>(), {
  style: undefined,
  class: undefined,
  src: undefined,
  alt: undefined,
  observerOptions: undefined,
  fallbackSrc: undefined,
  observerOnce: true,
})

defineEmits<{
  /** Emitted when the image is intersecting */
  (name: 'intersecting', el: Element): void
  /** Emitted when the image is loading */
  (name: 'loading', el: Element): void
  /** Emitted when the image is loaded */
  (name: 'loaded', el: Element): void
  /** Emitted when the image is in error */
  (name: 'error', el: Element): void
}>()

const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

export interface MazLazyImgProps {
  /** The style of the component */
  style?: HTMLAttributes['style']
  /** The class of the component */
  class?: HTMLAttributes['class']
  /**
   * The source of the image
   * @type {string | Image | null}
   */
  src?: MazImage | null
  /** The alt of the image */
  alt?: string
  /** Remove the loader */
  hideLoader?: boolean
  /** Remove the observer once the image is loaded */
  observerOnce?: boolean
  /** Remove the observer once the image is loaded */
  loadOnce?: boolean
  /** Make the image height full */
  imageHeightFull?: boolean
  /** The options of the observer */
  observerOptions?: VLazyImgOptions['observerOptions']
  /** The fallback src to replace the src on loading error */
  fallbackSrc?: string
  /** The classes of the image element */
  imgClass?: HTMLAttributes['class']
  /** The image will be displayed in full width */
  block?: boolean
}

const sources = computed(() => {
  return typeof props.src === 'string' ? [{ srcset: props.src }] : props.src?.sources
})
</script>

<template>
  <picture
    v-lazy-img="{
      loadOnce,
      observerOptions,
      fallbackSrc,
      observerOnce,
      onIntersecting: (el) => $emit('intersecting', el),
      onLoading: (el) => $emit('loading', el),
      onLoaded: (el) => $emit('loaded', el),
      onError: (el) => $emit('error', el),
    }"
    class="m-lazy-img-component m-reset-css"
    :class="[{ '--use-loader': !hideLoader, '--height-full': imageHeightFull, '--block': block }, props.class]"
    :style
  >
    <source
      v-for="({ srcset, media }, sourceIndex) in sources"
      :key="sourceIndex"
      :data-lazy-srcset="srcset"
      :media
    >
    <img
      v-bind="$attrs"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      loading="lazy"
      :alt
      :class="imgClass"
    >
    <div v-if="!hideLoader" class="m-lazy-img-component-loader">
      <MazSpinner size="2em" />
    </div>
    <slot />
  </picture>
</template>

<style lang="postcss" scoped>
  .m-lazy-img-component {
  @apply maz-relative maz-inline-flex maz-align-top maz-flex-center;

  &.--block {
    @apply maz-w-full;

    img {
      @apply maz-w-full;
    }
  }

  &-loader {
    @apply maz-absolute maz-inset-0 maz-hidden maz-flex-center;
  }

  &.--height-full img {
    @apply maz-max-h-full maz-w-min maz-max-w-min !important;
  }

  &.m-lazy-error:not(.m-lazy-fallback) {
    @apply maz-bg-color-light;

    img {
      @apply maz-h-1/2 maz-w-1/2;
    }
  }

  &.m-lazy-loading {
    & .m-lazy-img-component-loader {
      @apply maz-flex;
    }
  }
}
</style>
