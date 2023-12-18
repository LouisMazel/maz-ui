<template>
  <span
    class="m-badge"
    :class="[
      `--${color}`,
      { '--outline': outline, '--pastel': pastel, '--nowrap': nowrap },
      `--rounded-${roundedSize}`,
    ]"
    :style="{ fontSize: size }"
  >
    <slot></slot>
  </span>
</template>

<script lang="ts" setup>
  import type { Color } from './types'
  export type BadgeColor = Color | 'gray'
  export type BadgeRoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

  withDefaults(
    defineProps<{
      color?: BadgeColor
      size?: string
      nowrap?: boolean
      outline?: boolean
      pastel?: boolean
      roundedSize?: BadgeRoundedSize
    }>(),
    {
      color: 'primary',
      size: '0.8em',
      nowrap: false,
      outline: false,
      pastel: false,
      roundedSize: 'md',
    },
  )
</script>

<style lang="postcss" scoped>
  .m-badge {
    @apply maz-inline-flex maz-items-center maz-justify-center maz-font-medium;

    padding: 0.25em 0.5em;
    line-height: 1.4em;

    &.--nowrap {
      @apply maz-whitespace-nowrap;
    }

    &.--rounded {
      &-none {
        @apply maz-rounded-none;
      }

      &-sm {
        @apply maz-rounded-sm;
      }

      &-md {
        @apply maz-rounded-md;
      }

      &-lg {
        @apply maz-rounded;
      }

      &-xl {
        @apply maz-rounded-xl;
      }

      &-full {
        @apply maz-rounded-full;
      }
    }

    &.--primary {
      @apply maz-border-primary maz-bg-primary maz-text-primary-contrast;

      &.--outline {
        @apply maz-border maz-bg-transparent maz-text-primary;
      }

      &.--pastel {
        @apply maz-border-primary-100 maz-bg-primary-100 maz-text-primary-800;
      }
    }

    &.--info {
      @apply maz-border-info maz-bg-info maz-text-info-contrast;

      &.--outline {
        @apply maz-border maz-bg-transparent maz-text-info;
      }

      &.--pastel {
        @apply maz-border-info-100 maz-bg-info-100 maz-text-info-800;
      }
    }

    &.--gray {
      @apply maz-border-gray-400 maz-bg-gray-400 maz-text-white;

      &.--outline {
        @apply maz-border maz-bg-transparent maz-text-gray-400;
      }

      &.--pastel {
        @apply maz-border-gray-100 maz-bg-gray-100 maz-text-gray-800;
      }
    }

    &.--black {
      @apply maz-border-black maz-bg-black maz-text-white;

      &.--outline {
        @apply maz-border maz-bg-transparent maz-text-black;
      }

      &.--pastel {
        @apply maz-border-gray-400 maz-bg-gray-400 maz-text-black;
      }
    }

    &.--white {
      @apply maz-border-white maz-bg-white maz-text-gray-800;

      &.--outline {
        @apply maz-border maz-bg-transparent maz-text-gray-800;
      }

      &.--pastel {
        @apply maz-border-gray-100 maz-bg-gray-100 maz-text-gray-800;
      }
    }

    &.--secondary {
      @apply maz-border-secondary maz-bg-secondary maz-text-secondary-contrast;

      &.--outline {
        @apply maz-border maz-bg-transparent maz-text-secondary;
      }

      &.--pastel {
        @apply maz-border-secondary-100 maz-bg-secondary-100 maz-text-secondary-800;
      }
    }

    &.--danger {
      @apply maz-border-danger maz-bg-danger maz-text-danger-contrast;

      &.--outline {
        @apply maz-border maz-bg-transparent maz-text-danger;
      }

      &.--pastel {
        @apply maz-border-danger-100 maz-bg-danger-100 maz-text-danger-800;
      }
    }

    &.--warning {
      @apply maz-border-warning maz-bg-warning maz-text-warning-contrast;

      &.--outline {
        @apply maz-border maz-bg-transparent maz-text-warning;
      }

      &.--pastel {
        @apply maz-border-warning-100 maz-bg-warning-100 maz-text-warning-800;
      }
    }

    &.--success {
      @apply maz-border-success maz-bg-success maz-text-success-contrast;

      &.--outline {
        @apply maz-border maz-bg-transparent maz-text-success;
      }

      &.--pastel {
        @apply maz-border-success-100 maz-bg-success-100 maz-text-success-800;
      }
    }
  }
</style>
