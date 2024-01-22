<template>
  <div class="m-tabs">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { computed, provide, ref, type Ref } from 'vue'

  export type Props = {
    /** The the selected tab number */
    modelValue?: number
  }

  const props = defineProps<Props>()

  const emits = defineEmits<{
    /**
     * Emitted when the selected tab change
     * @property {number} newValue new value set
     */
    (event: 'update:model-value', index: number): void
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

  export type MazTabsProvide = {
    currentTab: Ref<number>
    updateCurrentTab: (index: number) => number
  }

  provide<MazTabsProvide>('maz-tabs', {
    currentTab,
    updateCurrentTab,
  })
</script>
