<script lang="ts" setup>
import type { MazColor } from './types'

export type MazBadgeColor = MazColor | 'gray'
export type MazBadgeRoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface MazBadgeProps {
  color?: MazBadgeColor
  size?: string
  nowrap?: boolean
  outline?: boolean
  pastel?: boolean
  /**
   * Size radius of the component's border
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   */
  roundedSize?: MazBadgeRoundedSize
}

withDefaults(defineProps<MazBadgeProps>(), {
  color: 'primary',
  size: '0.8em',
  nowrap: false,
  outline: false,
  pastel: false,
  roundedSize: 'md',
})
</script>

<template>
  <span
    class="m-badge m-reset-css"
    :class="[
      `--${color}`,
      { '--outline': outline, '--pastel': pastel, '--nowrap': nowrap },
      `--rounded-${roundedSize}`,
    ]"
    :style="{ fontSize: size }"
  >
    <slot />
  </span>
</template>

<style lang="postcss" scoped>
  .m-badge {
  @apply maz-inline-flex maz-items-center maz-justify-center maz-border maz-align-top maz-font-semibold;

  padding: 0.25em 0.5em;
  line-height: 1.4em;

  &.--nowrap {
    @apply maz-whitespace-nowrap;
  }

  &.--rounded {
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
    @apply maz-border-primary maz-bg-primary maz-text-primary-foreground;

    &.--outline {
      @apply maz-border-primary maz-bg-primary/5 maz-text-primary;
    }

    &.--pastel {
      @apply maz-border-primary-100 maz-bg-primary-100 maz-text-primary;
    }
  }

  &.--info {
    @apply maz-border-info maz-bg-info maz-text-info-foreground;

    &.--outline {
      @apply maz-border-info maz-bg-info/5 maz-text-info;
    }

    &.--pastel {
      @apply maz-border-info-100 maz-bg-info-100 maz-text-info;
    }
  }

  &.--secondary {
    @apply maz-border-secondary maz-bg-secondary maz-text-secondary-foreground;

    &.--outline {
      @apply maz-border-secondary maz-bg-secondary/5 maz-text-secondary;
    }

    &.--pastel {
      @apply maz-border-secondary-100 maz-bg-secondary-100 maz-text-secondary;
    }
  }

  &.--destructive {
    @apply maz-border-destructive maz-bg-destructive maz-text-destructive-foreground;

    &.--outline {
      @apply maz-border-destructive maz-bg-destructive/5 maz-text-destructive;
    }

    &.--pastel {
      @apply maz-border-destructive-100 maz-bg-destructive-100 maz-text-destructive;
    }
  }

  &.--warning {
    @apply maz-border-warning maz-bg-warning maz-text-warning-foreground;

    &.--outline {
      @apply maz-border-warning maz-bg-warning/5 maz-text-warning;
    }

    &.--pastel {
      @apply maz-border-warning-100 maz-bg-warning-100 maz-text-warning;
    }
  }

  &.--success {
    @apply maz-border-success maz-bg-success maz-text-success-foreground;

    &.--outline {
      @apply maz-border-success maz-bg-success/5 maz-text-success;
    }

    &.--pastel {
      @apply maz-border-success-100 maz-bg-success-100 maz-text-success;
    }
  }

  &.--contrast {
    @apply maz-border-contrast maz-bg-contrast maz-text-contrast-foreground;

    &.--outline {
      @apply maz-border-contrast maz-bg-contrast/5 maz-text-contrast;
    }

    &.--pastel {
      @apply maz-bg-contrast-100 maz-border-contrast-100 maz-text-contrast;
    }
  }

  &.--accent {
    @apply maz-border-accent maz-bg-accent maz-text-accent-foreground;

    &.--outline {
      @apply maz-border-accent maz-bg-accent/5 maz-text-accent;
    }

    &.--pastel {
      @apply maz-border-accent-100 maz-bg-accent-100 maz-text-accent;
    }
  }
}
</style>
