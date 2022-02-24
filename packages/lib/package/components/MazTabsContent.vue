<template>
  <div
    ref="MazTabsContent"
    class="m-tabs-content maz-relative"
    :class="{ 'maz-overflow-hidden': hideOverflow }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref, watch } from 'vue'
  import { debounce } from './../utils/debounce'

  const props = defineProps({
    activeTab: { type: Number, default: undefined },
  })

  const MazTabsContent = ref()
  const currentTab = ref<number>()

  const hideOverflow = ref(false)

  const setOverflowHiddenTemp = () => {
    hideOverflow.value = true
    allowOverFlow()
  }

  const allowOverFlow = debounce(function () {
    hideOverflow.value = false
  }, 700)

  onBeforeMount(() => {
    currentTab.value = 1
  })

  watch(
    () => [props.activeTab, currentTab.value],
    (values) => {
      setOverflowHiddenTemp()
      if (values[0]) currentTab.value = values[0]
    },
    { immediate: true },
  )
</script>
