<script lang="ts" setup>
export interface MazListSeparatorProps {
  /**
   * Title of the group of items that follows (use the default slot for rich content)
   */
  title?: string
}

defineProps<MazListSeparatorProps>()

defineSlots<{
  /** Replace the title */
  default: () => unknown
}>()
</script>

<template>
  <div class="m-list-separator m-reset-css maz:px-3 maz:pt-3 maz:pb-1 maz:text-caption maz:font-medium" role="listitem">
    <!-- @slot default - Replace the title -->
    <slot>{{ title }}</slot>
  </div>
</template>
