<template>
  <MazBackdrop
    v-bind="$attrs"
    transition-name="modal-anim"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div class="m-dialog-layout">
        <div
          class="m-dialog-layout-header"
          :class="{ '--has-title': $slots['title'] || title }"
        >
          <h2
            v-if="$slots['title'] || title"
            class="maz-my-0 maz-text-xl maz-font-semibold"
          >
            <slot name="title">{{ title }}</slot>
          </h2>

          <MazBtn
            v-if="!noClose"
            size="sm"
            class="m-dialog-layout-closebtn"
            color="transparent"
            @click="close"
          >
            <MazIcon :src="XIcon" class="maz-h-5 maz-w-5" />
          </MazBtn>
        </div>
        <div class="m-dialog-layout-content">
          <slot :close="close" />
        </div>
        <div v-if="$slots['footer']" class="m-dialog-layout-footer">
          <slot name="footer" :close="close"></slot>
        </div>
      </div>
    </template>
  </MazBackdrop>
</template>

<script lang="ts" setup>
  import MazBtn from './MazBtn.vue'
  import MazBackdrop from './MazBackdrop.vue'
  import MazIcon from './MazIcon.vue'
  import XIcon from '@package/icons/x.svg'

  defineProps({
    title: { type: String, default: undefined },
    noClose: { type: Boolean, default: false },
  })

  defineEmits(['update:model-value', 'close', 'open'])
</script>

<style lang="postcss" scoped>
  .m-dialog-layout {
    @apply maz-rounded maz-bg-color maz-text-normal;

    width: 500px;
    max-width: 95vw;

    &-header {
      @apply maz-flex maz-items-center maz-justify-end maz-pt-2 maz-pl-6 maz-pr-2;

      &.--has-title {
        @apply maz-justify-between;
      }
    }

    &-footer {
      @apply maz-flex maz-items-center maz-justify-end maz-px-6 maz-pb-4;
    }

    &-content {
      @apply maz-p-6;

      &-icon {
        flex: 0 0 auto;
      }
    }

    &-closebtn {
      @apply maz-p-2 !important;
    }
  }
</style>
