<script lang="ts" setup>
import type {
  ComponentPublicInstance,
  HTMLAttributes,
  StyleValue,
} from 'vue'
import type { MazBackdropProps } from './MazBackdrop.vue'

import { MazXMark } from '@maz-ui/icons'
import {
  computed,
  defineAsyncComponent,
  nextTick,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import MazBackdrop from './MazBackdrop.vue'

defineOptions({
  name: 'MazDialog',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DialogProps & MazBackdropProps>(), {
  /** Title of the modal in header */
  title: undefined,
  /** Remove the close button in header */
  hideCloseButton: false,
  /** Modal's max-width */
  maxWidth: '100%',
  /** Modal's min-width */
  minWidth: '32rem',
  /**  Modal's content becomes scrollable - warning: a overflow is applied */
  scrollable: false,
  /** Persistent dialog (not closable by clicking outside and remove close button) */
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

export interface DialogProps {
  /** @model Modal's model value */
  modelValue?: boolean
  /** Title of the modal in header */
  title?: string
  /** Remove the close button in header */
  hideCloseButton?: boolean
  /** Modal's max-width */
  maxWidth?: string
  /** Modal's min-width */
  minWidth?: string
  /**  Modal's content becomes scrollable - warning: a overflow is applied */
  scrollable?: boolean
  /** Persistent dialog (not closable by clicking outside and remove close button) */
  persistent?: boolean
}

export interface MazDialogProps extends DialogProps, MazBackdropProps {}

const attrs = useAttrs()

const backdrop = ref<ComponentPublicInstance<typeof MazBackdrop>>()

defineExpose({
  close: () => backdrop.value?.close?.(),
})

const backdropProps = computed(() => {
  const dialogPropKeys: (keyof MazDialogProps)[] = [
    'modelValue',
    'title',
    'hideCloseButton',
    'maxWidth',
    'minWidth',
    'scrollable',
  ]

  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !dialogPropKeys.includes(key as keyof MazDialogProps)),
  ) as MazBackdropProps
})

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

const dialogContent = ref<HTMLElement>()

const slots = useSlots()
const hasFooter = computed(() => !!slots.footer)

if (props.scrollable) {
  watch(() => props.modelValue, async (newVal) => {
    await nextTick()
    if (newVal && dialogContent.value) {
      setTimeout(() => {
        dialogContent.value?.scrollTo({ top: 0, behavior: 'instant' })
      }, 0)
    }
  })
}
</script>

<template>
  <MazBackdrop
    v-bind="{ ...backdropAttrs, ...backdropProps }"
    ref="backdrop"
    v-slot="{ close, onBackdropClicked }"
    :model-value="modelValue"
    transition-name="modal-anim"
    aria-labelledby="dialogTitle"
    aria-describedby="dialogDesc"
    content-padding
    justify="center"
    variant="dialog"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <div
      class="m-dialog"
      role="dialog"
      aria-modal="true"
      :style="[{ '--max-width': maxWidth, '--min-width': minWidth }]"
      :class="{ '--scrollable': scrollable }"
      v-bind="wrapperAttrs"
    >
      <!--
        @slot Header slot
          @binding {Function} close close function
          @binding {Function} onBackdropClicked onBackdropClicked function (respects persistent option)
      -->
      <slot name="header" :close :on-backdrop-clicked>
        <div class="m-dialog-header" :class="{ '--has-title': $slots.title || title }">
          <h2
            v-if="$slots.title || title"
            id="dialogTitle"
            class="m-dialog-title"
          >
            <!--
                @slot Title slot in the header
              -->
            <slot name="title">
              {{ title }}
            </slot>
          </h2>

          <MazBtn
            v-if="!hideCloseButton && !persistent"
            color="transparent"
            size="sm"
            :icon="MazXMark"
            @click="close"
          />
        </div>
      </slot>
      <div id="dialogDesc" ref="dialogContent" class="m-dialog-content" :class="{ '--bottom-padding': !hasFooter }">
        <!--
            @slot Default content
              @binding {Function} close close function
              @binding {Function} onBackdropClicked onBackdropClicked function (respects persistent option)
          -->
        <slot :close :on-backdrop-clicked />
      </div>
      <div v-if="hasFooter" class="m-dialog-footer">
        <!--
            @slot Footer slot
              @binding {Function} close close function
              @binding {Function} onBackdropClicked onBackdropClicked function (respects persistent option)
          -->
        <slot name="footer" :close :on-backdrop-clicked />
      </div>
    </div>
  </MazBackdrop>
</template>

<style lang="postcss" scoped>
.m-dialog {
  @apply maz-flex maz-origin-center maz-flex-col maz-min-w-full maz-rounded maz-bg-color maz-text-normal dark:maz-border dark:maz-border-color-light tab-s:maz-my-8 maz-max-w-full maz-touch-none;

  @screen tab-s {
    max-width: var(--max-width);
    min-width: var(--min-width);
  }

  &-header {
    @apply maz-flex maz-items-baseline maz-justify-end maz-pl-6 maz-pr-2 maz-pt-2 maz-pb-4;

    &.--has-title {
      @apply maz-justify-between;
    }
  }

  &-title {
    @apply maz-my-0 maz-text-xl maz-font-semibold;
  }

  &-footer {
    @apply maz-flex maz-items-center maz-justify-end maz-px-6 maz-py-4;
  }

  &-content {
    @apply maz-flex-1 maz-px-6;

    &-icon {
      flex: 0 0 auto;
    }

    &.--bottom-padding {
      @apply maz-pb-4;
    }
  }

  &.--scrollable {
    @apply maz-max-h-[95vh] maz-my-0;

    .m-dialog-content {
      @apply maz-overflow-auto maz-border-t maz-border-color-light maz-py-4;

      &:not(.--bottom-padding) {
        @apply maz-border-b;
      }
    }
  }
}
</style>
