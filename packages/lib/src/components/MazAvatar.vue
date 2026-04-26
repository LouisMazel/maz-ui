<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types'
import { MazPencil } from '@maz-ui/icons/lazy/MazPencil'
import { computed, defineAsyncComponent } from 'vue'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'

defineOptions({
  inheritAttrs: false,
})

const {
  src = undefined,
  caption = undefined,
  href = undefined,
  to = undefined,
  alt = 'avatar image',
  target = '_self',
  size = undefined,
  class: className,
  color = 'primary',
  buttonColor = 'info',
  letterCount = undefined,
  roundedSize = 'md',
  fallbackSrc = undefined,
  loading = 'intersecting',
} = defineProps<MazAvatarProps>()

const emits = defineEmits<{
  /** Emitted when the avatar is clicked */
  (name: 'click', event: MouseEvent): void
  /** Emitted when the image is intersecting */
  (name: 'intersecting', el: Element): void
  /** Emitted when the image is loading */
  (name: 'loading', el: Element): void
  /** Emitted when the image is loaded */
  (name: 'loaded', el: Element): void
  /** Emitted when the image is in error */
  (name: 'error', el: Element): void
}>()

const MazLazyImg = defineAsyncComponent(() => import('./MazLazyImg.vue'))

export interface MazAvatarProps {
  /** The style of the component */
  style?: HTMLAttributes['style']
  /** The class of the component */
  class?: HTMLAttributes['class']
  /** The source of the image */
  src?: string | null
  /** The caption of the avatar */
  caption?: string | null
  /** The link of the avatar */
  href?: string
  /** The link (router-link or nuxt-link) of the avatar */
  to?: string | Record<string, unknown>
  /** The alt of the image */
  alt?: string
  /** The target of the link */
  target?: string
  /** The size of the avatar */
  size?: string
  /** Add a border to the avatar */
  bordered?: boolean
  /** Make the avatar clickable */
  clickable?: boolean
  /** Make the avatar square */
  square?: boolean
  /** Remove the shadow */
  noElevation?: boolean
  /** Show the caption */
  showCaption?: boolean
  /** Make the image height full */
  imageHeightFull?: boolean
  /** Remove the loader */
  hideLoader?: boolean
  /**
   * The color of the clickable button
   * @values `"primary" | "secondary" | "accent" | "info" | "success" | "warning" | "destructive" | "contrast" | "transparent"`
   */
  buttonColor?: MazColor
  /** Remove the icon on hover when component is clickable */
  hideClickableIcon?: boolean
  /** Number of letters to display in the round text */
  letterCount?: number
  /**
   * Size of the rounded
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   */
  roundedSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** The fallback src to replace the src on loading error */
  fallbackSrc?: string
  /**
   * The loading strategy of the image - lazy, eager or intersecting
   * @default 'intersecting'
   * @values `'lazy' | 'eager' | 'intersecting'`
   */
  loading?: 'lazy' | 'eager' | 'intersecting'
  /**
   * The color of the avatar
   * @values `"primary" | "secondary" | "accent" | "info" | "success" | "warning" | "destructive" | "contrast" | "transparent"`
   */
  color?: MazColor
}

const componentType = computed(() => {
  if (to)
    return resolveLinkComponent()
  if (href)
    return 'a'
  return 'div'
})
const isLink = computed(() => !!to || !!href)

function getInitials(name: string, lettersCount = letterCount) {
  const words = name.split(' ')

  const initials = words.map(word => word[0])

  const letters = initials.join('')

  return letters.slice(0, lettersCount)
}

const shouldDisplayImg = computed(() => src || (!src && !caption))

function handleImageError(event: Event) {
  emits('error', event.target as Element)

  if (fallbackSrc && event.target instanceof HTMLImageElement) {
    const currentSrc = new URL(event.target.src)
    const fallbackSource = new URL(fallbackSrc)

    if (currentSrc.href === fallbackSource.href) {
      return
    }

    event.target.src = fallbackSource.href
  }
}

