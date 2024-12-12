<script lang="ts" setup>
import type { MazTabsProvide } from '@components/MazTabs.vue'
import { debounce } from '@helpers/debounce'
import { injectStrict } from '@helpers/injectStrict'
import { ref, watch } from 'vue'

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
  <div class="m-tabs-content m-reset-css maz-relative" :class="{ 'maz-overflow-hidden': hideOverflow }">
    <slot />
  </div>
</template>
