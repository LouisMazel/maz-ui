<script lang="ts" setup>
import type { MazTabsProvide } from './MazTabs.vue'
import { debounce } from '@maz-ui/utils/src/utils/debounce.js'
import { ref, watch } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict'

const hideOverflow = ref(false)

const { currentTab } = useInjectStrict<MazTabsProvide>('maz-tabs')

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
