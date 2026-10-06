<script lang="ts">
export interface MazTableVirtualWindow {
  /** Indexes of the rows currently inside the viewport (plus overscan). */
  indexes: number[]
  /** Height in pixels of the top spacer row (rows scrolled above the viewport). */
  paddingTop: number
  /** Height in pixels of the bottom spacer row (rows below the viewport). */
  paddingBottom: number
}
</script>

<script lang="ts" setup>
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, watch } from 'vue'

/**
 * Renderless provider that drives row virtualization for MazTable. It is loaded
 * on demand (via `defineAsyncComponent`) so `@tanstack/vue-virtual` only ships
 * to pages that actually virtualize a table. It renders nothing and pushes the
 * visible window back to the parent through the `change` event.
 */
const {
  count,
  scrollElement = null,
  estimateSize = 44,
  overscan = 10,
} = defineProps<{
  /** Total number of rows to virtualize. */
  count: number
  /** Scrollable viewport element the virtualizer observes. */
  scrollElement?: HTMLElement | null
  /** Fixed per-row height used to place rows and size the spacers. */
  estimateSize?: number
  /** Rows rendered outside the viewport on each side. */
  overscan?: number
}>()

const emit = defineEmits<{
  change: [window: MazTableVirtualWindow]
}>()

const virtualizer = useVirtualizer(computed(() => ({
  count,
  getScrollElement: () => scrollElement,
  estimateSize: () => estimateSize,
  overscan,
})))

const virtualWindow = computed<MazTableVirtualWindow>(() => {
  const items = virtualizer.value.getVirtualItems()
  return {
    indexes: items.map(item => item.index),
    paddingTop: items[0]?.start ?? 0,
    paddingBottom: items.length ? virtualizer.value.getTotalSize() - items[items.length - 1].end : 0,
  }
})

watch(virtualWindow, value => emit('change', value), { immediate: true })
</script>

<template>
  <!-- Renderless: drives virtualization and pushes its window via `change`. -->
  <slot />
</template>