const hasInitial = computed(() => !src && caption)

const ROUNDED_CLASS = {
  none: 'maz:rounded-none',
  sm: 'maz:rounded-xs',
  md: 'maz:rounded-md',
  lg: 'maz:rounded-lg',
  xl: 'maz:rounded-xl',
  full: 'maz:rounded-full',
} as const
</script>

<template>
  <component
    :is="componentType"
    :style="[{ fontSize: size }, style]"
    class="m-avatar m-reset-css maz:inline-flex maz:flex-col maz:gap-[0.5em] maz:align-top maz:flex-center maz:no-underline!"
    :class="[
      { '--has-link': isLink, 'maz:cursor-pointer': isLink },
      className,
    ]"
    :href
    :to="to"
    :target="isLink ? target : undefined"
  >
    <div
      class="m-avatar__wrapper maz:relative maz:flex maz:h-[3em] maz:w-[3em] maz:flex-none maz:justify-center maz:overflow-hidden"
      :tabindex="clickable ? 0 : -1"
      :class="[
        ROUNDED_CLASS[square ? 'none' : roundedSize],
        `--rounded-${square ? 'none' : roundedSize}`,
        {
          '--clickable': clickable,
          '--has-shadow': !noElevation,
          '--bordered': bordered,
          '--has-initial': hasInitial,
          'maz:shadow-sm': !noElevation,
          'maz:border maz:border-solid maz:border-divider': bordered,
          'maz:items-center': hasInitial,
        },
      ]"
      :style="hasInitial ? {
        backgroundColor: `var(--maz-${color})`,
        color: `var(--maz-${color}-foreground)`,
      } : undefined"
    >
      <template v-if="shouldDisplayImg">
        <MazLazyImg
          v-if="loading === 'intersecting'"
          v-bind="$attrs"
          class="m-avatar__picture maz:w-full maz:max-w-full"
          :src
          :alt
          image-height-full
          :hide-loader
          :fallback-src
          @click="clickable ? $emit('click', $event) : null"
          @error="$emit('error', $event)"
          @loaded="$emit('loaded', $event)"
          @loading="$emit('loading', $event)"
          @intersecting="$emit('intersecting', $event)"
        />
        <img
          v-else
          class="m-avatar__picture maz:w-full maz:max-w-full"
          :src="src ?? fallbackSrc"
          :alt="alt"
          :loading
          @error="handleImageError"
        >
      </template>
      <slot v-if="caption && !src" name="round-text">
        <span class="m-avatar__initial maz:text-[1.5em] maz:capitalize"> {{ getInitials(caption) }} </span>
      </slot>

      <button
        v-if="clickable"
        type="button"
        tabindex="-1"
        class="m-avatar__button maz:absolute maz:inset-0 maz:flex maz:w-full maz:cursor-pointer maz:border-none maz:bg-transparent maz:opacity-0 maz:transition-all maz:duration-200 maz:flex-center"
        :class="ROUNDED_CLASS[square ? 'none' : roundedSize]"
        :style="{
          backgroundColor: src
            ? `color-mix(in srgb, var(--maz-${buttonColor}) 60%, transparent)`
            : `var(--maz-${buttonColor})`,
        }"
        @click="$emit('click', $event)"
      >
        <slot v-if="!hideClickableIcon" name="icon">
          <MazPencil class="m-avatar__button__icon maz:text-white" />
        </slot>
      </button>
    </div>
    <slot name="caption">
      <p v-if="showCaption && caption" class="m-avatar__caption maz:w-full maz:truncate maz:text-center maz:font-medium maz:capitalize">
        {{ caption }}
      </p>
    </slot>
  </component>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-avatar__wrapper {
  &.--clickable {
    & .m-avatar__button {
      transform: scale(0);
    }

    &:hover,
    &:focus {
      & .m-avatar__picture {
        filter: blur(1.5px);
      }

      & .m-avatar__button {
        @apply maz:opacity-100;

        transform: scale(1.05);
      }
    }
  }
}
</style>
