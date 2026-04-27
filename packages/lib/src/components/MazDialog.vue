<script lang="ts" setup>
import type {
  ClassValue,
  ComponentPublicInstance,
  StyleValue,
} from 'vue'
import type { MazBackdropProps } from './MazBackdrop.vue'

import { MazXMark } from '@maz-ui/icons/static/MazXMark'
import {
  computed,
  defineAsyncComponent,
  nextTick,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import { hasSlotContent } from '../utils/hasSlotContent'
import MazBackdrop from './MazBackdrop.vue'

defineOptions({
  name: 'MazDialog',
  inheritAttrs: false,
})

const {
  modelValue,
  maxWidth = '100%',
  minWidth = '32rem',
  scrollable,
  closeOnEscape = true,
  ...backdropProps
} = defineProps<DialogProps & MazBackdropProps>()

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
  /**
   * Close the dialog
   * @description This is used to close the dialog
   */
  close: () => backdrop.value?.close?.(),
})

const wrapperAttrs = computed<{
  class?: ClassValue
  style: StyleValue
}>(() => ({
  class: attrs.class as ClassValue,
  style: attrs.style as StyleValue,
}))

const dialogContent = ref<HTMLElement>()

const slots = useSlots()
const hasFooter = computed(() => !!slots.footer)

if (scrollable) {
  watch(() => modelValue, async (newVal) => {
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
    v-bind="backdropProps"
    ref="backdrop"
    v-slot="{ close }"
    :model-value="modelValue"
    transition-name="modal-anim"
    aria-labelledby="dialogTitle"
    aria-describedby="dialogDesc"
    :close-on-escape="closeOnEscape"
    content-padding
    :persistent
    justify="center"
    variant="dialog"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <div
      class="m-dialog maz:flex maz:origin-center maz:flex-col maz:min-w-full maz:rounded maz:bg-surface maz:text-foreground maz:dark:border maz:dark:border-divider maz:tab-s:my-8 maz:max-w-full maz:touch-none"
      role="dialog"
      aria-modal="true"
      :style="[{ '--max-width': maxWidth, '--min-width': minWidth }]"
      :class="{ '--scrollable': scrollable, 'maz:max-h-[95vh] maz:my-0': scrollable }"
      v-bind="wrapperAttrs"
    >
      <!--
        @slot Header slot
          @binding {Function} close close function
      -->
      <slot name="header" :close>
        <div class="m-dialog-header maz:flex maz:items-baseline maz:ps-6 maz:pe-2 maz:pt-2 maz:pb-4" :class="[hasSlotContent(slots.title) || title ? '--has-title' : '', hasSlotContent(slots.title) || title ? 'maz:justify-between' : 'maz:justify-end']">
          <h2
            v-if="hasSlotContent(slots.title) || title"
            id="dialogTitle"
            class="m-dialog-title maz:my-0 maz:text-xl maz:font-semibold"
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
      <div
        id="dialogDesc"
        ref="dialogContent"
        class="m-dialog-content maz:flex-1 maz:px-6"
        :class="{
          '--bottom-padding': !hasFooter,
          'maz:pb-4': !hasFooter,
          'maz:overflow-auto maz:border-t maz:border-divider maz:py-4': scrollable,
          'maz:border-b': scrollable && hasFooter,
        }"
      >
        <!--
            @slot Default content
              @binding {Function} close close function
          -->
        <slot :close />
      </div>
      <div v-if="hasFooter" class="m-dialog-footer maz:flex maz:items-center maz:justify-end maz:px-6 maz:py-4">
        <!--
            @slot Footer slot
              @binding {Function} close close function
          -->
        <slot name="footer" :close />
      </div>
    </div>
  </MazBackdrop>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-dialog {
  @variant tab-s {
    max-inline-size: var(--max-width);
    min-inline-size: var(--min-width);
  }
}
</style>
