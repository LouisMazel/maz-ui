<template>
  <div
    ref="MazTabsContent"
    class="maz-tabs-content maz-relative"
    :class="{ 'maz-overflow-hidden': hideOverflow }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, onBeforeMount, ref, watch } from 'vue'
  import { debounce } from './../utils/debounce'

  const instance = getCurrentInstance()

  const props = defineProps({
    activeTab: { type: Number, default: undefined },
  })

  const MazTabsContent = ref()
  const currentTab = ref<number>()

  const hideOverflow = ref(false)

  // const parent = computed(() => instance?.parent)
  console.log('instance MazTabsContent', instance)
  // console.log('instance.parent', parent.value)

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
      console.log('watch currentTab.value', currentTab.value)
      setOverflowHiddenTemp()
      if (values[0]) currentTab.value = values[0]
    },
    { immediate: true },
  )
</script>
