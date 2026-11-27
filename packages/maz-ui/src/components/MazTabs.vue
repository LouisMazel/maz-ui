<script lang="ts" setup>
import type { Ref } from 'vue'
import type { MazColor, MazRoundedSize, MazSize } from './types.ts'
import { computed, provide, ref, toRef } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'

export type MazTabsOrientation = 'horizontal' | 'vertical'

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
  /**
   * Direction of the tabs. `vertical` puts the bar on the side of the content, a column of sections like a settings page (arrows up and down move between tabs)
   * @values `'horizontal' | 'vertical'`
   * @default 'horizontal'
   */
  orientation?: MazTabsOrientation
}

const { modelValue, size, roundedSize, color, orientation = 'horizontal' } = defineProps<MazTabsProps>()

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
  orientation: Ref<MazTabsOrientation>
  /**
   * Prefix of the ids linking each tab to its panel (`aria-controls` / `aria-labelledby`)
   */
  idPrefix?: Ref<string>
}

const idPrefix = useInstanceUniqId({ componentName: 'MazTabs' })

provide<MazTabsProvide>('maz-tabs', {
  currentTab,
  updateCurrentTab,
  idPrefix,
  size: toRef(() => size),
  roundedSize: toRef(() => roundedSize),
  color: toRef(() => color),
  orientation: toRef(() => orientation),
})
</script>

<template>
  <div
    class="m-tabs m-reset-css"
    :class="{ '--vertical maz:flex maz:items-start maz:gap-4': orientation === 'vertical' }"
  >
    <slot />
  </div>
</template>
