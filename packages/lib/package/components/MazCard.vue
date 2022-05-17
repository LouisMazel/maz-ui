<template>
  <div
    class="m-card"
    :class="[
      {
        'm-card--linked': href,
        'm-card--no-scale': !scale,
        'maz-elevation': elevation,
        'maz-overflow-hidden': overflowHidden || !isOpen,
        'maz-rounded-xl': radius,
        'maz-border-2 maz-border-solid maz-border-color-lighter': bordered,
      },
    ]"
  >
    <Component
      :is="collapsable ? 'button' : 'div'"
      v-if="$slots['header'] || collapsable"
      class="m-card__header maz-rounded-t-xl maz-border-b-2"
      :class="[
        isOpen ? 'maz-border-color-lighter' : 'maz-border-transparent',
        { '--is-collapsable': collapsable },
      ]"
      tabindex="-1"
      @click.stop="collapsable ? (isOpen = !isOpen) : undefined"
    >
      <slot name="header" />

      <MazBtn
        v-if="collapsable"
        color="transparent"
        class="maz-ml-2 maz-text-sm"
        size="xs"
        @click.stop="isOpen = !isOpen"
      >
        <MazIcon
          :src="ChevronDownIcon"
          :class="{ '--is-open': isOpen }"
          class="m-card__collapse-icon maz-h-6"
        />
      </MazBtn>
    </Component>
    <Component
      :is="href ? 'a' : 'div'"
      class="m-card__wrapper"
      :class="[`m-card__wrapper--${orientation}`, { 'm-card__link': href }]"
      :href="href"
      :target="href ? hrefTarget : null"
    >
      <div v-if="images" class="m-card__gallery__wrapper">
        <MazGallery
          :radius="radius"
          :width="galleryWidthComputed"
          :height="galleryHeight"
          :images-shown-count="imagesShowCount"
          :images="images"
          :zoom="zoom"
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
                <slot name="title" />
              </div>
              <div v-if="$slots['subtitle']" class="m-card__subtitle">
                <slot name="subtitle" />
              </div>
              <div v-if="$slots['content']" class="m-card__content">
                <slot name="content" />
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
          'maz-border-t-2 maz-border-color-lighter':
            isColumnVariant && haveSomeContent,
        },
        footerAlignClass,
      ]"
    >
      <slot name="footer" />
    </div>
    <div v-if="$slots['actions']" class="m-card__actions maz-flex maz-p-2">
      <!-- Slot above the gallery -->
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts">
  export type { MazGalleryImage } from './types'
</script>

<script lang="ts" setup>
  import { computed, useSlots, type PropType, ref, watch } from 'vue'
  import MazGallery from './MazGallery.vue'
  import MazBtn from './MazBtn.vue'
  import MazTransitionExpand from './MazTransitionExpand.vue'
  import MazIcon from './MazIcon.vue'
  import type { MazGalleryImage } from './types'
  import ChevronDownIcon from '@package/icons/chevron-down.svg'

  const props = defineProps({
    // Images displayed
    images: {
      type: Array as PropType<MazGalleryImage[]>,
      default: undefined,
    },
    // Card variant: Must be `column | row | row-reverse | column-reverse`
    orientation: {
      type: String,
      default: 'column',
      validator: (value: string) => {
        return ['column', 'row', 'row-reverse', 'column-reverse'].includes(
          value,
        )
      },
    },
    // Make card a link (footer area excluded)
    href: { type: String, default: undefined },
    // Target option of link: Muse be one of `_blank | _self | _parent | _top | framename`
    hrefTarget: { type: String, default: '_self' },
    // Footer text alignment: `right | left`
    footerAlign: { type: String, default: 'right' },
    // Gallery image width
    galleryWidth: { type: [String, Number], default: 200 },
    // Gallery image height
    galleryHeight: { type: [String, Number], default: 150 },
    // Enable "zoom" image on click (can't be used when the card has a link)
    zoom: { type: Boolean, default: false },
    // Set elevation to card (box-shadow)
    elevation: { type: Boolean, default: true },
    // Set radius to card (box-shadow)
    radius: { type: Boolean, default: true },
    // Set border to card
    bordered: { type: Boolean, default: false },
    // Number of images shown in the gallery
    imagesShowCount: { type: Number, default: 3 },
    // Remove transparent layer with the remain count (ex: +2)
    noRemaining: { type: Boolean, default: true },
    // scale animation on hover (only linked cards)
    scale: { type: Boolean, default: true },
    wrapperClass: { type: String, default: undefined },
    noPadding: { type: Boolean, default: false },
    overflowHidden: { type: Boolean, default: false },
    collapsable: { type: Boolean, default: false },
    collapseOpen: { type: Boolean, default: false },
  })

  const slots = useSlots()

  const isOpen = ref(props.collapsable ? props.collapseOpen : true)

  watch(
    () => props.collapseOpen,
    (value) => {
      if (props.collapsable) isOpen.value = value
    },
  )

  const isColumnVariant = computed(() =>
    ['column', 'column-reverse'].includes(props.orientation),
  )

  const haveSomeContent = computed(() => {
    const supportedSlots = ['default', 'title', 'subtitle', 'content']
    const response = Object.keys(slots).some((val) =>
      supportedSlots.includes(val),
    )
    return response
  })

  const galleryWidthComputed = computed(() =>
    haveSomeContent.value ? props.galleryWidth : '100%',
  )

  const footerAlignClass = computed(() =>
    props.footerAlign === 'right' ? 'maz-text-right' : 'maz-text-left',
  )
</script>

<style lang="postcss" scoped>
  .m-card {
    @apply maz-relative maz-inline-flex maz-max-h-full maz-flex-col maz-bg-color;

    &__header {
      @apply maz-flex maz-items-center maz-justify-between maz-py-3 maz-px-4 maz-transition-colors maz-delay-200;

      &.--is-collapsable {
        @apply hover:maz-bg-color-lighter;
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
      @apply maz-absolute maz-top-0 maz-left-0 maz-z-2;

      & > *:not(:last-child) {
        @apply maz-mr-2;
      }
    }
  }

  html.dark {
    & .m-card {
      @apply maz-bg-color-light;
    }
  }
</style>
