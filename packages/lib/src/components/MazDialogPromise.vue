<script lang="ts">
export { useMazDialogPromise } from './MazDialogPromise/useMazDialogPromise'
export type { MazDialogPromiseButton, MazDialogPromiseData } from './MazDialogPromise/useMazDialogPromise'
</script>

<script lang="ts" setup>
import type { MazDialogProps } from './MazDialog.vue'
import type {
  MazDialogButtonPromise,
  MazDialogPromiseButton,
  MazDialogPromiseData,
  MazDialogPromiseState,
} from './MazDialogPromise/useMazDialogPromise'
import { type ComponentPublicInstance, type ComputedRef, defineAsyncComponent } from 'vue'
import { computed, ref } from 'vue'

import MazDialog from './MazDialog.vue'

import { defaultData, useMazDialogPromise } from './MazDialogPromise/useMazDialogPromise'

export interface MazDialogPromiseInternalProps {
  /**
   * Uniq identifier of the dialog
   * @description This is used to identify the dialog in the state
   */
  identifier: string
  /**
   * Dialog title displayed in the header
   */
  title?: string
  /**
   * Dialog message displayed in the body
   */
  message?: string
  /**
   * Buttons to display in the footer
   * @default [{ text: 'Confirm', color: 'success', type: 'accept' }, { text: 'Cancel', color: 'destructive', type: 'reject' }]
   */
  buttons?: MazDialogPromiseButton[]
}

export type MazDialogPromiseProps = MazDialogPromiseInternalProps & MazDialogPromiseData & MazDialogProps

const { identifier, message, buttons, title, modelValue, closeOnEscape = true, ...dialogProps } = defineProps<MazDialogPromiseProps>()

defineEmits<{
  /**
   * Emitted when modal is open
   * @property {void} value - void
   */
  open: [value: void]
  /**
   * Emitted when modal is close
   * @property {void} value - void
   */
  close: [value: void]
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const { dialogState, reject, accept, data: composableData } = useMazDialogPromise()

const currentData = computed<MazDialogPromiseData>(() => ({
  ...defaultData,
  ...composableData.value,
}))

const currentButtons = computed(() => buttons ?? currentData.value.buttons)

const currentModal = computed(
  () => dialogState.value.find(({ id }) => id === identifier) as MazDialogPromiseState,
)

const dialog = ref<ComponentPublicInstance<typeof MazDialog>>()

defineExpose<{
  close: () => void
  isActive: ComputedRef<boolean>
}>({
      /**
       * Close the dialog
       * @description This is used to close the dialog
       */
      close: () => dialog.value?.close?.(),
      /**
       * Check if the dialog is active
       * @description This is used to check if the dialog is active
       */
      isActive: computed(() => currentModal.value?.isActive ?? modelValue ?? false),
    })

function isPromiseButton(button: MazDialogPromiseButton): button is MazDialogButtonPromise {
  return 'type' in button && (button.type === 'accept' || button.type === 'reject')
}

function buttonClick(currentModal: MazDialogPromiseState, button: MazDialogPromiseButton) {
  if (isPromiseButton(button)) {
    return button.type === 'accept'
      ? accept(currentModal, button.response)
      : reject(currentModal, button.response)
  }

  return accept(currentModal, undefined, button.onClick)
}
</script>

<template>
  <MazDialog
    ref="dialog"
    v-bind="{ ...$attrs, ...dialogProps }"
    :close-on-escape="closeOnEscape"
    :model-value="currentModal?.isActive ?? modelValue ?? false"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="reject(currentModal)"
  >
    <template #title>
      <!--
        @slot title slot - Place your title
      -->
      <slot name="title">
        {{ title || currentData?.title }}
      </slot>
    </template>
    <template #default>
      <!--
        @slot Default slot - Place your content
          @binding {Function} accept accept function
          @binding {Function} reject reject function
      -->
      <slot
        :accept="(reason?: unknown) => accept(currentModal, reason)"
        :reject="(reason?: unknown) => reject(currentModal, reason)"
      >
        {{ message || currentData?.message }}
      </slot>
    </template>
    <template #footer>
      <!--
        @slot Footer slot
          @binding {Function} accept accept function
          @binding {Function} reject reject function
      -->
      <slot
        :accept="(reason?: unknown) => accept(currentModal, reason)"
        :reject="(reason?: unknown) => reject(currentModal, reason)"
        name="footer-button"
      >
        <div class="maz-flex maz-items-center maz-gap-2">
          <template v-if="currentButtons">
            <MazBtn
              v-for="(button, i) in currentButtons"
              :key="i"
              v-bind="{
                ...button,
                onClick: undefined,
                type: 'button',
              }"
              @click="buttonClick(currentModal, button)"
            >
              {{ button.text }}
            </MazBtn>
          </template>
        </div>
      </slot>
    </template>
  </MazDialog>
</template>
