<script lang="ts" setup>
import type { MazColor } from '../types'
import type { MazDatePickerRangeValue, MazDatePickerShortcut, MazDatePickerValue } from './types'
import { ref, watch } from 'vue'

import MazBtn from '../MazBtn.vue'

const props = defineProps<{
  color: MazColor
  modelValue: MazDatePickerValue
  shortcuts: MazDatePickerShortcut[] | false
  double: boolean
  shortcut: MazDatePickerShortcut['identifier'] | undefined
  disabled: boolean
}>()

const emits = defineEmits(['update:model-value'])

const selectedShortcut = ref<MazDatePickerShortcut['identifier'] | undefined>(props.shortcut)

function selectShortcut(value: MazDatePickerShortcut['value'], identifier: MazDatePickerShortcut['identifier']) {
  selectedShortcut.value = identifier
  emits('update:model-value', value)
}

watch(
  () => props.modelValue,
  (value) => {
    const values = value as MazDatePickerRangeValue
    if (!values?.end) {
      selectedShortcut.value = undefined
    }
  },
)

watch(
  () => props.shortcut,
  (shortcut) => {
    const newShortcut = props.shortcuts && props.shortcuts.find(({ identifier }) => shortcut === identifier)
    if (newShortcut) {
      const { value, identifier } = newShortcut
      selectShortcut(value, identifier)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="maz-picker-shortcuts">
    <MazBtn
      v-for="{ identifier, label, value } in shortcuts"
      :key="identifier"
      type="button"
      size="sm"
      :disabled
      :color="identifier === selectedShortcut ? props.color : 'transparent'"
      :class="{ '--is-selected': identifier === selectedShortcut }"
      @click.stop="selectShortcut(value, identifier)"
    >
      {{ label }}
    </MazBtn>
  </div>
</template>

<style lang="postcss" scoped>
.maz-picker-shortcuts {
  @apply maz-flex maz-flex-col maz-items-start maz-gap-1 maz-overflow-y-auto maz-border-r maz-border-divider maz-p-2;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
  max-height: 18.75rem;

  & > button {
    @apply maz-w-full maz-flex-none maz-truncate;
    @apply maz-text-xs !important;

    &:not(.--is-selected) {
      @apply maz-border maz-border-divider !important;
    }
  }
}
</style>
