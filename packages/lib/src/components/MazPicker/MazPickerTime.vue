<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { PropType } from 'vue'
import type { Color } from '../types'
import type { MazPickerValue } from './types'
import type { DateTimeFormatOptions } from './utils'
import dayjs from 'dayjs'
import { computed, nextTick, ref, watch } from 'vue'

import MazBtn from '../MazBtn.vue'
import { findNearestNumberInList, scrollToTarget } from './utils'

type ColumnIdentifier = 'hour' | 'minute' | 'ampm'

const props = defineProps({
  modelValue: {
    type: [String, Object] as PropType<MazPickerValue>,
    default: undefined,
  },
  calendarDate: { type: String, required: true },
  formatterOptions: {
    type: Object as PropType<DateTimeFormatOptions>,
    required: true,
  },
  locale: { type: String, required: true },
  color: { type: String as PropType<Color>, required: true },
  isOpen: { type: Boolean, required: true },
  hasDate: { type: Boolean, required: true },
  minuteInterval: { type: Number, required: true },
  disabledHours: { type: Array as PropType<number[]>, default: undefined },
  format: { type: String, required: true },
  isHour12: { type: Boolean, required: true },
  minDate: { type: String, default: undefined },
  maxDate: { type: String, default: undefined },
  disabled: { type: Boolean, required: true },
})

const emits = defineEmits(['update:model-value'])

const currentDate = computed({
  get: () => props.modelValue as string,
  set: (value) => {
    emits('update:model-value', value)
  },
})

const hours = computed(() => {
  return Array.from({ length: props.isHour12 ? 12 : 24 }, (_v, i) => i).map((hour) => {
    const hourBase = hour + (props.isHour12 ? 1 : 0)
    const hour12or24 = getHour12or24(hourBase)
    const hourValue = dayjs(currentDate.value).set('hour', hour12or24)

    const isDisabled
        = isDisableHour(hour12or24)
          || (props.minDate && currentDate.value
            ? dayjs(props.minDate).isAfter(hourValue, 'hour')
            : false)
          || (props.maxDate && currentDate.value
            ? dayjs(props.maxDate).isBefore(hourValue, 'hour')
            : false)

    return {
      label: `${hourBase < 10 ? '0' : ''}${hourBase}`,
      value: dayjs(currentDate.value).set('hour', hour12or24),
      isDisabled,
    }
  })
})

const minutes = computed(() => {
  const length = Math.floor(60 / props.minuteInterval) - 0

  return Array.from({ length }, (_v, i) => i * props.minuteInterval).map((minute) => {
    const minuteValue = dayjs(currentDate.value).set('minute', minute)

    const isDisabled
        = (props.minDate && currentDate.value
          ? dayjs(props.minDate).isAfter(minuteValue, 'minute')
          : false)
        || (props.maxDate && currentDate.value
          ? dayjs(props.maxDate).isBefore(minuteValue, 'minute')
          : false)

    return {
      label: `${minute < 10 ? '0' : ''}${minute}`,
      value: minuteValue,
      isDisabled,
    }
  })
})

const currentHour = computed(() => {
  return typeof currentDate.value === 'string'
    ? findNearestHour(dayjs(currentDate.value).get('hour'))
    : undefined
})

const currentMinute = computed(() =>
  typeof currentDate.value === 'string'
    ? findNearestNumberInList(
        minutes.value.map(({ value }) => value.get('minute')),
        dayjs(currentDate.value).get('minute'),
      )
    : undefined,
)

const currentAmpm = computed(() => {
  return typeof currentHour.value === 'number'
    ? currentHour.value >= 12
      ? 'pm'
      : 'am'
    : undefined
})

const ampm = computed<{ label: string, value: 'am' | 'pm' }[]>(() =>
  props.isHour12
    ? [
        { label: 'AM', value: 'am' },
        { label: 'PM', value: 'pm' },
      ]
    : [],
)

type TimeValue = Dayjs | 'am' | 'pm'

const columns = computed(() => {
  const columns: {
    identifier: ColumnIdentifier
    values: {
      label: string
      value: TimeValue
      isDisabled?: boolean
    }[]
  }[] = [
    {
      identifier: 'hour',
      values: hours.value,
    },
    {
      identifier: 'minute',
      values: minutes.value,
    },
  ]

  if (props.isHour12) {
    columns.push({
      identifier: 'ampm',
      values: ampm.value,
    })
  }

  return columns
})

function findNearestHour(hour: number) {
  if (!props.disabledHours) {
    return hour
  }

  const hourList = Array.from({ length: 24 }, (_v, i) => i).filter(
    hour => !props.disabledHours?.includes(hour) || true,
  )

  const nearHour = findNearestNumberInList(hourList, hour)

  if (nearHour !== hour) {
    selectTime('hour', dayjs(currentDate.value).set('hour', nearHour))
  }

  return nearHour
}

const MazPickerTime = ref<HTMLDivElement>()
const dividerHeight = ref<number>()

function getHour12or24(hourValue: number) {
  if (props.isHour12) {
    const isPm = currentAmpm.value === 'pm'
    const newValue = isPm ? hourValue + 12 : hourValue
    return newValue === 12 ? 0 : newValue === 24 ? 12 : newValue
  }
  else {
    return hourValue
  }
}

