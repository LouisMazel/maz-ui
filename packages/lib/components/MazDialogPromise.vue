<script lang="ts">
/* eslint-disable import/first */
export { useMazDialogPromise } from './MazDialogPromise/useMazDialogPromise'
export type { ActionButton, DialogButton, DialogCustomButton, DialogData, DialogState, PromiseButton } from './MazDialogPromise/useMazDialogPromise'
</script>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type {
  DialogCustomButton,
  DialogData,
  DialogState,
  PromiseButton,
} from './MazDialogPromise/useMazDialogPromise'
import { computed, defineAsyncComponent, ref } from 'vue'

import MazDialog, { type Props as MazDialogProps } from './MazDialog.vue'
import { defaultData, useMazDialogPromise } from './MazDialogPromise/useMazDialogPromise'

export interface MazDialogPromiseProps {
  /** Dialog Data - @type DialogData */
  data?: DialogData
  /** Message to display */
  message?: string
  /** Uniq identifier */
  identifier: string
  /** Custom buttons - @type DialogCustomButton[] */
  buttons?: DialogCustomButton[]
}

export type Props = MazDialogPromiseProps & MazDialogProps & DialogData

const props = withDefaults(defineProps<MazDialogPromiseProps & MazDialogProps & DialogData>(), {
  data: undefined,
  buttons: undefined,
})

defineEmits<{
  /** emitted when modal is open */
  open: [value: void]
  /** emitted when modal is close */
  close: [value: void]
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const { dialogState, rejectDialog, resolveDialog, data: composableData } = useMazDialogPromise()

const customButtons = computed(() => props.buttons ?? props.data?.buttons ?? composableData.value.buttons)

const cancelButtonData = computed(() => {
  const hasButton
      = composableData.value?.cancelButton ?? props.data?.cancelButton ?? defaultData.cancelButton

  if (!hasButton)
    return

  return {
    ...defaultData.cancelButton,
    ...composableData.value?.cancelButton,
    ...props.data?.cancelButton,
  }
})
const confirmButtonData = computed(() => {
  const hasButton
      = composableData.value?.confirmButton ?? props.data?.confirmButton ?? defaultData.confirmButton

  if (!hasButton)
    return

  return {
    ...defaultData.confirmButton,
    ...composableData.value?.confirmButton,
    ...props.data?.confirmButton,
  }
})

const currentData = computed<DialogData>(() => ({
  ...defaultData,
  ...composableData.value,
  ...props.data,
}))

const currentModal = computed(
  () => dialogState.value.find(({ id }) => id === props.identifier) as DialogState,
)

const dialog = ref<ComponentPublicInstance<typeof MazDialog>>()

defineExpose({
  close: () => dialog.value?.close?.(),
})

function isPromiseButton(button: DialogCustomButton): button is PromiseButton {
  return 'type' in button && (button.type === 'resolve' || button.type === 'reject')
}

function customButtonAction(currentModal: DialogState, button: DialogCustomButton) {
  return isPromiseButton(button)
    ? button.type === 'resolve'
      ? resolveDialog(currentModal, button.response)
      : rejectDialog(currentModal, button.response)
    : resolveDialog(currentModal, undefined, button.action)
}
</script>

<template>
  <MazDialog
    ref="dialog"
    v-bind="{ ...$attrs, ...props }"
    :model-value="currentModal?.isActive ?? modelValue ?? false"
    @close="$emit('close', $event)"
    @open="$emit('open', $event)"
    @update:model-value="rejectDialog(currentModal)"
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
          @binding {Function} resolve resolve function
          @binding {Function} reject reject function
      -->
      <slot
        :resolve="(reason?: unknown) => resolveDialog(currentModal, reason)"
        :reject="(reason?: unknown) => rejectDialog(currentModal, reason)"
      >
        {{ message || currentData?.message }}
      </slot>
    </template>
    <template #footer>
      <!--
        @slot Footer slot
          @binding {Function} resolve resolve function
          @binding {Function} reject reject function
      -->
      <slot
        :resolve="(reason?: unknown) => resolveDialog(currentModal, reason)"
        :reject="(reason?: unknown) => rejectDialog(currentModal, reason)"
        name="footer-button"
      >
        <div class="maz-flex maz-items-center maz-gap-2">
          <template v-if="customButtons">
            <MazBtn
              v-for="(button, i) in customButtons"
              :key="i"
              v-bind="{
                ...button,
                type: 'button',
              }"
              @click="customButtonAction(currentModal, button)"
            >
              {{ button.text }}
            </MazBtn>
          </template>
          <template v-else>
            <MazBtn
              v-if="cancelButtonData"
              v-bind="cancelButtonData"
              @click="rejectDialog(currentModal)"
            >
              <!--
                @slot cancel-text slot - Place your cancel text
              -->
              <slot name="cancel-text">
                {{ cancelButtonData.text || currentData?.cancelText }}
              </slot>
            </MazBtn>

            <MazBtn
              v-if="confirmButtonData"
              v-bind="confirmButtonData"
              @click="resolveDialog(currentModal)"
            >
              <!--
                @slot confirm-text slot - Place your confirm text
              -->
              <slot name="confirm-text">
                {{ confirmButtonData.text || currentData.confirmText }}
              </slot>
            </MazBtn>
          </template>
        </div>
      </slot>
    </template>
  </MazDialog>
</template>
