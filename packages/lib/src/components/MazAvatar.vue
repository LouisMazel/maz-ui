<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazColor } from './types'
import { MazPencil } from '@maz-ui/icons/lazy'
import { computed, defineAsyncComponent } from 'vue'
import { resolveLinkComponent } from '../utils/resolveLinkComponent'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazAvatarProps>(), {
  src: undefined,
  caption: undefined,
  href: undefined,
  to: undefined,
  alt: 'avatar image',
  target: '_self',
  size: undefined,
  buttonColor: 'info',
  letterCount: undefined,
  roundedSize: 'full',
  fallbackSrc: undefined,
  loading: 'intersecting',
})

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
  /** The color of the clickable button */
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
}

const routerLinkComponent = resolveLinkComponent()

const componentType = computed(() => {
  if (props.to)
    return routerLinkComponent
  if (props.href)
    return 'a'
  return 'div'
})
const isLink = computed(() => !!props.to || !!props.href)

function getInitials(name: string, lettersCount = props.letterCount) {
  const words = name.split(' ')

  const initials = words.map(word => word[0])

  const letters = initials.join('')

  return letters.slice(0, lettersCount)
}

const shouldDisplayImg = computed(() => props.src || (!props.src && !props.caption))

function handleImageError(event: Event) {
  emits('error', event.target as Element)

  if (props.fallbackSrc && event.target instanceof HTMLImageElement) {
    const currentSrc = new URL(event.target.src)
    const fallbackSrc = new URL(props.fallbackSrc)

    if (currentSrc.href === fallbackSrc.href) {
      return
    }

    event.target.src = props.fallbackSrc
  }
}
</script>

<template>
  <component
    :is="componentType"
    :style="[{ fontSize: size }, style]"
    class="m-avatar m-reset-css"
    :class="[
      {
        '--has-link': isLink,
      },
      props.class,
    ]"
    :href
    :to="to"
    :target="isLink ? target : undefined"
  >
    <div
      class="m-avatar__wrapper"
      :tabindex="clickable ? 0 : -1"
      :class="[
        {
          '--has-shadow': !noElevation,
          '--bordered': bordered,
          '--clickable': clickable,
          '--has-initial': !src && caption,
        },
        `--rounded-${square ? 'none' : roundedSize}`,
      ]"
    >
      <template v-if="shouldDisplayImg">
        <MazLazyImg
          v-if="loading === 'intersecting'"
          v-bind="$attrs"
          class="m-avatar__picture maz-w-full maz-max-w-full"
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
          class="m-avatar__picture maz-w-full maz-max-w-full"
          :src="src ?? fallbackSrc"
          :alt="alt"
          :loading
          @error="handleImageError"
        >
      </template>
      <slot v-if="caption && !src" name="round-text">
        <span class="m-avatar__initial"> {{ getInitials(caption) }} </span>
      </slot>

      <button
        v-if="clickable"
        type="button"
        tabindex="-1"
        class="m-avatar__button"
        :style="{
          backgroundColor: src
            ? `hsl(var(--maz-${buttonColor}) / 60%)`
            : `hsl(var(--maz-${buttonColor}))`,
        }"
        @click="$emit('click', $event)"
      >
        <slot v-if="!hideClickableIcon" name="icon">
          <MazPencil class="m-avatar__button__icon" />
        </slot>
      </button>
    </div>
    <slot name="caption">
      <p v-if="showCaption && caption" class="m-avatar__caption">
        {{ caption }}
      </p>
    </slot>
  </component>
</template>

<style scoped>
  .m-avatar {
  @apply maz-inline-flex maz-flex-col maz-gap-[0.5em] maz-align-top maz-flex-center;
  @apply !maz-no-underline;

  &__caption {
    @apply maz-w-full maz-truncate maz-text-center maz-font-medium maz-capitalize;
  }

  &__initial {
    @apply maz-text-[1.5em] maz-capitalize maz-text-white;
  }

  &__wrapper {
    @apply maz-relative maz-flex maz-h-[3em] maz-w-[3em] maz-flex-none maz-justify-center maz-overflow-hidden;

    &.--clickable {
      & .m-avatar__button {
        @apply maz-absolute maz-inset-0 maz-flex maz-w-full
            maz-cursor-pointer maz-border-none maz-bg-transparent
            maz-opacity-0 maz-transition-all maz-duration-200 maz-flex-center;

        transform: scale(0);

        &__icon {
          @apply maz-text-white;
        }
      }

      &:hover,
      &:focus {
        & .m-avatar__picture {
          filter: blur(1.5px);
        }

        & .m-avatar__button {
          @apply maz-opacity-100;

          transform: scale(1.05);
        }
      }
    }

    &.--bordered {
      @apply maz-border maz-border-solid maz-border-divider;
    }

    &.--rounded {
      &-sm {
        @apply maz-rounded-sm;

        .m-avatar__button {
          @apply maz-rounded-sm;
        }
      }

      &-md {
        @apply maz-rounded-md;

        .m-avatar__button {
          @apply maz-rounded-md;
        }
      }

      &-lg {
        @apply maz-rounded;

        .m-avatar__button {
          @apply maz-rounded-lg;
        }
      }

      &-xl {
        @apply maz-rounded-xl;

        .m-avatar__button {
          @apply maz-rounded-xl;
        }
      }

      &-full {
        @apply maz-rounded-full;

        .m-avatar__button {
          @apply maz-rounded-full;
        }
      }
    }

    &.--has-shadow {
      @apply maz-shadow;
    }

    &.--has-initial {
      @apply maz-items-center maz-bg-primary;
    }
  }

  &.--has-link {
    @apply maz-cursor-pointer;
  }
}
</style>
