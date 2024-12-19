<script lang="ts" setup>
import type { Color } from '../types'

import CheckIcon from '../../../icons/check.svg'
import MazBtn from '../MazBtn.vue'

defineProps<{
  color: Color
}>()

defineEmits(['close'])
</script>

<template>
  <div class="maz-picker-footer">
    <MazBtn size="xs" :color type="button" @click.stop="$emit('close')">
      <CheckIcon class="icon maz-text-lg" />
    </MazBtn>
  </div>
</template>

<style lang="postcss" scoped>
  .maz-picker-footer {
  @apply maz-flex maz-justify-end maz-space-x-1 maz-border-t maz-border-color-lighter maz-bg-color maz-p-2;

  & .icon {
    @apply maz-mx-2;
  }
}

html.dark .maz-picker-footer {
  @apply maz-bg-color-light;
}
</style>
