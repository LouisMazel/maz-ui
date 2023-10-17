<template>
  <div class="maz-picker-shortcuts">
    <MazBtn
      v-for="{ identifier, label, value } in shortcuts"
      :key="identifier"
      type="button"
      size="sm"
      :disabled="disabled"
      :color="identifier === selectedShortcut ? props.color : 'transparent'"
      :class="{ '--is-selected': identifier === selectedShortcut }"
      @click.stop="selectShortcut(value, identifier)"
    >
      {{ label }}
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import { type PropType, ref, watch } from 'vue'
  import type { Color } from '../types'
  import type { PickerShortcut, PickerValue, RangeValue } from './types'

  import MazBtn from './../MazBtn.vue'

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
    double: { type: Boolean, required: true },
    shortcut: { type: String, default: undefined },
    disabled: { type: Boolean, required: true },
  })

  const emits = defineEmits(['update:model-value'])

  const selectedShortcut = ref(props.shortcut)

  const selectShortcut = (
    value: PickerShortcut['value'],
    identifier: PickerShortcut['identifier'],
  ) => {
    selectedShortcut.value = identifier
    emits('update:model-value', value)
  }

  watch(
    () => props.modelValue,
    (value) => {
      const values = value as RangeValue
      if (!values?.end) {
        selectedShortcut.value = undefined
      }
    },
  )

  watch(
    () => props.shortcut,
    (shortcut) => {
      const newShortcut = props.shortcuts.find(({ identifier }) => shortcut === identifier)
      if (newShortcut) {
        const { value, identifier } = newShortcut
        selectShortcut(value, identifier)
      }
    },
    { immediate: true },
  )
</script>

<style lang="postcss" scoped>
  .maz-picker-shortcuts {
    @apply maz-flex maz-flex-col maz-items-start maz-gap-1
      maz-overflow-y-auto maz-border-r maz-border-color-lighter maz-p-2;

    max-height: 18.75rem;

    & > button {
      @apply maz-w-full maz-flex-none maz-truncate;
      @apply maz-text-xs !important;

      &:not(.--is-selected) {
        @apply maz-border maz-border-color-lighter !important;
      }
    }
  }
</style>
