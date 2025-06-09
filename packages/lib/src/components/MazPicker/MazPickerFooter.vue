<script lang="ts" setup>
import type { MazColor } from '../types'

import MazCheckIcon from '@maz-ui/icons/svg/check.svg'
import MazBtn from '../MazBtn.vue'

defineProps<{
  color: MazColor
}>()

defineEmits(['close'])
</script>

<template>
  <div class="maz-picker-footer">
    <MazBtn size="xs" :color type="button" @click.stop="$emit('close')">
      <MazCheckIcon class="icon maz-text-lg" />
    </MazBtn>
  </div>
</template>

<style lang="postcss" scoped>
  .maz-picker-footer {
  @apply maz-flex maz-justify-end maz-space-x-1 maz-border-t maz-border-divider maz-bg-surface maz-p-2;

  & .icon {
    @apply maz-mx-2;
  }
}

html.dark .maz-picker-footer {
  @apply maz-bg-surface-400;
}
</style>
