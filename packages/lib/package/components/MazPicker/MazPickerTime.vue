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
          v-for="({ value, label }, unitIndex) in values"
          :key="unitIndex"
          size="xs"
          :color="currentValue === value ? color : 'transparent'"
          :class="{ '--is-selected': currentValue === value }"
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
  import { computed, nextTick, PropType, ref, watch } from 'vue'
  import {
    DateTimeFormatOptions,
    scrollToTarget,
    findNearestNumberInList,
    getCurrentDateForTimeValue,
    getTimeString,
    // convertHour24to12Format,
  } from './utils'
  import MazBtn from '../MazBtn.vue'
  import { PickerValue } from './types'
  import { Color } from '../types'

  type ColumnIdentifier = 'hour' | 'minute' | 'ampm'

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    currentDate: { type: Date, required: true },
    formatterOptions: {
      type: Object as PropType<DateTimeFormatOptions>,
      required: true,
    },
    locale: { type: String, required: true },
    color: { type: String as PropType<Color>, required: true },
    isOpen: { type: Boolean, required: true },
    hasDate: { type: Boolean, required: true },
    minuteInterval: { type: Number, required: true },
  })

  // const findHour = (hour: number) =>
  //   findNearestNumberInList(
  //     hours.value.map(({ value }) => value),
  //     isHour12.value ? convertHour24to12Format(hour) : hour,
  //   )

  const emits = defineEmits(['update:model-value'])

  const MazPickerTime = ref<HTMLDivElement>()
  const dividerHeight = ref<number>()

  const isHour12 = computed(() => props.formatterOptions.hour12)

  const currentHour = computed(() => {
    if (typeof modelValue.value === 'string') {
      let baseHour = new Date(
        props.hasDate
          ? modelValue.value
          : getCurrentDateForTimeValue(modelValue.value),
      ).getHours()

      return baseHour
    } else {
      return undefined
    }
  })
  const currentMinute = computed(() =>
    typeof modelValue.value === 'string'
      ? findNearestNumberInList(
          minutes.value.map(({ value }) => value),
          new Date(
            props.hasDate
              ? modelValue.value
              : getCurrentDateForTimeValue(modelValue.value),
          ).getMinutes(),
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
        const hourValue = hour + (isHour12.value ? 1 : 0)
        return {
          label: `${hourValue < 10 ? '0' : ''}${hourValue}`,
          value: getHourValue(hourValue),
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

  const modelValue = computed({
    get: () => props.modelValue,
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
          const item = document.querySelector(
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
        // TODO
        modelValue.value = props.hasDate
          ? (modelValue.value
              ? new Date(modelValue.value as string)
              : new Date()
            ).toISOString()
          : getTimeString(`${currentHour.value}:${currentMinute.value}:00`)
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

  const scrollColumn = async (identifier: ColumnIdentifier) => {
    const column = document.querySelector(
      `.m-picker-time__column__${identifier}`,
    ) as HTMLDivElement | undefined

    const selectedButton = document.querySelector(
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

  const selectTime = async (
    identifier: ColumnIdentifier,
    value: number | 'am' | 'pm',
  ) => {
    const newDate = modelValue.value
      ? props.hasDate
        ? new Date(modelValue.value as string)
        : getCurrentDateForTimeValue(modelValue.value as string)
      : new Date()

    const getDateTimeValue = (date: Date) => {
      return props.hasDate ? date.toISOString() : getTimeString(date)
    }

    if (identifier === 'hour' && typeof value === 'number') {
      const dateWithNewHour = new Date(newDate.setHours(value))
      modelValue.value = getDateTimeValue(dateWithNewHour)
    }
    if (identifier === 'minute' && typeof value === 'number') {
      const dateWithNewHour = new Date(newDate.setMinutes(value))

      modelValue.value = getDateTimeValue(dateWithNewHour)
    }
    if (identifier === 'ampm' && typeof value === 'string') {
      if (currentAmpm.value !== value || !currentHour.value) {
        if (value === 'am') {
          const dateWithNewHour = new Date(
            newDate.setHours(newDate.getHours() - 12),
          )
          modelValue.value = getDateTimeValue(dateWithNewHour)
        }
        if (value === 'pm') {
          const baseHour = newDate.getHours()
          const newHour =
            baseHour + 12 > 12 && baseHour + 12 < 24
              ? baseHour + 12
              : baseHour === 0
              ? 12
              : baseHour

          const dateWithNewHour = new Date(newDate.setHours(newHour))
          modelValue.value = getDateTimeValue(dateWithNewHour)
        }
      }
      // currentAmpm.value =
      // const newDate = currentValue ? new Date(currentValue) : new Date()
      // modelValue.value = new Date(newDate.setMinutes(value)).toISOString()
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

      @apply maz-absolute maz-left-0 maz-right-0 maz-top-1/2 maz-mx-auto maz-h-9 maz-border-t maz-border-b maz-border-color-lighter;
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
