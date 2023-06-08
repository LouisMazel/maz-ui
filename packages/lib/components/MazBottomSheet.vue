<template>
  <MazBackdrop
    v-bind="$attrs"
    transition-name="bottom-sheet-anim"
    backdrop-class="--bottom-sheet"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="emits('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div
        class="m-bottom-sheet__container"
        :class="{
          'maz-py-6': !noPadding,
        }"
      >
        <!-- Slot content -->
        <slot :close="close">
          <div class="m-bottom-sheet__content-wrapper">
            <p>Default content</p>
          </div>
        </slot>

        <MazBtn
          v-if="!noClose"
          size="sm"
          class="m-bottom-sheet__close"
          color="transparent"
          @click="close"
        >
          <MazIcon :src="XIcon" class="maz-h-5 maz-w-5" />
        </MazBtn>
      </div>
    </template>
  </MazBackdrop>
</template>

<script lang="ts" setup>
  import MazBtn from './MazBtn.vue'
  import MazBackdrop from './MazBackdrop.vue'
  import MazIcon from './MazIcon.vue'
  import XIcon from './../modules/icons/x.svg'

  defineProps({
    noClose: { type: Boolean, default: false },
    noPadding: { type: Boolean, default: false },
  })

  const emits = defineEmits(['update:model-value', 'open', 'close'])
</script>

<style lang="postcss" scoped>
  .m-bottom-sheet {
    &__container {
      @apply maz-relative maz-bg-color maz-text-normal maz-elevation;

      padding-left: 3rem;
      padding-right: 3rem;
      box-shadow: 0 -5px 20px hsl(0deg 0% 0% / 20%);
    }

    &__content-wrapper {
      @apply maz-flex maz-flex-col maz-flex-center;
    }

    &__close {
      @apply maz-absolute !important;
      @apply maz-right-4 maz-top-4;
    }
  }
</style>
