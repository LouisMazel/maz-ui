<template>
  <div
    class="m-card"
    :class="[
      {
        'm-card--linked': href,
        'm-card--no-scale': !scale,
        'maz-elevation': elevation,
        'maz-overflow-hidden': overflowHidden || !isOpen,
        'maz-rounded': radius,
        'maz-border maz-border-solid maz-border-color-light': bordered,
      },
    ]"
  >
    <Component
      :is="collapsable ? 'button' : 'div'"
      v-if="$slots['header'] || header || collapsable"
      class="m-card__header maz-border-b maz-border-solid"
      :class="[
        isOpen
          ? 'maz-rounded-t maz-border-color-light dark:maz-bg-color-lighter'
          : 'maz-border-transparent',
        { '--is-collapsable': collapsable },
        { 'maz-justify-end': (!$slots['header'] || !header) && collapsable },
        { 'maz-justify-between': $slots['header'] || header },
      ]"
      tabindex="-1"
      @click.stop="collapsable ? (isOpen = !isOpen) : undefined"
    >
      <slot v-if="$slots['header'] || header" name="header">{{ header }}</slot>

      <MazBtn
        v-if="collapsable"
        color="transparent"
        class="maz-ml-2 maz-text-sm"
        size="xs"
        @click.stop="isOpen = !isOpen"
      >
        <ChevronDownIcon
          :class="{ '--is-open': isOpen }"
          class="m-card__collapse-icon maz-text-xl"
        />
      </MazBtn>
    </Component>
    <Component
      :is="wrapperData.is"
      v-bind="wrapperData"
      class="m-card__wrapper"
      :class="[`m-card__wrapper--${orientation}`, { 'm-card__link': href }]"
    >
      <div v-if="images" class="m-card__gallery__wrapper">
        <MazGallery
          :no-radius="!radius"
          :width="galleryWidthComputed"
          :height="galleryHeight"
          :images-shown-count="imagesShowCount"
          :images="images"
          :no-zoom="!zoom"
          :no-width="isColumnVariant"
          :no-height="!isColumnVariant && haveSomeContent"
          :no-remaining="noRemaining"
          class="m-card__gallery maz-flex-1"
        />
      </div>
      <div class="maz-min-w-0 maz-flex-1">
        <Component :is="collapsable ? MazTransitionExpand : 'div'">
          <div
            v-show="isOpen"
            :class="[wrapperClass, { 'maz-p-4': !noPadding && !collapsable }]"
            class="m-card__content__wrapper"
          >
            <slot>
              <div v-if="$slots['title']" class="m-card__title">
                <slot name="title"></slot>
              </div>
              <div v-if="$slots['subtitle']" class="m-card__subtitle">
                <slot name="subtitle"></slot>
              </div>
              <div v-if="$slots['content']" class="m-card__content">
                <slot name="content"></slot>
              </div>
            </slot>
          </div>
        </Component>
      </div>
    </Component>
    <div
      v-if="$slots['footer']"
      class="m-card__footer maz-overflow-x-auto maz-p-3"
      :class="[
        {
          'maz-border-t-2 maz-border-color-light dark:maz-bg-color-lighter':
            isColumnVariant && haveSomeContent,
        },
        footerAlignClass,
      ]"
    >
      <slot name="footer"></slot>
    </div>
    <div v-if="$slots['actions']" class="m-card__actions maz-flex maz-p-2">
      <!-- @slot action of gallery -->
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, useSlots, ref, watch, defineAsyncComponent, type HTMLAttributes } from 'vue'
  import type { MazGalleryImage } from './types'
  import { type RouterLinkProps } from 'vue-router'
  export type { MazGalleryImage } from './types'

  const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
  const MazGallery = defineAsyncComponent(() => import('./MazGallery.vue'))
  const MazTransitionExpand = defineAsyncComponent(() => import('./MazTransitionExpand.vue'))
  const ChevronDownIcon = defineAsyncComponent(() => import('./../icons/chevron-down.svg'))

  export type Props = {
    /** Images displayed */
    images?: MazGalleryImage[]
    /** Card variant: Must be `column | row | row-reverse | column-reverse` */
    orientation?: 'column' | 'row' | 'row-reverse' | 'column-reverse'
    /** Make card a link (footer area excluded) */
    href?: string
    /** Make card a link with a router-link (footer area excluded) */
    to?: RouterLinkProps['to']
    /** Target option of link: Muse be one of `_blank | _self | _parent | _top | framename` */
    hrefTarget?: '_blank' | '_self' | '_parent' | '_top' | string
    /** Footer text alignment: `right | left` */
    footerAlign?: 'right' | 'left'
    /** Gallery image width */
    galleryWidth?: string | number
    /** Gallery image height */
    galleryHeight?: string | number
    /** Enable "zoom" image on click (can't be used when the card has a link) */
    zoom?: boolean
    /** Set elevation to card (box-shadow) */
    elevation?: boolean
    /** Set radius to card */
    radius?: boolean
    /** Set border to card */
    bordered?: boolean
    /** Number of images shown in the gallery */
    imagesShowCount?: number
    /** Remove transparent layer with the remain count (ex: +2) */
    noRemaining?: boolean
    /** scale animation on hover (only linked cards) */
    scale?: boolean
    /** add classes to wrapper */
    wrapperClass?: HTMLAttributes['class']
    /** Remove padding from content wrapper */
    noPadding?: boolean
    /** Hide overflow */
    overflowHidden?: boolean
    /** Card can be open and close */
    collapsable?: boolean
    /** Card is open by default if `true` */
    collapseOpen?: boolean
    /** Title of the card in header */
    header: string
  }

  const props = withDefaults(defineProps<Props>(), {
    images: undefined,
    orientation: 'column',
    href: undefined,
    to: undefined,
    hrefTarget: '_self',
    footerAlign: 'right',
    galleryWidth: 200,
    galleryHeight: 150,
    elevation: true,
    radius: true,
    imagesShowCount: 3,
    noRemaining: true,
    scale: true,
    wrapperClass: undefined,
  })

  const slots = useSlots()

  const isOpen = ref(props.collapsable ? props.collapseOpen : true)

  watch(
    () => props.collapseOpen,
    (value) => {
      if (props.collapsable) isOpen.value = value
    },
  )

  const wrapperData = computed(() => {
    return {
      is: props.href ? 'a' : props.to ? 'router-link' : 'div',
      ...(props.href && { href: props.href }),
      ...(props.to && { to: props.to }),
      target: props.hrefTarget,
    }
  })

  const isColumnVariant = computed(() => ['column', 'column-reverse'].includes(props.orientation))

  const haveSomeContent = computed(() => {
    const supportedSlots = new Set(['default', 'title', 'subtitle', 'content'])
    return Object.keys(slots).some((val) => supportedSlots.has(val))
  })

  const galleryWidthComputed = computed(() => (haveSomeContent.value ? props.galleryWidth : '100%'))

  const footerAlignClass = computed(() =>
    props.footerAlign === 'right' ? 'maz-text-right' : 'maz-text-left',
  )
