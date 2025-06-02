<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, provide, ref } from 'vue'

export interface MazTabsProps {
  /** The the selected tab number */
  modelValue?: number
}

const props = defineProps<MazTabsProps>()

const emits = defineEmits<{
  /**
   * Emitted when the selected tab change
   * @property {number} newValue new value set
   */
  'update:model-value': [value: number]
}>()

const localValue = ref(1)

const currentTab = computed({
  get: () => props.modelValue ?? localValue.value,
  set: (index: number) => {
    localValue.value = index
    emits('update:model-value', index)
  },
})

function updateCurrentTab(index: number) {
  currentTab.value = index

  return index
}

export interface MazTabsProvide {
  currentTab: Ref<number>
  updateCurrentTab: (index: number) => number
}

provide<MazTabsProvide>('maz-tabs', {
  currentTab,
  updateCurrentTab,
})
</script>

<template>
  <div class="m-tabs m-reset-css">
    <slot />
  </div>
</template>
