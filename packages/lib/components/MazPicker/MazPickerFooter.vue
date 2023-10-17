<template>
  <div class="maz-picker-footer">
    <MazBtn size="xs" :color="color" type="button" @click.stop="$emit('close')">
      <CheckIcon class="icon maz-text-lg" />
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import { defineAsyncComponent, type PropType } from 'vue'
  import type { Color } from '../types'

  const MazBtn = defineAsyncComponent(() => import('./../MazBtn.vue'))
  const CheckIcon = defineAsyncComponent(() => import('./../../icons/check.svg'))

  defineProps({
    color: { type: String as PropType<Color>, required: true },
  })

  defineEmits(['close'])
</script>

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
