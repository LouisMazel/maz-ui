<template>
  <div class="maz-picker-year-switcher">
    <div class="maz-picker-year-switcher__header">
      <div class="maz-flex maz-space-x-2">
        <MazBtn
          size="mini"
          color="transparent"
          type="button"
          @click.stop="previousYears"
        >
          <MazIcon :src="ChevronLeftIcon" size="1.2rem" />
        </MazBtn>
        <MazBtn
          size="mini"
          color="transparent"
          type="button"
          @click.stop="nextYears"
        >
          <MazIcon :src="ChevronRightIcon" size="1.2rem" />
        </MazBtn>
      </div>
      <MazBtn
        size="mini"
        color="transparent"
        type="button"
        @click.stop="$emit('close', $event)"
      >
        <MazIcon :src="XIcon" size="1.2rem" />
      </MazBtn>
    </div>
    <div class="maz-picker-year-switcher__main">
      <MazBtn
        v-for="year in years"
        :key="year.label"
        size="sm"
        type="button"
        :class="{ '--is-selected': isSameYear(year.date, currentDate) }"
        :color="isSameYear(year.date, currentDate) ? color : 'transparent'"
        @click.stop="selectMonth(year.date)"
      >
        {{ year.label }}
      </MazBtn>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { date } from '../../filters'
  import { computed, PropType, ref } from 'vue'
  import { Color } from '../types'
  import MazBtn from '../MazBtn.vue'
  import XIcon from './../../icons/x.svg'
  import MazIcon from '../MazIcon.vue'
  import { isSameYear, cloneDate } from './utils'
  import ChevronLeftIcon from './../../icons/chevron-left.svg'
  import ChevronRightIcon from './../../icons/chevron-right.svg'

  const props = defineProps({
    color: { type: String as PropType<Color>, required: true },
    locale: { type: String, required: true },
    currentDate: { type: Date, required: true },
  })

  const emits = defineEmits(['update:current-date', 'close'])

  const clonedCurrentDate = ref(cloneDate(props.currentDate))

  const years = computed<
    {
      label: string
      date: Date
    }[]
  >(() => {
    return Array.from({ length: 15 }, (_v, i) => i - 7).map((yearNumber) => {
      const monthClonedDate = cloneDate(clonedCurrentDate.value)

      const dateMonth = new Date(
        monthClonedDate.setFullYear(monthClonedDate.getFullYear() + yearNumber),
      )

      return {
        label: date(dateMonth, props.locale, {
          year: 'numeric',
        }),
        date: dateMonth,
      }
    })
  })

  const selectMonth = (date: Date) => {
    emits('update:current-date', date)
    emits('close')
  }

  const previousYears = () => {
    clonedCurrentDate.value = new Date(
      clonedCurrentDate.value.setFullYear(
        clonedCurrentDate.value.getFullYear() - 7,
      ),
    )
  }
  const nextYears = () => {
    clonedCurrentDate.value = new Date(
      clonedCurrentDate.value.setFullYear(
        clonedCurrentDate.value.getFullYear() + 7,
      ),
    )
  }
</script>

<style lang="postcss" scoped>
  .maz-picker-year-switcher {
    @apply maz-absolute maz-inset-0 maz-z-1 maz-flex maz-flex-col maz-bg-color;

    &__header {
      @apply maz-flex maz-justify-between maz-space-x-2 maz-border-b maz-border-color-lighter maz-p-2;
    }

    &__main {
      @apply maz-grid maz-flex-1 maz-grid-cols-3 maz-gap-2 maz-overflow-y-auto maz-p-2 maz-flex-center;
    }
  }

  html.dark {
    & .maz-picker-year-switcher {
      @apply maz-bg-color-light;
    }
  }
</style>
