<script lang="ts" setup>
import type { Component, HTMLAttributes } from 'vue'
import type { RouterLinkProps } from 'vue-router'
import type { MazGalleryProps } from './MazGallery.vue'
import { MazChevronDown } from '@maz-ui/icons'
import { computed, defineAsyncComponent, useSlots } from 'vue'
import { RouterLink } from 'vue-router'

const {
  gallery = undefined,
  orientation = 'column',
  href = undefined,
  to = undefined,
  hrefTarget = '_self',
  footerAlign = 'right',
  elevation = false,
  radius = true,
  padding = true,
  scale = true,
  wrapperClass = undefined,
  title = undefined,
  collapsible = false,
  bordered = true,
  collapseOpen = false,
} = defineProps<MazCardProps>()

defineEmits<{
  /**
   * Update the collapseOpen model
   * @value boolean
   */
  'update:collapseOpen': [boolean]
}>()

const DEFAULT_GALLERY_OPTIONS: MazGalleryProps = {
  displayedCount: 3,
  remaining: false,
  zoom: !href && !to,
  width: 200,
  height: 150,
}

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const MazGallery = defineAsyncComponent(() => import('./MazGallery.vue'))
const MazExpandAnimation = defineAsyncComponent(() => import('./MazExpandAnimation.vue'))

export interface MazCardProps {
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
  /** Images gallery props options (see `MazGallery` component) */
  gallery?: MazGalleryProps
  /** scale animation on hover (only linked cards) */
  scale?: boolean
  /** Set elevation to card (box-shadow) */
  elevation?: boolean
  /** Set radius to card */
  radius?: boolean
  /** Set border to card (in dark mode, the card is always bordered) */
  bordered?: boolean
  /** add classes to wrapper */
  wrapperClass?: HTMLAttributes['class']
  /** Remove padding from content wrapper */
  padding?: boolean
  /** Hide overflow */
  overflowHidden?: boolean
  /** Make card collapsible */
  collapsible?: boolean
  /**
   * Card is open by default if `true`
   * @model
   */
  collapseOpen?: boolean
  /** Title of the card in header */
  title?: string
  /** The card will be displayed in full width */
  block?: boolean
}

const slots = useSlots()

const collapseOpenModel = defineModel<boolean>('collapseOpen', { default: false })

collapseOpenModel.value = collapsible ? collapseOpen : true

const isColumnVariant = computed(() => ['column', 'column-reverse'].includes(orientation))
const haveSomeContent = computed(() => {
  const supportedSlots = new Set(['default', 'content-title', 'content-subtitle', 'content-body'])
  return Object.keys(slots).some(val => supportedSlots.has(val))
})
const galleryHeightComputed = computed(() => (haveSomeContent.value ? gallery?.height ?? DEFAULT_GALLERY_OPTIONS.height : '100%'))
const galleryWidthComputed = computed(() => (haveSomeContent.value ? gallery?.width ?? DEFAULT_GALLERY_OPTIONS.width : '100%'))
const galleryOptions = computed(() => {
  return {
    ...DEFAULT_GALLERY_OPTIONS,
    radius,
    width: isColumnVariant.value ? false : galleryWidthComputed.value,
    height: !isColumnVariant.value && haveSomeContent.value ? false : galleryHeightComputed.value,
    ...gallery,
  }
})
const wrapperData = computed(() => {
  let componentType: string | Component = 'div'

  if (href) {
    componentType = 'a'
  }
  else if (to) {
    componentType = RouterLink
  }

  return {
    is: componentType,
    ...(href && { href }),
    ...(to && { to }),
    target: hrefTarget,
  }
})
const footerAlignClass = computed(() =>
  footerAlign === 'right' ? 'maz-text-end' : 'maz-text-start',
)

const isLinked = computed(() => href || to)

function toggleCollapse() {
  if (collapsible)
    collapseOpenModel.value = !collapseOpenModel.value
}
</script>

