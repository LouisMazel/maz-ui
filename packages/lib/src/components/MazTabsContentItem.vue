<script lang="ts" setup>
import type { MazTabsProvide } from './MazTabs.vue'
import { computed, ref, watch } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict'

const props = defineProps({
  tab: { type: Number, required: true },
})
const transitionName = ref<string>('maz-tab-transition')

const { currentTab } = useInjectStrict<MazTabsProvide>('maz-tabs')

watch(
  () => currentTab.value,
  (value, oldValue) => {
    if (typeof value === 'number' && typeof oldValue === 'number') {
      const newTabIsBigger = oldValue < value
      transitionName.value = newTabIsBigger ? 'maz-tab-transition' : 'maz-tab-reverse-transition'
    }
  },
  { immediate: true },
)

const itemTabNumber = computed(() => props.tab - 1)

const isCurrentTab = computed(() => currentTab.value - 1 === itemTabNumber.value)
</script>

<template>
  <Transition :name="transitionName">
    <div v-if="isCurrentTab" class="m-tabs-content-item m-reset-css">
      <slot />
    </div>
  </Transition>
</template>

<style lang="postcss" scoped>
  .m-tabs-content-item {
  @apply maz-relative maz-top-0 maz-w-full;

  flex: 1 0 auto;
  transition: all 500ms cubic-bezier(0.25, 0.8, 0.5, 1);
}
</style>
