<template>
  <div class="m-tabs-content maz-relative" :class="{ 'maz-overflow-hidden': hideOverflow }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { debounce } from '../modules/helpers/debounce'
  import { injectStrict } from '../modules/helpers/inject-strict'
  import type { MazTabsProvide } from './MazTabs.vue'

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
    () => setOverflowHiddenTemp(),
    { immediate: true },
  )
</script>
