<script lang="ts">
export { useMazDialogConfirm } from './MazDialogConfirm/useMazDialogConfirm'
export type { MazDialogConfirmButton, MazDialogConfirmData } from './MazDialogConfirm/useMazDialogConfirm'
</script>

<script lang="ts" setup>
import type { ComponentPublicInstance, ComputedRef } from 'vue'
import type { MazBtnProps } from './MazBtn.vue'
import type { MazDialogProps } from './MazDialog.vue'
import type {
  MazDialogConfirmButton,
  MazDialogConfirmButtonPromised,
  MazDialogConfirmData,
  MazDialogConfirmState,
} from './MazDialogConfirm/useMazDialogConfirm'
import { computed, defineAsyncComponent, ref } from 'vue'

import MazDialog from './MazDialog.vue'
import { defaultData, useMazDialogConfirm } from './MazDialogConfirm/useMazDialogConfirm'

export interface MazDialogConfirmInternalProps {
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
   * Text for the reject button - will be applied only if buttons props is not provided
   * @default undefined
   */
  rejectText?: string

  /**
   * Props for the reject button - will be applied only if buttons props is not provided
   * @default { color: 'destructive', type: 'reject', text: 'Cancel', response: 'reject' }
   * @type {Omit<MazBtnProps, 'type'> & MazDialogConfirmButton}
   */
  rejectProps?: Omit<MazBtnProps, 'type'> & MazDialogConfirmButton

  /**
   * Whether to display the reject button
   * @default true
   */
  hideRejectButton?: boolean

  /**
   * Text for the accept button
   * @default undefined
   */
  acceptText?: string

  /**
   * Props for the accept button - will be applied only if buttons props is not provided
   * @default { color: 'success', type: 'accept', text: 'Confirm', response: 'accept' }
   * @type {Omit<MazBtnProps, 'type'> & MazDialogConfirmButton}
   */
  acceptProps?: Omit<MazBtnProps, 'type'> & MazDialogConfirmButton

  /**
   * Whether to display the accept button
   * @default true
   */
  hideAcceptButton?: boolean

  /**
   * Buttons to display in the footer
   * @default undefined
   */
  buttons?: MazDialogConfirmButton[]
}

export type MazDialogConfirmProps = MazDialogConfirmInternalProps & MazDialogConfirmData & MazDialogProps

const { identifier, message, buttons, title, modelValue, closeOnEscape = true, rejectText, acceptText, rejectProps, acceptProps, hideRejectButton, hideAcceptButton, ...dialogProps } = defineProps<MazDialogConfirmProps>()

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

const { dialogState, reject, accept, data } = useMazDialogConfirm()

// eslint-disable-next-line complexity
const currentData = computed<MazDialogConfirmData>(() => {
  const baseData = {
    ...defaultData,
    ...data.value,
    hideAcceptButton: data.value.hideAcceptButton ?? defaultData.hideAcceptButton,
    hideRejectButton: data.value.hideRejectButton ?? defaultData.hideRejectButton,
    acceptProps: {
      ...defaultData.acceptProps,
      ...data.value.acceptProps,
      text: acceptText ?? data.value.acceptText ?? data.value.acceptProps?.text ?? defaultData.acceptText,
      type: data.value.acceptProps?.type ?? defaultData.acceptProps.type,
    },
    rejectProps: {
      ...defaultData.rejectProps,
      ...data.value.rejectProps,
      text: rejectText ?? data.value.rejectText ?? data.value.rejectProps?.text ?? defaultData.rejectText,
      type: data.value.rejectProps?.type ?? defaultData.rejectProps.type,
    },
  } satisfies MazDialogConfirmData

  return {
    ...baseData,
    acceptText: acceptText ?? baseData.acceptText,
    rejectText: rejectText ?? baseData.rejectText,
    hideAcceptButton: hideAcceptButton ?? baseData.hideAcceptButton,
    hideRejectButton: hideRejectButton ?? baseData.hideRejectButton,
    acceptProps: {
      ...baseData.acceptProps,
      ...acceptProps,
      text: acceptText ?? acceptProps?.text ?? baseData.acceptText ?? baseData.acceptProps.text,
    } satisfies MazDialogConfirmButtonPromised,
    rejectProps: {
      ...baseData.rejectProps,
      ...rejectProps,
      text: rejectText ?? rejectProps?.text ?? baseData.rejectText ?? baseData.rejectProps?.text,
    } satisfies MazDialogConfirmButtonPromised,
  } satisfies MazDialogConfirmData
})

const currentButtons = computed(() => buttons ?? currentData.value.buttons)

const currentModal = computed(
  () => dialogState.value.find(({ id }) => id === identifier) as MazDialogConfirmState,
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

function isPromiseButton(button: MazDialogConfirmButton | undefined): button is MazDialogConfirmButtonPromised {
  if (!button)
    return false

  return 'type' in button && (button.type === 'accept' || button.type === 'reject')
}

function buttonClick(currentModal: MazDialogConfirmState, button: MazDialogConfirmButton) {
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

          <template v-else>
            <MazBtn
              v-if="!currentData.hideAcceptButton"
              v-bind="{
                ...currentData.acceptProps,
                type: 'button',
                // onClick: undefined,
                text: currentData.acceptText ?? currentData.acceptProps?.text,
              }"
              @click="
                isPromiseButton(currentData.acceptProps)
                  ? accept(currentModal, currentData.acceptProps.response)
                  : currentData.acceptProps?.onClick?.()
              "
            />
            <MazBtn
              v-if="!currentData.hideRejectButton"
              v-bind="{
                ...currentData.rejectProps,
                type: 'button',
                onClick: undefined,
                text: currentData.rejectText ?? currentData.rejectProps?.text,
              }"
              @click="
                isPromiseButton(currentData.rejectProps)
                  ? reject(currentModal, currentData.rejectProps.response)
                  : currentData.rejectProps?.onClick?.()
              "
            />
          </template>
        </div>
      </slot>
    </template>
  </MazDialog>
</template>