watch(
  () => props.isOpen,
  async (value) => {
    if (value) {
      await nextTick()

      if (MazPickerTime.value) {
        const item = MazPickerTime.value.querySelector(
          `.m-picker-time__column .m-btn`,
        ) as HTMLButtonElement
        const itemHeight = item?.offsetHeight
        const timePickerHeight = MazPickerTime.value?.offsetHeight

        const divHeight = timePickerHeight / 2 - itemHeight / 2

        dividerHeight.value = divHeight / 16
      }

      scrollColumns(false)
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  async (value, oldValue) => {
    if (value !== oldValue) {
      await nextTick()
      scrollColumns(true)
    }
  },
  { immediate: true },
)

function scrollColumns(hasSmoothEffect: boolean) {
  scrollColumn('hour', hasSmoothEffect)
  scrollColumn('minute', hasSmoothEffect)
  if (props.isHour12) {
    scrollColumn('ampm', hasSmoothEffect)
  }
}

function isDisableHour(value: number): boolean {
  return (props.disabledHours && props.disabledHours.includes(value)) ?? false
}

function isSelected(identifier: ColumnIdentifier, value: Dayjs | 'am' | 'pm'): boolean {
  if (value === 'am' || value === 'pm') {
    return currentAmpm.value === value
  }
  else if (identifier === 'hour') {
    return currentHour.value === value.get(identifier)
  }
  else if (identifier === 'minute') {
    return currentMinute.value === value.get(identifier)
  }
  return false
}

async function scrollColumn(identifier: ColumnIdentifier, hasSmoothEffect = true) {
  if (MazPickerTime.value) {
    const column = MazPickerTime.value.querySelector(`.m-picker-time__column__${identifier}`) as
      | HTMLDivElement
      | undefined

    const selectedButton = MazPickerTime.value.querySelector(
      `.m-picker-time__column__${identifier} .--is-selected`,
    ) as HTMLButtonElement | undefined

    if (dividerHeight.value && column && selectedButton && MazPickerTime.value) {
      await nextTick()
      scrollToTarget(column, selectedButton, dividerHeight.value * 16, hasSmoothEffect)
    }
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
async function selectTime(identifier: ColumnIdentifier, value: TimeValue) {
  const newDate = dayjs(currentDate.value)

  if (identifier === 'hour' && typeof value === 'object') {
    currentDate.value = newDate.set('hour', value.get('hour')).format()
  }

  if (identifier === 'minute' && typeof value === 'object') {
    const dateWithNewMinute = newDate.set('minute', value.get('minute'))

    currentDate.value = dateWithNewMinute.format()
  }

  if (identifier === 'ampm' && (currentAmpm.value !== value || !currentHour.value)) {
    if (value === 'am') {
      currentDate.value = newDate.set('hour', newDate.get('hour')).subtract(12, 'hour').format()
    }
    if (value === 'pm') {
      const baseHour = newDate.get('hour')

      const newHour
          = baseHour + 12 > 12 && baseHour + 12 < 24 ? baseHour + 12 : baseHour === 0 ? 12 : baseHour

      currentDate.value = newDate.set('hour', newHour).format()
    }
  }

  await nextTick()

  scrollColumn(identifier)
}
</script>

<template>
  <div ref="MazPickerTime" class="m-picker-time" :class="{ '--has-date': hasDate }">
    <div
      v-for="({ values, identifier }, i) in columns"
      :key="i"
      class="m-picker-time__column"
      :class="[`m-picker-time__column__${identifier}`]"
    >
      <div :style="{ height: `${dividerHeight}rem` }" class="m-picker-time__column__divider" />
      <div class="m-picker-time__column__items">
        <MazBtn
          v-for="({ value, label, isDisabled }, unitIndex) in values"
          :key="unitIndex"
          size="xs"
          :color="isSelected(identifier, value) ? color : 'transparent'"
          :class="{ '--is-selected': isSelected(identifier, value) }"
          :disabled="isDisabled || disabled"
          type="button"
          @click.stop="selectTime(identifier, value)"
        >
          {{ label }}
        </MazBtn>
      </div>
      <div :style="{ height: `${dividerHeight}rem` }" class="m-picker-time__column__divider" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.m-picker-time {
  @apply maz-relative maz-flex;

  max-height: 18.75rem;

  &:not(.--has-date) {
    max-height: 10rem;
  }

  &.--has-date {
    @apply maz-border-l maz-border-color-lighter;
  }

  &::before {
    content: '';
    transform: translateY(-50%);

    @apply maz-absolute maz-left-0 maz-right-0 maz-top-1/2
        maz-mx-auto maz-h-9 maz-border-b maz-border-t maz-border-color-lighter;
  }

  &__column {
    @apply maz-flex maz-flex-col maz-overflow-y-auto maz-px-1;

    /* Hide scrollbar for webkit browsers (Chrome, Safari, Edge) */
    &::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for Firefox */
    scrollbar-width: none;

    /* Hide scrollbar for IE and Edge legacy */
    -ms-overflow-style: none;

    &__items {
      @apply maz-flex maz-flex-col maz-space-y-1;

      > button {
        @apply maz-z-2 maz-flex-none;
      }
    }

    &__divider {
      @apply maz-w-full maz-flex-none;
    }
  }
}
</style>
