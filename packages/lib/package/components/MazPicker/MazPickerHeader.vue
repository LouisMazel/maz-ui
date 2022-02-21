<template>
  <div class="m-picker-header" :class="[`--${color}`]">
    <TransitionGroup
      :name="transitionName"
      tag="div"
      class="m-picker-header__year-transition"
    >
      <span
        v-for="(y, yi) in yearArray"
        :key="`${y}-${yi}`"
        class="m-picker-header__year"
      >
        {{ y }}
      </span>
    </TransitionGroup>
    <TransitionGroup
      :name="transitionName"
      tag="div"
      class="m-picker-header__date-transition"
    >
      <span
        v-for="(d, di) in dateStringArray"
        :key="`${d}-${di}`"
        class="m-picker-header__date"
      >
        {{ d }}
      </span>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType, ref, watch } from 'vue'
  import { Color } from '../types'
  import { date, capitalize } from './../../filters'
  import { cloneDate, isBigger } from './utils'

  const props = defineProps({
    modelValue: { type: String, default: undefined },
    color: { type: String as PropType<Color>, required: true },
    locale: { type: String, required: true },
  })

  const currentDateTmp = ref<Date>(
    cloneDate(props.modelValue ? new Date(props.modelValue) : new Date()),
  )
  const transitionName = ref<'maz-slidevnext' | 'maz-slidevprev'>(
    'maz-slidevnext',
  )

  const year = computed(() =>
    props.modelValue
      ? date(props.modelValue, props.locale, { year: 'numeric' })
      : '-',
  )

  const yearArray = computed(() => [year.value])

  const dateString = computed(() =>
    props.modelValue
      ? capitalize(
          date(props.modelValue, props.locale, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          }),
        )
      : '-',
  )

  const dateStringArray = computed(() => [dateString.value])

  watch(
    () => props.modelValue,
    (date) => {
      if (date) {
        transitionName.value = isBigger(currentDateTmp.value, new Date(date))
          ? 'maz-slidevprev'
          : 'maz-slidevnext'
        currentDateTmp.value = cloneDate(new Date(date))
      }
    },
  )
</script>

<style lang="postcss" scoped>
  .m-picker-header {
    @apply maz-z-1 maz-flex maz-flex-col maz-space-y-1 maz-p-2;

    &__year-transition {
      @apply maz-flex maz-h-5 maz-items-center maz-overflow-hidden maz-leading-3;
    }

    &__date-transition {
      @apply maz-flex maz-h-6 maz-items-center maz-overflow-hidden maz-leading-4;
    }

    &__year {
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
