<template>
  <picture
    v-lazy-img="{
      noPhoto: noPhoto,
      observerOnce: !noObserverOnce,
      loadOnce: loadOnce,
      onIntersecting: (el) => $emit('intersecting', el),
      onLoading: (el) => $emit('loading', el),
      onLoaded: (el) => $emit('loaded', el),
      onError: (el) => $emit('error', el),
      observerOptions: observerOptions,
    }"
    class="m-lazy-img-component"
    :class="[{ '-use-loader': !noLoader, '--height-full': imageHeightFull }, props.class]"
    :style="style"
  >
    <source
      v-for="({ srcset, media }, sourceIndex) in sources"
      :key="sourceIndex"
      :data-lazy-srcset="srcset"
      :media="media"
    />
    <img
      v-bind="$attrs"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      loading="lazy"
      :alt="alt"
    />
    <div v-if="!noLoader" class="m-lazy-img-component-loader">
      <MazSpinner size="2em" />
    </div>
    <slot></slot>
  </picture>
</template>

<script lang="ts" setup>
  import { computed, defineAsyncComponent, type PropType, type HTMLAttributes } from 'vue'
  import { vLazyImg } from './../modules/directives/v-lazy-img/lazy-img'
  import type { vLazyImgOptions } from './../modules/directives/v-lazy-img/types'

  import type { Image } from './types'

  export type { Image }

  const MazSpinner = defineAsyncComponent(() => import('./MazSpinner.vue'))

  defineOptions({
    inheritAttrs: false,
  })

  const props = defineProps({
    style: {
      type: [String, Array, Object] as PropType<HTMLAttributes['style']>,
      default: undefined,
    },
    class: {
      type: [String, Array, Object] as PropType<HTMLAttributes['class']>,
      default: undefined,
    },
    image: { type: [String, Object] as PropType<Image>, default: undefined },
    alt: { type: String, default: undefined },
    noPhoto: { type: Boolean, default: false },
    noLoader: { type: Boolean, default: false },
    noObserverOnce: { type: Boolean, default: false },
    loadOnce: { type: Boolean, default: false },
    imageHeightFull: { type: Boolean, default: false },
    observerOptions: {
      type: Object as PropType<vLazyImgOptions['observerOptions']>,
      default: null,
    },
  })

  defineEmits(['intersecting', 'loading', 'loaded', 'error'])

  const sources = computed(() => {
    return typeof props.image === 'string' ? [{ srcset: props.image }] : props.image?.sources
  })
</script>

<style lang="postcss" scoped>
  .m-lazy-img-component {
    @apply maz-relative maz-inline-flex maz-flex-center;

    &-loader {
      @apply maz-absolute maz-inset-0 maz-hidden maz-flex-center;
    }

    &:not(.m-lazy-error, .m-lazy-no-photo) img {
      @apply maz-h-full maz-w-full;
    }

    &.--height-full img {
      @apply maz-max-h-full maz-w-min maz-max-w-min !important;
    }

    /* &:not(.m-lazy-loaded, .m-lazy-no-photo, .m-lazy-error) */
    &.m-lazy-loading {
      & .m-lazy-img-component-loader {
        @apply maz-flex;
      }
    }
  }
</style>
