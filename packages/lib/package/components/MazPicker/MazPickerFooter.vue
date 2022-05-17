<template>
  <div class="maz-picker-footer">
    <MazBtn
      size="mini"
      :color="color"
      type="button"
      @click.stop="$emit('close')"
    >
      <MazIcon :src="CheckIcon" size="1.4rem" class="icon" />
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from 'vue'
  import MazBtn from '../MazBtn.vue'
  import type { Color } from '../types'
  import MazIcon from '../MazIcon.vue'
  import CheckIcon from '@package/icons/check.svg'

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
