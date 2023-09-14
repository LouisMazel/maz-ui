<template>
  <div class="m-tabs">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue'
  import { computed, provide, ref } from 'vue'

  const props = defineProps({
    modelValue: { type: Number, default: undefined },
  })

  const emits = defineEmits(['update:model-value'])

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
