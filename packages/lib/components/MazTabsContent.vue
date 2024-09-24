<script lang="ts" setup>
import type { MazTabsProvide } from './MazTabs.vue'
import { ref, watch } from 'vue'
import { debounce } from '../modules/helpers/debounce'
import { injectStrict } from '../modules/helpers/inject-strict'

const hideOverflow = ref(false)

const { currentTab } = injectStrict<MazTabsProvide>('maz-tabs')

const allowOverFlow = debounce(() => {
  hideOverflow.value = false
}, 700)

function setOverflowHiddenTemp() {
  hideOverflow.value = true
  allowOverFlow()
}

watch(
  () => currentTab.value,
  () => setOverflowHiddenTemp(),
  { immediate: true },
)
</script>

<template>
  <div class="m-tabs-content maz-relative" :class="{ 'maz-overflow-hidden': hideOverflow }">
    <slot />
  </div>
</template>
