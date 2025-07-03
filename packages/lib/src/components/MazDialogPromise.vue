<script lang="ts">
export { useMazDialogPromise } from './MazDialogPromise/useMazDialogPromise'
export type { MazDialogPromiseButton, MazDialogPromiseData } from './MazDialogPromise/useMazDialogPromise'
</script>

<script lang="ts" setup>
import type { MazDialogProps } from './MazDialog.vue'
import type {
  MazDialogPromiseButton,
  MazDialogPromiseData,
  PromiseButton,
  State,
} from './MazDialogPromise/useMazDialogPromise'
import { type ComponentPublicInstance, defineAsyncComponent } from 'vue'
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
   * @default [{ text: 'Confirm', color: 'success', type: 'resolve' }, { text: 'Cancel', color: 'destructive', type: 'reject' }]
   */
  buttons?: MazDialogPromiseButton[]
}

export type MazDialogPromiseProps = MazDialogPromiseInternalProps & MazDialogPromiseData & MazDialogProps

const { identifier, message, buttons, title, ...dialogProps } = defineProps<MazDialogPromiseProps>()

defineEmits<{
  /** emitted when modal is open */
  open: [value: void]
  /** emitted when modal is close */
  close: [value: void]
}>()

const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

const { dialogState, rejectDialog, resolveDialog, data: composableData } = useMazDialogPromise()

const currentData = computed<MazDialogPromiseData>(() => ({
  ...defaultData,
  ...composableData.value,
}))

const currentButtons = computed(() => buttons ?? currentData.value.buttons)

const currentModal = computed(
  () => dialogState.value.find(({ id }) => id === identifier) as State,
)

const dialog = ref<ComponentPublicInstance<typeof MazDialog>>()

defineExpose({
  close: () => dialog.value?.close?.(),
})

function isPromiseButton(button: MazDialogPromiseButton): button is PromiseButton {
  return 'type' in button && (button.type === 'resolve' || button.type === 'reject')
}

function buttonClick(currentModal: State, button: MazDialogPromiseButton) {
  if (isPromiseButton(button)) {
    return button.type === 'resolve'
      ? resolveDialog(currentModal, button.response)
      : rejectDialog(currentModal, button.response)
  }

  return resolveDialog(currentModal, undefined, button.onClick)
}
</script>

<template>
  <MazDialog
    ref="dialog"
    v-bind="{ ...$attrs, ...dialogProps }"
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
