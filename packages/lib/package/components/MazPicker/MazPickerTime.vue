<template>
  <div ref="MazPickerTime" class="m-picker-time">
    <div
      v-for="({ values, currentValue, identifier }, i) in columns"
      :key="i"
      class="m-picker-time__column"
      :class="[`m-picker-time__column__${identifier}`]"
    >
      <div
        :style="{ height: dividerHeight }"
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
        :style="{ height: dividerHeight }"
        class="m-picker-time__column__divider"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, PropType, ref, watch } from 'vue'
  import { DateTimeFormatOptions, scrollSmoothElement } from './utils'
  import MazBtn from '../MazBtn.vue'
  import { PickerValue, SimpleValue } from './types'
  import { Color } from '../types'

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    formatterOptions: {
      type: Object as PropType<DateTimeFormatOptions>,
      required: true,
    },
    locale: { type: String, required: true },
    color: { type: String as PropType<Color>, required: true },
    isOpen: { type: Boolean, required: true },
    minuteInterval: { type: Number, default: 5 },
  })

  const emits = defineEmits(['update:model-value'])

  const MazPickerTime = ref<HTMLDivElement>()
  const dividerHeight = ref<string>()

  const isHour12 = computed(() => props.formatterOptions.hour12)

  const currentHour = computed(() =>
    typeof modelValue.value === 'string'
      ? new Date(modelValue.value).getHours()
      : undefined,
  )
  const currentMinute = computed(() =>
    typeof modelValue.value === 'string'
      ? new Date(modelValue.value).getMinutes()
      : undefined,
  )

  const hours = computed(() => {
    return Array.from({ length: isHour12.value ? 12 : 24 }, (_v, i) => i).map(
      (hour) => {
        const hourLabelValue = hour + (isHour12.value ? 1 : 0)
        return {
          label: `${hourLabelValue < 10 ? '0' : ''}${hourLabelValue}`,
          value: hour,
        }
      },
    )
  })

  const minutes = computed(() => {
    const length = Math.floor(60 / props.minuteInterval) - 0

    return Array.from({ length }, (_v, i) => i * props.minuteInterval).map(
      (hour) => ({
        label: `${hour < 10 ? '0' : ''}${hour}`,
        value: hour,
      }),
    )
  })

  const columns = computed<
    {
      identifier: 'hour' | 'minute'
      currentValue?: number
      values: {
        label: string
        value: number
      }[]
    }[]
  >(() => [
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
  ])

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  watch(
    () => props.isOpen,
    async () => {
      await nextTick()
      if (MazPickerTime.value) {
        const item = document.querySelector(
          `.m-picker-time__column .m-btn`,
        ) as HTMLButtonElement
        const itemHeight = item?.offsetHeight
        const timePickerHeight = MazPickerTime.value?.offsetHeight

        const divHeight = timePickerHeight / 2 - itemHeight / 2

        dividerHeight.value = `${divHeight / 16}rem`
      }
    },
    { immediate: true },
  )

  const scrollColumn = async (identifier: 'hour' | 'minute') => {
    const column = document.querySelector(
      `.m-picker-time__column__${identifier}`,
    ) as HTMLDivElement | undefined

    const selectedButton = document.querySelector(
      `.m-picker-time__column__${identifier} .--is-selected`,
    ) as HTMLButtonElement | undefined

    if (column && selectedButton) {
      await nextTick()
      scrollSmoothElement(column, selectedButton)
    }
  }

  const selectTime = (identifier: 'hour' | 'minute', value: number) => {
    const currentValue = modelValue.value as SimpleValue
    if (identifier === 'hour') {
      const newDate = currentValue ? new Date(currentValue) : new Date()
      modelValue.value = new Date(newDate.setHours(value)).toISOString()
    }
    if (identifier === 'minute') {
      const newDate = currentValue ? new Date(currentValue) : new Date()
      modelValue.value = new Date(newDate.setMinutes(value)).toISOString()
    }

    scrollColumn(identifier)
  }
</script>

<style lang="postcss" scoped>
  .m-picker-time {
    @apply maz-relative maz-flex maz-border-l maz-border-color-lighter;

    &::before {
      content: '';
      transform: translateY(-50%);

      @apply maz-absolute maz-left-0 maz-right-0 maz-top-1/2 maz-mx-auto maz-h-9 maz-border-t maz-border-b maz-border-color-lighter;
    }

    max-height: 18.75rem;

    &__column {
      @apply maz-flex maz-flex-col maz-overflow-y-scroll maz-px-1;

      &__items {
        @apply maz-flex maz-flex-col;

        & > button {
          @apply maz-z-2 maz-flex-none;
        }
      }

      &__divider {
        @apply maz-w-full maz-flex-none;
      }
    }
  }
</style>
