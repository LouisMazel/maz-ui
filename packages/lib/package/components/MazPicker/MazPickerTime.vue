<template>
  <div
    ref="MazPickerTime"
    class="m-picker-time"
    :class="{ '--has-date': hasDate }"
  >
    <div
      v-for="({ values, currentValue, identifier }, i) in columns"
      :key="i"
      class="m-picker-time__column"
      :class="[`m-picker-time__column__${identifier}`]"
    >
      <div
        :style="{ height: `${dividerHeight}rem` }"
        class="m-picker-time__column__divider"
      ></div>
      <div class="m-picker-time__column__items">
        <MazBtn
          v-for="({ value, label, disabled }, unitIndex) in values"
          :key="unitIndex"
          size="xs"
          :color="currentValue === value ? color : 'transparent'"
          :class="{ '--is-selected': currentValue === value }"
          :disabled="disabled"
          type="button"
          @click.stop="selectTime(identifier, value)"
        >
          {{ label }}
        </MazBtn>
      </div>
      <div
        :style="{ height: `${dividerHeight}rem` }"
        class="m-picker-time__column__divider"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, type PropType, ref, watch } from 'vue'
  import {
    type DateTimeFormatOptions,
    scrollToTarget,
    findNearestNumberInList,
    // getCurrentDateForTimeValue,
    getTimeString,
  } from './utils'
  import MazBtn from '../MazBtn.vue'
  import type { PickerValue } from './types'
  import type { Color } from '../types'
  import dayjs, { Dayjs } from 'dayjs'

  type ColumnIdentifier = 'hour' | 'minute' | 'ampm'

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
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
  })

  const findNearestHour = (hour: number) => {
    if (!props.disabledHours) {
      return hour
    }

    const hourList = Array.from({ length: 24 }, (_v, i) => i).filter(
      (hour) => !props.disabledHours?.includes(hour) ?? true,
    )

    const nearHour = findNearestNumberInList(hourList, hour)

    selectTime('hour', nearHour)

    return nearHour
  }

  const emits = defineEmits(['update:model-value'])

  const MazPickerTime = ref<HTMLDivElement>()
  const dividerHeight = ref<number>()

  const isHour12 = computed(
    () => props.format.includes('a') || props.format.includes('A'),
  )

  const currentHour = computed(() => {
    if (typeof currentDate.value === 'string') {
      return findNearestHour(dayjs(currentDate.value).get('hour'))
    } else {
      return undefined
    }
  })

  const currentMinute = computed(() =>
    typeof currentDate.value === 'string'
      ? findNearestNumberInList(
          minutes.value.map(({ value }) => value),
          dayjs(currentDate.value).get('minute'),
        )
      : undefined,
  )

  const getHourValue = (hourValue: number) => {
    if (isHour12.value) {
      const isPm = currentAmpm.value === 'pm'
      const newValue = isPm ? hourValue + 12 : hourValue
      return newValue === 12 ? 0 : newValue === 24 ? 12 : newValue
    } else {
      return hourValue
    }
  }

  const hours = computed(() => {
    return Array.from({ length: isHour12.value ? 12 : 24 }, (_v, i) => i).map(
      (hour) => {
        const hourBase = hour + (isHour12.value ? 1 : 0)
        const hourValue = getHourValue(hourBase)
        return {
          label: `${hourBase < 10 ? '0' : ''}${hourBase}`,
          value: hourValue,
          base: hour,
          disabled: isDisableHour(hourValue),
        }
      },
    )
  })

  const minutes = computed(() => {
    const length = Math.floor(60 / props.minuteInterval) - 0

    return Array.from({ length }, (_v, i) => i * props.minuteInterval).map(
      (minute) => ({
        label: `${minute < 10 ? '0' : ''}${minute}`,
        value: minute,
        disabled: false,
      }),
    )
  })

  const currentAmpm = computed(() => {
    return typeof currentHour.value === 'number'
      ? currentHour.value >= 12
        ? 'pm'
        : 'am'
      : undefined
  })

  const ampm = computed<{ label: string; value: 'am' | 'pm' }[]>(() =>
    isHour12.value
      ? [
          { label: 'AM', value: 'am' },
          { label: 'PM', value: 'pm' },
        ]
      : [],
  )

  const columns = computed(() => {
    const columns: {
      identifier: ColumnIdentifier
      values: {
        label: string
        value: number | 'am' | 'pm'
        disabled?: boolean
      }[]
      currentValue: number | string | undefined
    }[] = [
      {
        identifier: 'hour',
        values: hours.value,
        currentValue: currentHour.value,
      },
      {
        identifier: 'minute',
        values: minutes.value,
        currentValue: currentMinute.value,
      },
    ]

    if (isHour12.value) {
      columns.push({
        identifier: 'ampm',
        values: ampm.value,
        currentValue: currentAmpm.value,
      })
    }

    return columns
  })

  const currentDate = computed({
    get: () => props.modelValue as string,
    set: (value) => {
      emits('update:model-value', value)
    },
  })

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

        scrollColumns()
      }
    },
    { immediate: true },
  )

  watch(
    () => props.modelValue,
    async (value) => {
      if (value) {
        await nextTick()
        scrollColumns()

        currentDate.value = props.hasDate
          ? dayjs(currentDate.value).format()
          : getTimeString(`${currentHour.value}:${currentMinute.value}`)
      }
    },
    { immediate: true },
  )

  const scrollColumns = () => {
    scrollColumn('hour')
    scrollColumn('minute')
    if (isHour12.value) {
      scrollColumn('ampm')
    }
  }

  const isDisableHour = (value: number): boolean => {
    return (props.disabledHours && props.disabledHours.includes(value)) ?? false
  }

  const scrollColumn = async (identifier: ColumnIdentifier) => {
    if (MazPickerTime.value) {
      const column = MazPickerTime.value.querySelector(
        `.m-picker-time__column__${identifier}`,
      ) as HTMLDivElement | undefined

      const selectedButton = MazPickerTime.value.querySelector(
        `.m-picker-time__column__${identifier} .--is-selected`,
      ) as HTMLButtonElement | undefined

      if (
        dividerHeight.value &&
        column &&
        selectedButton &&
        MazPickerTime.value
      ) {
        await nextTick()
        scrollToTarget(column, selectedButton, dividerHeight.value * 16)
      }
    }
  }

  const selectTime = async (
    identifier: ColumnIdentifier,
    value: number | 'am' | 'pm',
  ) => {
    const newDate = dayjs(currentDate.value)

    const getDateTimeValue = (date: Dayjs) => {
      return props.hasDate ? date.format() : getTimeString(date)
    }

    if (identifier === 'hour' && typeof value === 'number') {
      const dateWithNewHour = newDate.set('hour', value)
      currentDate.value = getDateTimeValue(dateWithNewHour)
    }

    if (identifier === 'minute' && typeof value === 'number') {
      const dateWithNewMinute = newDate.set('minute', value)

      currentDate.value = getDateTimeValue(dateWithNewMinute)
    }

    if (identifier === 'ampm' && typeof value === 'string') {
      if (currentAmpm.value !== value || !currentHour.value) {
        if (value === 'am') {
          const dateWithNewHour = newDate
            .set('hour', newDate.get('hour'))
            .subtract(12, 'hour')

          currentDate.value = getDateTimeValue(dateWithNewHour)
        }
        if (value === 'pm') {
          const baseHour = newDate.get('hour')
          const newHour =
            baseHour + 12 > 12 && baseHour + 12 < 24
              ? baseHour + 12
              : baseHour === 0
              ? 12
              : baseHour

          const dateWithNewHour = newDate.set('hour', newHour)
          currentDate.value = getDateTimeValue(dateWithNewHour)
        }
      }
    }

    await nextTick()

    scrollColumn(identifier)
  }
</script>

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
        maz-mx-auto maz-h-9 maz-border-t maz-border-b maz-border-color-lighter;
    }

    &__column {
      @apply maz-flex maz-flex-col maz-overflow-y-scroll maz-px-1;

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
