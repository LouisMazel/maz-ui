<script lang="ts" setup>
import type { Component, HTMLAttributes } from 'vue'
import type { RouterLinkProps } from 'vue-router'
import type { MazGalleryProps } from './MazGallery.vue'
import { MazChevronDown } from '@maz-ui/icons/lazy/MazChevronDown'
import { computed, defineAsyncComponent, useSlots } from 'vue'
import { hasSlotContent } from '../utils/hasSlotContent'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'
import MazIcon from './MazIcon.vue'

const {
  gallery = undefined,
  orientation = 'column',
  href = undefined,
  to = undefined,
  hrefTarget = '_self',
  footerAlign = 'end',
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

const isLinked = computed(() => !!href || !!to)

const DEFAULT_GALLERY_OPTIONS: MazGalleryProps = {
  displayedCount: 3,
  remaining: false,
  zoom: !isLinked.value,
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
  /** Make card a link with a router-link or nuxt-link (footer area excluded) */
  to?: RouterLinkProps['to']
  /** Target option of link: Muse be one of `_blank | _self | _parent | _top | framename` */
  hrefTarget?: '_blank' | '_self' | '_parent' | '_top' | string
  /** Footer text alignment along the inline axis: `start | end` (`end` = right in LTR, left in RTL) */
  footerAlign?: 'start' | 'end'
  /**
   * Images gallery props options (see `MazGallery` component)
   * @default `{ displayedCount: 3, remaining: false, zoom: !href && !to, width: 200, height: 150 }`
   * If `href` or `to` is set, `zoom` is set to `false`
   */
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
  return hasSlotContent(slots.default)
    || hasSlotContent(slots['content-title'])
    || hasSlotContent(slots['content-subtitle'])
    || hasSlotContent(slots['content-body'])
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
    componentType = resolveLinkComponent()
  }

  return {
    is: componentType,
    ...(href && { href }),
    ...(to && { to }),
    target: hrefTarget,
  }
})
const footerAlignClass = computed(() =>
  footerAlign === 'end' ? 'maz:text-end' : 'maz:text-start',
)

function toggleCollapse() {
  if (collapsible)
    collapseOpenModel.value = !collapseOpenModel.value
}
</script>

<template>
  <div
    class="m-card m-reset-css maz:relative maz:inline-flex maz:max-h-full maz:flex-col maz:bg-container maz:dark:border maz:dark:border-divider"
    :class="[
      {
        'm-card--linked': isLinked,
        'm-card--no-scale': !scale,
        'maz:shadow-elevation maz:drop-shadow-md': elevation,
        '--block maz:w-full': block,
        'maz:overflow-hidden': overflowHidden || !collapseOpenModel,
        'maz:rounded-md': radius,
        'maz:border': bordered,
      },
    ]"
  >
    <component
      :is="collapsible ? 'button' : 'div'"
      v-if="hasSlotContent(slots.title) || title || collapsible"
      class="m-card__header maz:flex maz:items-center maz:px-4 maz:py-3 maz:transition-colors maz:duration-200 maz:border-b maz:border-solid"
      :class="[
        collapseOpenModel ? 'maz:rounded-t-md maz:border-divider' : 'maz:border-transparent',
        { '--is-collapsible maz:hover:bg-surface-600': collapsible },
        { 'maz:justify-end': !hasSlotContent(slots.title) && !title && collapsible },
        { 'maz:justify-between': hasSlotContent(slots.title) || title },
      ]"
      tabindex="-1"
      @click.stop="collapsible ? toggleCollapse() : undefined"
    >
      <!--
        @slot title - The title of the card
      -->
      <slot v-if="hasSlotContent(slots.title) || title" name="title">
        {{ title }}
      </slot>

      <MazBtn
        v-if="collapsible"
        color="transparent"
        class="maz:ms-2 maz:text-sm"
        size="xs"
        @click.stop="toggleCollapse"
      >
        <MazIcon
          :icon="MazChevronDown"
          :class="{ '--is-open': collapseOpenModel }"
          class="m-card__collapse-icon maz:text-xl maz:rotate-0 maz:transition-transform maz:duration-200"
        />
      </MazBtn>
    </component>
    <component
      v-bind="wrapperData"
      :is="wrapperData.is"
      class="m-card__wrapper maz:flex maz:flex-1"
      :class="[
        `m-card__wrapper--${orientation}`,
        orientation === 'row' ? 'maz:flex-row' : orientation === 'row-reverse' ? 'maz:flex-row-reverse' : orientation === 'column' ? 'maz:flex-col' : 'maz:flex-col-reverse',
        { 'm-card__link maz:cursor-pointer maz:no-underline': isLinked },
      ]"
    >
      <div v-if="galleryOptions.images" class="m-card__gallery__wrapper maz:relative maz:flex maz:overflow-hidden">
        <MazGallery
          v-bind="{
            ...galleryOptions,
            zoom: !isLinked,
          }"
          class="m-card__gallery maz:flex-1 maz:bg-surface-600 maz:dark:bg-surface-600/40"
        />
      </div>
      <div class="maz:min-w-0 maz:flex-1">
        <component :is="collapsible ? MazExpandAnimation : 'div'" v-model="collapseOpenModel" class="maz:h-full">
          <div
            :class="[wrapperClass, { 'maz:p-4': padding }]"
            class="m-card__content__wrapper maz:relative maz:max-w-full maz:h-full maz:flex maz:flex-col maz:gap-2"
          >
            <div v-if="hasSlotContent(slots['content-title'])" class="m-card__title maz:text-foreground maz:text-xl maz:font-display">
              <!--
              @slot content-title - The title of the card
              @binding collapse-open - The collapse open state of the card
            -->
              <slot name="content-title" :collapse-open="collapseOpenModel" />
            </div>
            <div v-if="hasSlotContent(slots['content-subtitle'])" class="m-card__subtitle maz:text-muted maz:text-lg">
              <!--
              @slot content-subtitle - The subtitle of the card
            -->
              <slot name="content-subtitle" />
            </div>
            <div v-if="hasSlotContent(slots['content-body'])" class="m-card__content">
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
        </component>
      </div>
    </component>
    <div
      v-if="hasSlotContent(slots.footer)"
      class="m-card__footer maz:overflow-x-auto maz:p-3"
      :class="[
        {
          'maz:border-t maz:border-divider': isColumnVariant && haveSomeContent,
        },
        footerAlignClass,
      ]"
    >
      <!--
        @slot footer - The footer of the card
      -->
      <slot name="footer" />
    </div>
    <div v-if="hasSlotContent(slots.actions) && galleryOptions.images" class="m-card__actions maz:flex maz:p-2 maz:absolute maz:left-0 maz:top-0 maz:z-2">
      <!--
        @slot actions - The actions of the image gallery (only if gallery is displayed)
      -->
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-card {
  &__collapse-icon.--is-open {
    transform: rotate(180deg);
  }

  &--linked {
    transition: all 300ms ease-in-out;
    transform: scale(1);

    &:hover:not(.m-card--no-scale) {
      @apply maz:z-1;

      transform: scale(1.02);
    }
  }

  &__title > *,
  &__subtitle > * {
    color: inherit;
    font-size: inherit;
  }

  &__actions > *:not(:last-child) {
    @apply maz:me-2;
  }
}
</style>
