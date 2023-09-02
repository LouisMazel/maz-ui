<template>
  <div class="n-gallery-responsive tw-relative">
    <SwiperComponent :options="swiperOptions">
      <SwiperSlide v-for="(media, i) in medias" :key="i">
        <Component
          :is="getComponentName(media.type)"
          v-bind="getMainMediaMobileProps(media)"
          class="tw-h-full"
        />
      </SwiperSlide>
      <div slot="pagination" class="swiper-pagination"></div>
    </SwiperComponent>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from '@nuxtjs/composition-api'
  import { SwiperOptions } from 'swiper/swiper'
  import { getComponentName } from './NGallery.vue'
  import { Swiper as SwiperComponent, SwiperSlide } from '~/plugins/swiper'

  interface media {
    type: string
    url: string
  }

  const getMainMediaMobileProps = (data: media) => {
    const { url, type } = data
    return type === 'VIX'
      ? { url, class: 'tw-flex tw-items-center' }
      : { image: url }
  }

  export default defineComponent({
    components: {
      SwiperComponent,
      SwiperSlide,
    },
    props: {
      medias: { type: Array as PropType<media[]>, default: () => [] },
    },
    setup() {
      const swiperOptions: SwiperOptions = {
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: false,
          dynamicBullets: true,
          dynamicMainBullets: 6,
          type: 'fraction',
        },
      }

      return {
        swiperOptions,
        getComponentName,
        getMainMediaMobileProps,
      }
    },
  })
</script>

<style lang="postcss" scoped>
  .swiper-pagination {
    @apply tw-left-auto tw-right-4 tw-bottom-6 tw-w-auto tw-text-white tw-inline-block tw-rounded tw-px-2 tw-py-1 tw-text-xs;

    background: hsla(0, 0%, 0%, 0.64);
  }

  .swiper-slide {
    @apply tw-h-auto;
  }
</style>
