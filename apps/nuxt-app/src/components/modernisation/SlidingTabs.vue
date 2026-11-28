<script lang="ts" setup>
const { stretch = false } = defineProps<{ stretch?: boolean }>()

const tabs = ['Overview', 'Activity', 'Settings', 'Billing']
const selected = ref(0)
const container = useTemplateRef<HTMLElement>('container')
const tabElements = useTemplateRef<HTMLElement[]>('tabElements')
const activeTab = computed(() => tabElements.value?.[selected.value])

const { style } = useSlidingIndicator({ container, active: activeTab, stretch })
</script>

<template>
  <!-- maz-ui-review-ignore prefer-maz-component -- demo of useSlidingIndicator on a hand-made tab list -->
  <div ref="container" role="tablist" class="relative inline-flex gap-1 rounded-xl bg-divider/40 p-0">
    <span
      aria-hidden="true"
      class="absolute start-0 top-0 rounded-xl bg-primary"
      :style="style"
    />
    <!-- maz-ui-review-ignore prefer-maz-component -- demo of useSlidingIndicator -->
    <button
      v-for="(tab, index) in tabs"
      :key="tab"
      ref="tabElements"
      type="button"
      role="tab"
      :aria-selected="selected === index"
      class="focus-ring relative z-10 rounded-xl px-4 py-2 transition-colors"
      :class="selected === index ? 'text-primary-foreground' : 'text-foreground'"
      @click="selected = index"
    >
      {{ tab }}
    </button>
  </div>
</template>
