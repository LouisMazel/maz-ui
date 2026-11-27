<script lang="ts" setup>
import type { MazTabsProvide } from './MazTabs.vue'
import { debounce } from '@maz-ui/utils/helpers/debounce'
import { ref, watch } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict.ts'

const hideOverflow = ref(false)

const { currentTab, orientation } = useInjectStrict<MazTabsProvide>('maz-tabs')

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
  <div
    class="m-tabs-content m-reset-css maz:relative"
    :class="{ 'maz:overflow-hidden': hideOverflow, 'maz:min-w-0 maz:flex-1': orientation === 'vertical' }"
  >
    <slot />
  </div>
</template>
