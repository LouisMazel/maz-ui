<template>
  <section class="n-gallery">
    <NGalleryResponsive
      v-if="!$mq[responsiveBreakpoint]"
      :medias="mobileMedias"
    />
    <div v-else class="n-gallery-desktop">
      <div class="n-gallery-desktop-column">
        <ol ref="nGalleryColumnElement" class="n-gallery-desktop-column-scroll">
          <template v-for="media in mediasWithId">
            <li
              :key="media.id"
              class="n-gallery-desktop-column-scroll-images"
              :class="{
                'is-video': media.srcs.type === 'VIX',
                'is-selected': media.id === mainImage.id,
              }"
              @click="setMainImage(media)"
            >
              <NLazyImg
                v-if="media.srcs.small"
                :image="media.srcs.small"
                load-once
              />
            </li>
          </template>
        </ol>
        <NGalleryScrollButtons
          v-if="hasScrollButton"
          class="n-gallery-desktop-column-buttons"
          @scroll-up="scrollUp"
          @scroll-down="scrollDown"
        />
      </div>
      <TransitionGroup
        v-if="mainImage"
        :name="slideTransition"
        class="n-gallery-desktop-main"
        tag="div"
      >
        <Component
          :is="getComponentName(srcs.type)"
          v-for="{ srcs, id } in [mainImage]"
          :key="id"
          class="n-gallery-desktop-main-image"
          v-bind="getMainMediaProps(srcs)"
        />
      </TransitionGroup>
    </div>
  </section>
</template>

<script lang="ts">
  import {
    computed,
    defineComponent,
    PropType,
    ref,
  } from '@nuxtjs/composition-api'

  import { DataImage } from './../NLazyImg/NLazyImg.vue'
  import BREAKPOINT from '~/config/constants/breakpoints.json'

  export interface GalleryDataMedia extends DataImage {
    type: string
    small?: string
    mobile?: string
    url?: string
  }

  export type GalleryMedia = GalleryDataMedia

  interface GalleryMediaWithId {
    srcs: GalleryMedia
    id: number
  }

  enum SlideTransition {
    UP = 'slide-up',
    DONW = 'slide-down',
  }

  const isVideo = (type: string) => type === 'VIX'

  const getMainMediaProps = (data: GalleryDataMedia) => {
    return isVideo(data.type)
      ? { url: data.url }
      : { image: data, 'no-use-loader': true }
  }

  export const getComponentName = (data: string) => {
    return isVideo(data) ? 'NVideoPlayer' : 'NLazyImg'
  }

  export default defineComponent({
    props: {
      medias: { type: Array as PropType<GalleryMedia[]>, required: true },
      responsiveBreakpoint: {
        type: String,
        default: 'tab-m',
        validator: (value: string) => {
          return Object.keys(BREAKPOINT).includes(value)
        },
      },
    },
    setup(props) {
      const mediasWithId = computed<GalleryMediaWithId[]>(() =>
        props.medias.map((srcs, i) => ({
          srcs,
          id: i,
        })),
      )
      const mobileMedias = computed(() =>
        props.medias.map((media) => ({
          type: media.type,
          url: isVideo(media.type) ? media.url : media.mobile,
        })),
      )

      const slideTransition = ref<SlideTransition>()
      const mainImage = ref<GalleryMediaWithId>(mediasWithId.value[0])
      const hasScrollButton = computed(() => props.medias.length > 5)
      const currentImageShown = ref(0)

      const nGalleryColumnElement = ref<HTMLDivElement>()

      const setMainImage = (image: GalleryMediaWithId) => {
        slideTransition.value =
          image.id > mainImage.value.id
            ? SlideTransition.UP
            : SlideTransition.DONW
        mainImage.value = image
      }

      const scrollDown = () => {
        const column = nGalleryColumnElement.value
        column?.scrollTo({
          top: column.scrollTop + column.clientHeight - 100,
          behavior: 'smooth',
        })
      }

      const scrollUp = () => {
        const column = nGalleryColumnElement.value
        column?.scrollTo({
          top: column.scrollTop - column.clientHeight + 100,
          behavior: 'smooth',
        })
      }

      return {
        nGalleryColumnElement,
        slideTransition,
        mediasWithId,
        mainImage,
        currentImageShown,
        setMainImage,
        hasScrollButton,
        scrollDown,
        scrollUp,
        mobileMedias,
        getMainMediaProps,
        getComponentName,
      }
    },
  })
</script>

<style lang="postcss">
  .n-gallery {
    &-desktop {
      @apply tw-flex;

      max-height: 640px;

      &-main {
        max-width: 640px;
        @apply tw-bg-grey-100 !important;
        @apply tw-flex tw-relative tw-flex-1 tw-w-full tw-h-full tw-overflow-hidden;

        aspect-ratio: 1;

        &-image {
          @apply tw-bg-grey-100 !important;
          @apply tw-w-full tw-h-full;

          > img {
            @apply tw-overflow-hidden;
          }

          &:not(.n-lazy-error):not(.n-lazy-no-photo) {
            > img {
              @apply tw-w-full tw-h-full;
            }
          }
        }
      }

      &-column {
        @apply tw-relative tw-flex tw-flex-1 tw-mr-3 tw-flex-col;

        width: 120px;
        max-width: 120px;

        &-buttons {
          @apply tw-mt-4 tw-pr-3 tw-flex;
        }

        &-scroll {
          @apply tw-relative tw-overflow-y-auto tw-flex tw-flex-1 tw-min-w-0 tw-pr-3 tw-flex-col;

          &-images {
            @apply tw-bg-grey-100 tw-transition tw-ease-in-out tw-duration-300 tw-overflow-hidden tw-border tw-border-transparent tw-cursor-pointer;

            width: 108px;
            min-width: 108px;
            height: 108px;
            min-height: 108px;

            &:not(:last-child) {
              @apply tw-mb-4;
            }

            &.is-video {
              @apply tw-flex tw-items-center tw-justify-center;

              &::before {
                @apply tw-h-12 tw-w-12 tw-rounded-full tw-bg-no-repeat tw-bg-center tw-transition tw-ease-in-out tw-duration-300;

                content: '';
                background-color: rgb(0 0 0 / 50%);
                background-image: url('~/assets/icons/player-arrow-play-white.svg');
                background-size: 68%;
              }

              &:hover:not(.is-selected)::before {
                @apply tw-transform tw-scale-110;
              }
            }

            &.is-selected {
              @apply tw-border-info-300 tw-cursor-default;
            }

            &:hover:not(.is-selected) img {
              @apply tw-transform tw-scale-110;
            }

            /* stylelint-disable no-descending-specificity */
            img {
              @apply tw-transition tw-ease-in-out tw-duration-300;
            }
            /* stylelint-enable no-descending-specificity */
          }
        }
      }
    }
  }

  /**
    ANIMATIONS
   */

  /** Slide Up */

  .slide-up-enter {
    transform: translateY(100%);
  }

  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 300ms ease-in-out;
  }

  .slide-up-leave,
  .slide-up-leave-active {
    position: absolute !important;
    top: 0;
  }

  .slide-up-leave-to {
    transform: translateY(-100%);
  }

  /** Slide Up */

  .slide-down-enter {
    transform: translateY(-100%);
  }

  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 300ms ease-in-out;
  }

  .slide-down-leave,
  .slide-down-leave-active {
    position: absolute !important;
    top: 0;
  }

  .slide-down-leave-to {
    transform: translateY(100%);
  }
</style>
