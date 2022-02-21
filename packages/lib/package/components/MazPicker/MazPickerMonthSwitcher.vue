<template>
  <div class="maz-picker-month-switcher">
    <div class="maz-picker-month-switcher__header">
      <MazBtn
        size="mini"
        color="transparent"
        type="button"
        @click.stop="$emit('close', $event)"
      >
        <MazIcon :src="XIcon" size="1.2rem" />
      </MazBtn>
    </div>
    <div
      class="maz-picker-month-switcher__main"
      :class="{ '--has-double': double }"
    >
      <MazBtn
        v-for="month in months"
        :key="month.label"
        :size="props.double ? 'sm' : 'xs'"
        :color="isSameMonth(month.date, currentDate) ? color : 'transparent'"
        type="button"
        @click.stop="selectMonth(month.date)"
      >
        {{ month.label }}
      </MazBtn>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { date } from './../../filters'
  import { computed, PropType } from 'vue'
  import { Color } from '../types'
  import { cloneDate, isSameMonth } from '../MazPicker/utils'
  import MazBtn from '../MazBtn.vue'
  import XIcon from './../../icons/x.svg'
  import MazIcon from '../MazIcon.vue'

  const props = defineProps({
    color: { type: String as PropType<Color>, required: true },
    locale: { type: String, required: true },
    currentDate: { type: Date, required: true },
    double: { type: Boolean, required: true },
  })

  const emits = defineEmits(['update:current-date', 'close'])

  const months = computed<
    {
      label: string
      date: Date
    }[]
  >(() =>
    Array.from({ length: 12 }, (_v, i) => i).map((monthNumber) => {
      const clonedDate = cloneDate(props.currentDate)

      if (props.double) {
        return {
          label: `${date(clonedDate.setMonth(monthNumber), props.locale, {
            month: 'short',
          })} - ${date(
            clonedDate.setMonth(clonedDate.getMonth() + 1),
            props.locale,
            {
              month: 'short',
            },
          )}`,
          date: new Date(clonedDate.setMonth(monthNumber)),
        }
      } else {
        return {
          label: date(clonedDate.setMonth(monthNumber), props.locale, {
            month: 'long',
          }),
          date: new Date(clonedDate.setMonth(monthNumber)),
        }
      }
    }),
  )

  const selectMonth = (date: Date) => {
    emits('update:current-date', date)
    emits('close')
  }
</script>

<style lang="postcss" scoped>
  .maz-picker-month-switcher {
    @apply maz-absolute maz-inset-0 maz-z-1 maz-flex maz-flex-col maz-bg-color;

    &__header {
      @apply maz-flex maz-justify-end maz-border-b maz-border-color-lighter maz-p-2;
    }

    &__main {
      @apply maz-grid maz-flex-1 maz-grid-cols-2 maz-gap-2 maz-overflow-y-auto maz-p-2 maz-flex-center;

      &.--has-double {
        @apply maz-grid-cols-3;
      }
    }
  }

  html.dark {
    & .maz-picker-month-switcher {
      @apply maz-bg-color-light;
    }
  }
</style>
