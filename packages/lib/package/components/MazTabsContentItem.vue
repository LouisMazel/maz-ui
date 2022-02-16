<template>
  <Transition :name="transitionName" tag="div">
    <div
      v-show="isCurrentTab"
      ref="MazTabsContentItem"
      class="maz-tabs-content-item"
    >
      <slot />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue'

  const currentTab = ref()

  const transitionName = ref<string>('maz-tab-transition')
  const MazTabsContentItem = ref()

  const props = defineProps({
    tab: { type: Number, required: true },
  })

  watch(
    () => currentTab.value,
    async (value, oldValue) => {
      if (typeof value === 'number' && typeof oldValue === 'number') {
        const newTabIsBigger = oldValue < value
        transitionName.value = newTabIsBigger
          ? 'maz-tab-transition'
          : 'maz-tab-reverse-transition'
      }
    },
    { immediate: true },
  )

  const itemTabNumber = computed(() => {
    return props.tab - 1
  })

  const isCurrentTab = computed(() => {
    return currentTab.value === itemTabNumber.value
  })
</script>

<style lang="postcss" scoped>
  .maz-tabs-content-item {
    @apply maz-relative maz-top-0 maz-w-full;

    flex: 1 0 auto;
    transition: all 500ms cubic-bezier(0.25, 0.8, 0.5, 1);
  }
</style>
