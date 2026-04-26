<script lang="ts" setup>
import { MazXMark } from '@maz-ui/icons/static/MazXMark'
import MazBackdrop from './MazBackdrop.vue'
import MazBtn from './MazBtn.vue'

export interface MazBottomSheetProps {
  /** @model Modal's model value */
  modelValue?: boolean
  /** Remove the close button */
  hideCloseButton?: boolean
  /** Remove the padding on the container */
  padding?: boolean
}

const { padding = true, hideCloseButton = false } = defineProps<MazBottomSheetProps>()

const emits = defineEmits<{
  /** Emitted when the model value is updated */
  'update:model-value': [value: boolean]
  /** Emitted when the component is opened */
  'open': [value: void]
  /** Emitted when the component is closed */
  'close': [value: void]
}>()
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
        class="m-bottom-sheet__container maz:relative maz:bg-surface maz:text-foreground maz:drop-shadow-md maz:shadow-elevation maz:w-full maz:px-12 maz:rounded-t-2xl"
        :class="{
          '--padding': padding,
          'maz:py-6': padding,
        }"
      >
        <!--
          @slot  Slot content
          @binding {Function} close close function
        -->
        <slot :close="close" />

        <MazBtn
          v-if="!hideCloseButton"
          size="sm"
          class="m-bottom-sheet__close maz:absolute! maz:inset-e-2 maz:top-2"
          color="transparent"
          @click="close"
        >
          <MazXMark class="maz:text-lg" />
        </MazBtn>
      </div>
    </template>
  </MazBackdrop>
</template>

<style scoped>
.m-bottom-sheet__container {
  box-shadow: 0 -5px 20px hsl(0deg 0% 0% / 20%);
}
</style>
