f
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
    v-bind="$attrs"
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
      @keydown.enter="clickable ? $emit('click', $event) : undefined"
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
        <span class="m-avatar__initial"> {{ caption?.charAt(0) }} </span>
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
        <slot name="icon">
          <MazIcon :src="PencilIcon" class="m-avatar__button__icon" />
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

<script lang="ts">
  export type { Color } from './types'
</script>

<script lang="ts" setup>
  import type { PropType } from 'vue'
  import { computed } from 'vue'

  import MazLazyImg from './MazLazyImg.vue'
  import MazIcon from './MazIcon.vue'
  import PencilIcon from '@package/icons/pencil.svg'

  import type { Color } from './types'

  const props = defineProps({
    // url or path of the image
    src: {
      type: String as PropType<undefined | null | string>,
      default: undefined,
    },
    caption: {
      type: String as PropType<undefined | null | string>,
      default: undefined,
    },
    // url or path to link another page
    href: { type: String, default: undefined },
    // route config
    to: { type: Object, default: undefined },
    // alt text of image
    alt: { type: String, default: 'avatar image' },
    // target attribute of link (if url is provide)
    target: { type: String, default: '_self' },
    // size of avatar
    size: { type: String, default: undefined },
    // add border around the avatar
    bordered: { type: Boolean, default: false },
    // add an edit layer & emit `edit` event on click
    clickable: { type: Boolean, default: false },
    // Make the avatar square
    square: { type: Boolean, default: false },
    // Remove the shadow behind the avatar
    noElevation: { type: Boolean, default: false },
    showCaption: { type: Boolean, default: false },
    imageHeightFull: { type: Boolean, default: false },
    noLoader: { type: Boolean, default: false },
    buttonColor: {
      type: String as PropType<Color>,
      default: 'info',
      validator: (value: string) => {
        return [
          'primary',
          'secondary',
          'info',
          'success',
          'warning',
          'danger',
          'white',
          'black',
          'transparent',
        ].includes(value)
      },
    },
  })

  const componentType = computed(() =>
    props.to ? 'RouterLink' : props.href ? 'a' : 'div',
  )
  const isLink = computed(() => !!props.to || !!props.href)

  defineEmits(['click'])
</script>

<style lang="postcss" scoped>
  .m-avatar {
    @apply maz-inline-flex maz-flex-col maz-flex-center;
    @apply maz-no-underline !important;

    &__caption {
      @apply maz-mt-2 maz-w-full maz-truncate maz-text-center maz-text-base maz-font-medium maz-capitalize;
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

            height: 1em;
            width: 1em;
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
        @apply maz-border-2 maz-border-solid maz-border-white;
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
