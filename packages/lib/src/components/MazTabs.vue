<script lang="ts" setup>
import type { Ref } from 'vue'
import type { MazColor, MazRoundedSize, MazSize } from './types'
import { computed, provide, ref, toRef } from 'vue'

export interface MazTabsProps {
  /** The the selected tab number */
  modelValue?: number
  /**
   * Size of the tabs, forwarded to MazTabsBar (and each tab button)
   * @values `'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'mini'`
   */
  size?: MazSize
  /**
   * Size of the rounded, forwarded to MazTabsBar
   * @values `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'`
   */
  roundedSize?: MazRoundedSize
  /**
   * Color of the active tab indicator, forwarded to MazTabsBar
   * @values `'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'destructive' | 'contrast'`
   */
  color?: MazColor
}

const { modelValue, size, roundedSize, color } = defineProps<MazTabsProps>()

const emits = defineEmits<{
  /**
   * Emitted when the selected tab change
   * @property {number} newValue new value set
   */
  'update:model-value': [value: number]
}>()

const localValue = ref(1)

const currentTab = computed({
  get: () => modelValue ?? localValue.value,
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
  size: Ref<MazSize | undefined>
  roundedSize: Ref<MazRoundedSize | undefined>
  color: Ref<MazColor | undefined>
}

provide<MazTabsProvide>('maz-tabs', {
  currentTab,
  updateCurrentTab,
  size: toRef(() => size),
  roundedSize: toRef(() => roundedSize),
  color: toRef(() => color),
})
</script>

<template>
  <div class="m-tabs m-reset-css">
    <slot />
  </div>
</template>
