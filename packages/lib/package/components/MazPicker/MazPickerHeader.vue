<template>
  <div class="m-picker-header maz-flex maz-flex-col" :class="[`--${color}`]">
    <span class="m-picker-header__year">{{ year }}</span>
    <span class="m-picker-header__date">{{ dateString }}</span>
  </div>
</template>

<script lang="ts" setup>
  import { date, capitalize } from './../../filters'
  import { computed } from 'vue'

  const props = defineProps({
    color: { type: String, required: true },
    date: { type: String, default: undefined },
    locale: { type: String, required: true },
  })

  const year = computed(() =>
    props.date ? date(props.date, props.locale, { year: 'numeric' }) : '-',
  )
  const dateString = computed(() =>
    props.date
      ? capitalize(
          date(props.date, props.locale, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          }),
        )
      : '-',
  )
</script>

<style lang="postcss" scoped>
  .m-picker-header {
    @apply maz-py-2 maz-px-4;

    & .m-picker-header__year {
      @apply maz-text-sm;
    }

    &.--primary {
      @apply maz-bg-primary maz-text-primary-contrast;

      & .m-picker-header__year {
        @apply maz-text-primary-100;
      }
    }

    &.--secondary {
      @apply maz-bg-secondary maz-text-secondary-contrast;

      & .m-picker-header__year {
        @apply maz-text-secondary-100;
      }
    }

    &.--info {
      @apply maz-bg-info maz-text-info-contrast;

      & .m-picker-header__year {
        @apply maz-text-info-100;
      }
    }

    &.--success {
      @apply maz-bg-success maz-text-success-contrast;

      & .m-picker-header__year {
        @apply maz-text-success-100;
      }
    }

    &.--warning {
      @apply maz-bg-warning maz-text-warning-contrast;

      & .m-picker-header__year {
        @apply maz-text-warning-100;
      }
    }

    &.--danger {
      @apply maz-bg-danger maz-text-danger-contrast;

      & .m-picker-header__year {
        @apply maz-text-danger-100;
      }
    }

    &.--black {
      @apply maz-bg-black maz-text-black-contrast;

      & .m-picker-header__year {
        @apply maz-text-muted;
      }
    }

    &.--white {
      @apply maz-bg-white maz-text-white-contrast;

      & .m-picker-header__year {
        @apply maz-text-muted;
      }
    }

    &.--transparent {
      @apply maz-border-b maz-border-color-light maz-text-normal-text;
    }
  }
</style>