</script>

<style lang="postcss" scoped>
  .m-card {
    @apply maz-relative maz-inline-flex maz-max-h-full maz-flex-col maz-bg-color dark:maz-border dark:maz-border-color-lighter;

    &__header {
      @apply maz-flex maz-items-center maz-px-4 maz-py-3 maz-transition-colors maz-duration-200;

      &.--is-collapsable {
        @apply hover:maz-bg-color-light;
      }
    }

    &__collapse-icon {
      @apply maz-rotate-0 maz-transition-transform maz-duration-200;

      &.--is-open {
        transform: rotate(180deg);
      }
    }

    &__wrapper {
      @apply maz-flex maz-flex-1;

      &--row {
        @apply maz-flex-row;
      }

      &--row-reverse {
        @apply maz-flex-row-reverse;
      }

      &--column {
        @apply maz-flex-col;
      }

      &--column-reverse {
        @apply maz-flex-col-reverse;
      }
    }

    &--linked {
      transition: all 300ms ease-in-out;
      transform: scale(1);

      &:hover:not(.m-card--no-scale) {
        @apply maz-z-1;

        transform: scale(1.02);
      }

      & .m-card__wrapper {
        @apply maz-cursor-pointer maz-no-underline;

        &:hover {
          @apply maz-no-underline;
        }
      }
    }

    &__content__wrapper {
      @apply maz-relative maz-max-w-full;
    }

    &__title,
    &__title > * {
      font-size: 1.2em;

      @apply maz-text-normal;
    }

    &__subtitle,
    &__subtitle > * {
      font-size: 1.1em;

      @apply maz-text-muted;
    }

    &__gallery__wrapper {
      @apply maz-relative maz-flex maz-overflow-hidden;
    }

    &__actions {
      @apply maz-absolute maz-left-0 maz-top-0 maz-z-2;

      & > *:not(:last-child) {
        @apply maz-mr-2;
      }
    }
  }
</style>
