<template>
  <div
    ref="MazTabsContent"
    class="m-tabs-content maz-relative"
    :class="{ 'maz-overflow-hidden': hideOverflow }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { debounce, injectStrict } from '../modules'
  import type { MazTabsProvide } from './MazTabs.vue'

  const MazTabsContent = ref()

  const hideOverflow = ref(false)

  const { currentTab } = injectStrict<MazTabsProvide>('maz-tabs')

  const setOverflowHiddenTemp = () => {
    hideOverflow.value = true
    allowOverFlow()
  }

  const allowOverFlow = debounce(function () {
    hideOverflow.value = false
  }, 700)

  watch(
    () => currentTab.value,
    (value) => {
      setOverflowHiddenTemp()
      if (typeof value === 'number') currentTab.value = value
    },
    { immediate: true },
  )
</script>
