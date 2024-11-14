<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import XIcon from './../icons/x-mark.svg'
import MazBackdrop from './MazBackdrop.vue'

defineProps<{
  /** @model Modal's model value */
  modelValue?: boolean
  /** Remove the close button */
  noClose?: boolean
  /** Remove the padding on the container */
  noPadding?: boolean
}>()

const emits = defineEmits(['update:model-value', 'open', 'close'])

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
</script>

<template>
  <MazBackdrop
    :model-value="modelValue"
    transition-name="bottom-sheet-anim"
    backdrop-class="--bottom-sheet"
    :content-padding="false"
    align="end"
    justify="none"
    variant="bottom-sheet"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="emits('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div
        class="m-bottom-sheet__container"
        :class="{
          '--no-padding': noPadding,
        }"
      >
        <!--
          @slot  Slot content
          @binding {Function} close close function
        -->
        <slot :close="close" />

        <MazBtn
          v-if="!noClose"
          size="sm"
          class="m-bottom-sheet__close"
          color="transparent"
          @click="close"
        >
          <XIcon class="maz-text-lg" />
        </MazBtn>
      </div>
    </template>
  </MazBackdrop>
</template>

<style lang="postcss" scoped>
.m-bottom-sheet {
  &__container {
    @apply maz-relative maz-bg-color maz-text-normal maz-elevation maz-w-full maz-px-12 maz-rounded-t-2xl;

    &:not(.--no-padding) {
      @apply maz-py-6;
    }

    box-shadow: 0 -5px 20px hsl(0deg 0% 0% / 20%);
  }

  &__content-wrapper {
    @apply maz-flex maz-flex-col maz-flex-center;
  }

  &__close {
    @apply !maz-absolute;
    @apply maz-right-2 maz-top-2;
  }
}
</style>
