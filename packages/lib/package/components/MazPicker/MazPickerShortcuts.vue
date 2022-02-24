<template>
  <div class="maz-picker-shortcuts">
    <MazBtn
      v-for="{ identifier, label, value } in shortcuts"
      :key="identifier"
      type="button"
      size="sm"
      :color="identifier === selectedShortcut ? props.color : 'transparent'"
      :class="{ '--is-selected': identifier === selectedShortcut }"
      @click.stop="selectShortcut(value, identifier)"
    >
      {{ label }}
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, ref, watch } from 'vue'
  import MazBtn from '../MazBtn.vue'
  import { Color } from '../types'
  import { PickerShortcut, PickerValue, RangeValue } from './types'

  const props = defineProps({
    color: { type: String as PropType<Color>, required: true },
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    shortcuts: {
      type: Array as PropType<PickerShortcut[]>,
      required: true,
    },
    currentDate: { type: Date, required: true },
    double: { type: Boolean, required: true },
  })

  const emits = defineEmits(['update:model-value', 'update:current-date'])

  const selectedShortcut = ref<string>()

  watch(
    () => props.modelValue,
    (value) => {
      const values = value as RangeValue
      if (!values?.end) {
        selectedShortcut.value = undefined
      }
    },
  )

  const selectShortcut = (
    value: PickerShortcut['value'],
    identifier: PickerShortcut['identifier'],
  ) => {
    selectedShortcut.value = identifier
    emits('update:model-value', value)
    emits('update:current-date', new Date(value.end))
  }
</script>

<style lang="postcss" scoped>
  .maz-picker-shortcuts {
    @apply maz-flex maz-flex-col maz-items-start maz-gap-1 maz-overflow-y-auto maz-border-r maz-border-color-lighter maz-p-2;

    max-height: 18.75rem;

    & > button {
      &:not(.--is-selected) {
        @apply maz-border maz-border-color-lighter !important;
      }

      @apply maz-w-full maz-flex-none;
    }
  }
</style>
