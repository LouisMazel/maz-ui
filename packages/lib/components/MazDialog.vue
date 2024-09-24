<script lang="ts" setup>
import {
  computed,
  defineAsyncComponent,
  type HTMLAttributes,
  type StyleValue,
  useAttrs,
} from 'vue'
import MazBackdrop, { type Props as MazBackdropProps } from './MazBackdrop.vue'

withDefaults(defineProps<Props & MazBackdropProps>(), {
  title: undefined,
  noClose: false,
  width: '500px',
  maxWidth: '95vw',
  maxHeight: '95vh',
  scrollable: false,
  persistent: false,
})
defineEmits<{
  /** emitted when modal is open */
  'open': [value: void]
  /** emitted when modal is close */
  'close': [value: void]
  /** emitted when modal is open or close */
  'update:model-value': [value: boolean]
}>()
const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))
const XIcon = defineAsyncComponent(() => import('./../icons/x-mark.svg'))

export interface Props {
  /** @model Modal's model value */
  modelValue?: boolean
  /** Title of the modal in header */
  title?: string
  /** Remove the close button in header */
  noClose?: boolean
  /** Modal's width */
  width?: string
  /** Modal's max-width */
  maxWidth?: string
  /** Modal's max-height */
  maxHeight?: string
  /**  Modal's content becomes scrollable - warning: a overflow is applied */
  scrollable?: boolean
  /** Persistent dialog (not closable by clicking outside and remove close button) */
  persistent?: boolean
}

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

<template>
  <MazBackdrop
    v-bind="backdropAttrs"
    :persistent
    :model-value="modelValue"
    transition-name="modal-anim"
    aria-labelledby="dialogTitle"
    aria-describedby="dialogDesc"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <template #default="{ close }">
      <div
        class="m-dialog"
        role="dialog"
        aria-modal="true"
        :style="[{ width, maxWidth, maxHeight }]"
        :class="{ '--scrollable': scrollable }"
        v-bind="wrapperAttrs"
      >
        <!--
          @slot Header slot
            @binding {Function} close close function
        -->
        <slot name="header" :close="close">
          <div class="m-dialog-header" :class="{ '--has-title': $slots.title || title }">
            <h2
              v-if="$slots.title || title"
              id="dialogTitle"
              class="maz-my-0 maz-text-xl maz-font-semibold"
            >
              <!--
                @slot Title slot in the header
              -->
              <slot name="title">
                {{ title }}
              </slot>
            </h2>

            <MazBtn
              v-if="!noClose && !persistent"
              class="m-dialog-closebtn"
              color="transparent"
              @click="close"
            >
              <XIcon class="maz-text-lg" />
            </MazBtn>
          </div>
        </slot>
        <div id="dialogDesc" class="m-dialog-content">
          <!--
            @slot Default content
              @binding {Function} close close function
          -->
          <slot :close="close" />
        </div>
        <div v-if="$slots.footer" class="m-dialog-footer">
          <!--
            @slot Footer slot
              @binding {Function} close close function
          -->
          <slot name="footer" :close="close" />
        </div>
      </div>
    </template>
  </MazBackdrop>
</template>

<style lang="postcss" scoped>
  .m-dialog {
  @apply maz-flex maz-origin-center maz-flex-col maz-rounded maz-bg-color maz-text-normal dark:maz-border dark:maz-border-color-light;

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
