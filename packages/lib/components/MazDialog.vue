<template>
  <MazBackdrop
    v-bind="backdropAttrs"
    transition-name="modal-anim"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div
        class="m-dialog"
        :style="[{ width, maxWidth, maxHeight }]"
        :class="{ '--scrollable': scrollable }"
        v-bind="wrapperAttrs"
      >
        <!--
          @slot Header slot
            @binding {Function} close close function
        -->
        <slot name="header" :close="close">
          <div class="m-dialog-header" :class="{ '--has-title': $slots['title'] || title }">
            <h2 v-if="$slots['title'] || title" class="maz-my-0 maz-text-xl maz-font-semibold">
              <!--
                @slot Title slot in the header
              -->
              <slot name="title">{{ title }}</slot>
            </h2>

            <MazBtn
              v-if="!noClose"
              size="sm"
              class="m-dialog-closebtn"
              color="transparent"
              @click="close"
            >
              <MazIcon :src="XIcon" class="maz-h-5 maz-w-5" />
            </MazBtn>
          </div>
        </slot>
        <div class="m-dialog-content">
          <!--
            @slot Default content
              @binding {Function} close close function
          -->
          <slot :close="close"></slot>
        </div>
        <div v-if="$slots['footer']" class="m-dialog-footer">
          <!--
            @slot Footer slot
              @binding {Function} close close function
          -->
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
  import XIcon from './../modules/icons/x.svg'
  import type { StyleValue } from 'vue'
  import { computed, useAttrs } from 'vue'
  import type { HTMLAttributes } from 'vue'

  defineProps({
    /** Modal's title in  header */
    title: { type: String, default: undefined },
    /** Remove the close button in header */
    noClose: { type: Boolean, default: false },
    /** Modal's width */
    width: { type: String, default: '500px' },
    /** Modal's max-width */
    maxWidth: { type: String, default: '95vw' },
    /** Modal's max-height */
    maxHeight: { type: String, default: '95vh' },
    /**  Modal's content becomes scrollable - warning: a overflow is applied */
    scrollable: { type: Boolean, default: false },
  })

  defineEmits([
    /** Model binding */
    'update:model-value',
    /** Emitted when dialog is closed (after animation) */
    'close',
    /** Emitted when dialog is opened (after animation) */
    'open',
  ])

  const attrs = useAttrs()

  const backdropAttrs = computed(() => ({
    ...attrs,
    class: undefined,
    style: undefined,
  }))
  const wrapperAttrs = computed<{
    class?: HTMLAttributes['class']
  }>(() => ({
    class: attrs.class,
    style: attrs.style as StyleValue,
  }))
</script>

<style lang="postcss" scoped>
  .m-dialog {
    @apply maz-flex maz-flex-col maz-rounded maz-bg-color maz-text-normal;

    &-header {
      @apply maz-flex maz-items-center maz-justify-end maz-pl-6 maz-pr-2 maz-pt-2;

      &.--has-title {
        @apply maz-justify-between;
      }
    }

    &-footer {
      @apply maz-flex maz-items-center maz-justify-end maz-px-6 maz-pb-4;
    }

    &-content {
      @apply maz-flex-1 maz-p-6;

      &-icon {
        flex: 0 0 auto;
      }
    }

    &.--scrollable {
      .m-dialog-content {
        @apply maz-overflow-auto;
      }
    }

    &-closebtn {
      @apply maz-p-2 !important;
    }
  }
</style>
