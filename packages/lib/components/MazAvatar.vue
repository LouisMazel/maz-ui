<template>
  <Component
    :is="componentType"
    :style="{ fontSize: size }"
    class="m-avatar"
    :class="[
      {
        '--has-link': isLink,
      },
    ]"
    :href="href"
    :to="to"
    :target="isLink ? target : undefined"
  >
    <div
      class="m-avatar__wrapper"
      :tabindex="clickable ? 0 : -1"
      :class="{
        '--has-shadow': !noElevation,
        '--bordered': bordered,
        '--clickable': clickable,
        '--square': square,
        '--has-initial': !src && caption,
      }"
    >
      <MazLazyImg
        v-if="src"
        class="m-avatar__picture maz-max-w-full"
        :image="src"
        :alt="alt"
        image-height-full
        :no-loader="noLoader"
        @click="clickable ? $emit('click', $event) : null"
      />
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
            ? `var(--maz-color-${buttonColor}-alpha)`
            : `var(--maz-color-${buttonColor})`,
        }"
        @click="$emit('click', $event)"
      >
        <slot v-if="!noClickableIcon" name="icon">
          <PencilIcon class="m-avatar__button__icon" />
        </slot>
      </button>
    </div>
    <slot name="caption">
      <p v-if="showCaption && caption" class="m-avatar__caption">
        {{ caption }}
      </p>
    </slot>
  </Component>
</template>

<script lang="ts" setup>
  import { computed, defineAsyncComponent, type PropType } from 'vue'

  import type { Color } from './types'
  export type { Color }

  const MazLazyImg = defineAsyncComponent(() => import('./MazLazyImg.vue'))
  const PencilIcon = defineAsyncComponent(() => import('./../icons/pencil.svg'))

  const props = defineProps({
    src: {
      type: String as PropType<undefined | null | string>,
      default: undefined,
    },
    caption: {
      type: String as PropType<undefined | null | string>,
      default: undefined,
    },
    href: { type: String, default: undefined },
    to: { type: Object, default: undefined },
    alt: { type: String, default: 'avatar image' },
    target: { type: String, default: '_self' },
    size: { type: String, default: undefined },
    bordered: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
    square: { type: Boolean, default: false },
    noElevation: { type: Boolean, default: false },
    showCaption: { type: Boolean, default: false },
    imageHeightFull: { type: Boolean, default: false },
    noLoader: { type: Boolean, default: false },
    buttonColor: {
      type: String as PropType<Color>,
      default: 'info',
    },
    /** Remove the icon on hover when component is clickable */
    noClickableIcon: { type: Boolean, default: false },
    letterCount: { type: Number, default: undefined },
  })

  const componentType = computed(() => (props.to ? 'RouterLink' : props.href ? 'a' : 'div'))
  const isLink = computed(() => !!props.to || !!props.href)

  function getInitials(name: string, lettersCount = props.letterCount) {
    const words = name.split(' ')

    const initials = words.map((word) => word[0])

    const letters = initials.join('')

    return letters.slice(0, lettersCount)
  }

  defineEmits(['click'])
</script>

<style lang="postcss" scoped>
  .m-avatar {
    @apply maz-inline-flex maz-flex-col maz-flex-center;
    @apply maz-no-underline !important;

    &__caption {
      @apply maz-mt-2 maz-w-full maz-truncate maz-text-center maz-font-medium maz-capitalize;
    }

    &__initial {
      @apply maz-capitalize maz-text-white;

      font-size: 1.5em;
    }

    &__wrapper {
      @apply maz-relative maz-flex maz-flex-none maz-justify-center maz-overflow-hidden
        maz-rounded-full maz-bg-color-lighter;

      height: 3em;
      width: 3em;

      &.--clickable {
        & .m-avatar__button {
          @apply maz-absolute maz-inset-0 maz-flex maz-w-full
            maz-cursor-pointer maz-rounded maz-border-none maz-bg-transparent
            maz-opacity-0 maz-outline-none maz-transition-all maz-duration-200 maz-flex-center;

          transform: scale(0);

          &__icon {
            @apply maz-text-white;
          }
        }

        &:not(.--square) .m-avatar__button {
          @apply maz-rounded-full;
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
        @apply maz-border maz-border-solid maz-border-white;
      }

      &.--square {
        @apply maz-rounded;
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