<template>
  <div
    class="m-card m-reset-css"
    :class="[
      {
        'm-card--linked': isLinked,
        'm-card--no-scale': !scale,
        'maz-shadow-elevation maz-drop-shadow-md': elevation,
        '--block': block,
        'maz-overflow-hidden': overflowHidden || !collapseOpenModel,
        'maz-rounded': radius,
        'maz-border maz-border-solid maz-border-divider': bordered,
      },
    ]"
  >
    <Component
      :is="collapsible ? 'button' : 'div'"
      v-if="$slots.title || title || collapsible"
      class="m-card__header maz-border-b maz-border-solid"
      :class="[
        collapseOpenModel ? 'maz-rounded-t maz-border-divider' : 'maz-border-transparent',
        { '--is-collapsible': collapsible },
        { 'maz-justify-end': (!$slots.title || !title) && collapsible },
        { 'maz-justify-between': $slots.title || title },
      ]"
      tabindex="-1"
      @click.stop="collapsible ? toggleCollapse() : undefined"
    >
      <!--
        @slot title - The title of the card
      -->
      <slot v-if="$slots.title || title" name="title">
        {{ title }}
      </slot>

      <MazBtn
        v-if="collapsible"
        color="transparent"
        class="maz-ml-2 maz-text-sm"
        size="xs"
        @click.stop="toggleCollapse"
      >
        <MazChevronDown
          :class="{ '--is-open': collapseOpenModel }"
          class="m-card__collapse-icon maz-text-xl"
        />
      </MazBtn>
    </Component>
    <Component
      :is="wrapperData.is"
      v-bind="wrapperData"
      class="m-card__wrapper"
      :class="[`m-card__wrapper--${orientation}`, { 'm-card__link': isLinked }]"
    >
      <div v-if="galleryOptions.images" class="m-card__gallery__wrapper">
        <MazGallery
          v-bind="galleryOptions"
          class="m-card__gallery"
        />
      </div>
      <div class="maz-min-w-0 maz-flex-1">
        <Component :is="collapsible ? MazExpandAnimation : 'div'" v-model="collapseOpenModel" class="maz-h-full">
          <div
            :class="[wrapperClass, { 'maz-p-4': padding }]"
            class="m-card__content__wrapper"
          >
            <div v-if="$slots['content-title']" class="m-card__title">
              <!--
              @slot content-title - The title of the card
              @binding collapse-open - The collapse open state of the card
            -->
              <slot name="content-title" :collapse-open="collapseOpenModel" />
            </div>
            <div v-if="$slots['content-subtitle']" class="m-card__subtitle">
              <!--
              @slot content-subtitle - The subtitle of the card
            -->
              <slot name="content-subtitle" />
            </div>
            <div v-if="$slots['content-body']" class="m-card__content">
              <!--
              @slot content-body - The body of the card
            -->
              <slot name="content-body" />
            </div>
            <!--
              @slot default - The content of the card
              @binding collapse-open - The collapse open state of the card
            -->
            <slot :collapse-open="collapseOpenModel" />
          </div>
        </Component>
      </div>
    </Component>
    <div
      v-if="$slots.footer"
      class="m-card__footer maz-overflow-x-auto maz-p-3"
      :class="[
        {
          'maz-border-t maz-border-divider': isColumnVariant && haveSomeContent,
        },
        footerAlignClass,
      ]"
    >
      <!--
        @slot footer - The footer of the card
      -->
      <slot name="footer" />
    </div>
    <div v-if="$slots.actions && galleryOptions.images" class="m-card__actions maz-flex maz-p-2">
      <!--
        @slot actions - The actions of the image gallery (only if gallery is displayed)
      -->
      <slot name="actions" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .m-card {
  @apply maz-relative maz-inline-flex maz-max-h-full maz-flex-col maz-bg-surface dark:maz-border dark:maz-border-divider;

  &.--block {
    @apply maz-w-full;
  }

  &__header {
    @apply maz-flex maz-items-center maz-px-4 maz-py-3 maz-transition-colors maz-duration-200;

    &.--is-collapsible {
      @apply hover:maz-bg-surface-600;
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
    @apply maz-relative maz-max-w-full maz-h-full maz-flex maz-flex-col maz-gap-2;
  }

  &__title,
  &__title > * {
    @apply maz-text-foreground maz-text-xl;
  }

  &__subtitle,
  &__subtitle > * {
    @apply maz-text-muted maz-text-lg;
  }

  &__gallery {
    @apply maz-flex-1 maz-bg-surface-600 dark:maz-bg-surface-600/40;
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
