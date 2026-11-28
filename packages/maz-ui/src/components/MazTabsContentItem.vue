<script lang="ts" setup>
import type { MazTabsProvide } from './MazTabs.vue'
import { computed, ref, watch } from 'vue'
import { useInjectStrict } from '../composables/useInjectStrict.ts'

const props = defineProps({
  tab: { type: Number, required: true },
})
const isForward = ref(true)

const { currentTab, idPrefix, orientation } = useInjectStrict<MazTabsProvide>('maz-tabs')

const panelId = computed(() => idPrefix
  ? `${idPrefix.value}-panel-${props.tab}`
  : undefined)
const tabId = computed(() => idPrefix
  ? `${idPrefix.value}-tab-${props.tab}`
  : undefined)

watch(
  () => currentTab.value,
  (value, oldValue) => {
    if (typeof value === 'number' && typeof oldValue === 'number') {
      isForward.value = oldValue < value
    }
  },
  { immediate: true },
)

const transitionName = computed(() => {
  const base = orientation?.value === 'vertical'
    ? 'maz-tab-vertical'
    : 'maz-tab'

  return isForward.value
    ? `${base}-transition`
    : `${base}-reverse-transition`
})

const itemTabNumber = computed(() => props.tab - 1)

const isCurrentTab = computed(() => currentTab.value - 1 === itemTabNumber.value)
</script>

<template>
  <Transition :name="transitionName">
    <div
      v-if="isCurrentTab"
      :id="panelId"
      role="tabpanel"
      :aria-labelledby="tabId"
      tabindex="0"
      class="m-tabs-content-item m-reset-css maz:relative maz:top-0 maz:w-full"
    >
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
/*
 * The panel comes from the side of its tab with a short offset and a fade, and leaves toward the other side
 * (`--maz-tab-offset` changes the distance). The sides follow the reading direction.
 */
.m-tabs-content-item {
  --maz-tab-dx: 1;
  --maz-tab-offset: 1.5rem;

  flex: 1 0 auto;

  &:dir(rtl) {
    --maz-tab-dx: -1;
  }
}

.maz-tab-transition-enter-active,
.maz-tab-reverse-transition-enter-active,
.maz-tab-vertical-transition-enter-active,
.maz-tab-vertical-reverse-transition-enter-active {
  transition:
    transform calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    opacity calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.maz-tab-transition-leave-active,
.maz-tab-reverse-transition-leave-active,
.maz-tab-vertical-transition-leave-active,
.maz-tab-vertical-reverse-transition-leave-active {
  position: absolute !important;
  inset-block-start: 0;
  transition:
    transform calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in),
    opacity calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1)) var(--maz-easing-in, ease-in);
}

.maz-tab-transition-enter-from,
.maz-tab-reverse-transition-leave-to {
  opacity: 0;
  transform: translate(calc(var(--maz-tab-offset) * var(--maz-tab-dx)), 0);
}

.maz-tab-transition-leave-to,
.maz-tab-reverse-transition-enter-from {
  opacity: 0;
  transform: translate(calc(var(--maz-tab-offset) * var(--maz-tab-dx) * -1), 0);
}

.maz-tab-vertical-transition-enter-from,
.maz-tab-vertical-reverse-transition-leave-to {
  opacity: 0;
  transform: translate(0, var(--maz-tab-offset));
}

.maz-tab-vertical-transition-leave-to,
.maz-tab-vertical-reverse-transition-enter-from {
  opacity: 0;
  transform: translate(0, calc(var(--maz-tab-offset) * -1));
}
</style>
