<script lang="ts">
export { useMazDialogConfirm } from './MazDialogConfirm/useMazDialogConfirm.ts'
export type { MazDialogConfirmButton, MazDialogConfirmData } from './MazDialogConfirm/useMazDialogConfirm.ts'
</script>

<script lang="ts" setup>
import type { ComponentPublicInstance, ComputedRef } from 'vue'
import type { MazBtnProps } from './MazBtn.vue'
import type { MazDialogProps } from './MazDialog.vue'
import type {
  MazDialogConfirmButton,
  MazDialogConfirmButtonAction,
  MazDialogConfirmButtonPromised,
  MazDialogConfirmData,
  MazDialogConfirmState,
} from './MazDialogConfirm/useMazDialogConfirm.ts'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, ref, watch } from 'vue'

import MazDialog from './MazDialog.vue'
import { defaultData, useMazDialogConfirm } from './MazDialogConfirm/useMazDialogConfirm.ts'

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
   * Hide the reject button (unset: the value of `useMazDialogConfirm().data`, else shown)
   * @default false
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
   * Hide the accept button (unset: the value of `useMazDialogConfirm().data`, else shown)
   * @default false
   */
  hideAcceptButton?: boolean

  /**
   * Buttons to display in the footer
   * @default undefined
   */
  buttons?: MazDialogConfirmButton[]

  /**
   * Reinforced confirmation for destructive actions: the user must type this text in a field
   * before the accept button is enabled (the reject button is never blocked)
   * @example 'my-project'
   */
  confirmation?: string
}

export type MazDialogConfirmProps = MazDialogConfirmInternalProps & MazDialogConfirmData & MazDialogProps

const { identifier, message, buttons, title, modelValue, closeOnEscape = true, rejectText, acceptText, rejectProps, acceptProps, hideRejectButton = undefined, hideAcceptButton = undefined, confirmation, animated = true, ...dialogProps } = defineProps<MazDialogConfirmProps>()

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
const MazInput = defineAsyncComponent(() => import('./MazInput.vue'))

const { t } = useTranslations()

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

const typedConfirmation = ref('')

const isConfirmed = computed(() => !confirmation || typedConfirmation.value.trim() === confirmation)

watch(() => currentModal.value?.isActive ?? modelValue, () => {
  typedConfirmation.value = ''
})

function isAcceptButton(button: MazDialogConfirmButton | undefined) {
  return !isPromiseButton(button) || button.type === 'accept'
}

function isButtonDisabled(button: MazDialogConfirmButton | undefined) {
  return !!button?.disabled || (!isConfirmed.value && isAcceptButton(button))
}

function guardedAccept(reason?: unknown) {
  if (isConfirmed.value)
    accept(currentModal.value, reason)
}

function submitConfirmation() {
  if (!isConfirmed.value)
    return

  if (currentButtons.value) {
    const button = currentButtons.value.find(isAcceptButton)

    if (button)
      buttonClick(currentModal.value, button)

    return
  }

  const { acceptProps: button, hideAcceptButton: hidden } = currentData.value

  if (hidden || button?.disabled)
    return

  if (isPromiseButton(button))
    accept(currentModal.value, button.response)
  else
    (button as MazDialogConfirmButtonAction | undefined)?.onClick?.()
}

function isPromiseButton(button: MazDialogConfirmButton | undefined): button is MazDialogConfirmButtonPromised {
  if (!button)
    return false

  return 'type' in button && (button.type === 'accept' || button.type === 'reject')
}

function buttonClick(currentModal: MazDialogConfirmState, button: MazDialogConfirmButton) {
  if (isButtonDisabled(button))
    return

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
    :animated
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
      <div v-if="confirmation" class="m-dialog-confirm-confirmation maz:mt-4">
        <MazInput
          v-model="typedConfirmation"
          :label="t('dialogConfirm.confirmationLabel', { text: confirmation })"
          autocomplete="off"
          name="confirmation"
          @keydown.enter.prevent="submitConfirmation"
        />
      </div>
    </template>
    <template #footer>
      <!--
        @slot Footer slot
          @binding {Function} accept accept function
          @binding {Function} reject reject function
      -->
      <slot
        :accept="guardedAccept"
        :reject="(reason?: unknown) => reject(currentModal, reason)"
        name="footer-button"
      >
        <div class="maz:flex maz:items-center maz:gap-2">
          <template v-if="currentButtons">
            <MazBtn
              v-for="(button, i) in currentButtons"
              :key="i"
              v-bind="{
                ...button,
                onClick: undefined,
                type: 'button',
                disabled: isButtonDisabled(button),
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
                disabled: isButtonDisabled(currentData.acceptProps),
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
