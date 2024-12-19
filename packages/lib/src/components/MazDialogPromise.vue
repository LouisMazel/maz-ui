<script lang="ts">
/* eslint-disable import/first */
export { useMazDialogPromise } from './MazDialogPromise/useMazDialogPromise'
export type * from './MazDialogPromise/useMazDialogPromise'
</script>

<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type {
  MazDialogCustomButton,
  MazDialogData,
  MazDialogPromiseButton,
  MazDialogState,
} from './MazDialogPromise/useMazDialogPromise'
import { computed, ref } from 'vue'
import MazBtn from './MazBtn.vue'

import MazDialog, { type MazDialogProps } from './MazDialog.vue'

import { defaultData, useMazDialogPromise } from './MazDialogPromise/useMazDialogPromise'

export interface MazDialogPromiseInternalProps {
  /** Dialog Data - @type DialogData */
  data?: MazDialogData
  /** Message to display */
  message?: string
  /** Uniq identifier */
  identifier: string
  /** Custom buttons - @type DialogCustomButton[] */
  buttons?: MazDialogCustomButton[]
}

export type MazDialogPromiseProps = MazDialogPromiseInternalProps & MazDialogProps & MazDialogData

const props = withDefaults(defineProps<MazDialogPromiseProps>(), {
  identifier: undefined,
  message: undefined,
  data: undefined,
  buttons: undefined,
})

defineEmits<{
  /** emitted when modal is open */
  open: [value: void]
  /** emitted when modal is close */
  close: [value: void]
}>()

const { dialogState, rejectDialog, resolveDialog, data: composableData } = useMazDialogPromise()

const customButtons = computed(() => props.buttons ?? props.data?.buttons ?? composableData.value.buttons)

const currentData = computed<MazDialogData>(() => ({
  ...defaultData,
  ...composableData.value,
  ...props.data,
}))

const cancelButtonData = computed(() => {
  const hasButton
      = composableData.value?.cancelButton ?? props.data?.cancelButton ?? defaultData.cancelButton

  if (!hasButton)
    return

  const mergedData = {
    ...defaultData.cancelButton,
    ...composableData.value?.cancelButton,
    ...props.data?.cancelButton,
  }

  return {
    ...mergedData,
    text: props.cancelText || currentData.value.cancelText || mergedData.text,
  }
})
const confirmButtonData = computed(() => {
  const hasButton
      = composableData.value?.confirmButton ?? props.data?.confirmButton ?? defaultData.confirmButton

  if (!hasButton)
    return

  const mergedData = {
    ...defaultData.confirmButton,
    ...composableData.value?.confirmButton,
    ...props.data?.confirmButton,
  }

  return {
    ...mergedData,
    text: props.confirmText || currentData.value.confirmText || mergedData.text,
  }
})

const currentModal = computed(
  () => dialogState.value.find(({ id }) => id === props.identifier) as MazDialogState,
)

const dialog = ref<ComponentPublicInstance<typeof MazDialog>>()

defineExpose({
  close: () => dialog.value?.close?.(),
})

function isPromiseButton(button: MazDialogCustomButton): button is MazDialogPromiseButton {
  return 'type' in button && (button.type === 'resolve' || button.type === 'reject')
}

function customButtonAction(currentModal: MazDialogState, button: MazDialogCustomButton) {
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
                {{ cancelButtonData.text }}
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
                {{ confirmButtonData.text }}
              </slot>
            </MazBtn>
          </template>
        </div>
      </slot>
    </template>
  </MazDialog>
</template>
