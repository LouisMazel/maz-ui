<template>
  <MazDialog
    :model-value="currentModal?.isActive ?? false"
    @update:model-value="rejectDialog(currentModal)"
  >
    <template #title>
      <slot name="title">{{ data?.title }}</slot>
    </template>
    <template #default>
      <!--
        @slot Default slot - Place your content
          @binding {Function} resolve resolve function
          @binding {Function} reject reject function
      -->
      <slot
        :resolve="(reason?: string | boolean) => resolveDialog(currentModal, reason)"
        :reject="(reason?: string | boolean) => rejectDialog(currentModal, reason)"
      >
        {{ data?.message }}</slot
      >
    </template>
    <template #footer>
      <!--
        @slot Footer Buttons slot
          @binding {Function} resolve resolve function
          @binding {Function} reject reject function
      -->
      <slot
        :resolve="(reason?: string | boolean) => resolveDialog(currentModal, reason)"
        :reject="(reason?: string | boolean) => rejectDialog(currentModal, reason)"
        name="footer-button"
      >
        <div class="maz-space-x-2">
          <template v-if="buttons.length > 0">
            <MazBtn
              v-for="(button, i) in buttons"
              :key="i"
              :color="button.color"
              :size="button.size"
              :outline="button.outline"
              :rounded="button.rounded"
              :disabled="button.disabled"
              :block="button.block"
              :loading="button.loading"
              @click="
                button.type === 'resolve'
                  ? resolveDialog(currentModal, button.response)
                  : rejectDialog(currentModal, button.response)
              "
            >
              {{ button.text }}
            </MazBtn>
          </template>
          <template v-else>
            <MazBtn color="danger" outline @click="rejectDialog(currentModal)">
              <slot name="cancel-text"> {{ data?.cancelText || 'Cancel' }} </slot>
            </MazBtn>
            <MazBtn color="success" @click="resolveDialog(currentModal)">
              <slot name="confirm-text"> {{ data?.confirmText || 'Confirm' }} </slot>
            </MazBtn>
          </template>
        </div>
      </slot>
    </template>
  </MazDialog>
</template>

<script lang="ts">
  export {
    useMazDialogPromise,
    type DialogState,
    type DialogData,
  } from './MazDialogPromise/use-maz-dialog-promise'
  export type { Color, Size } from './types'
</script>

<script lang="ts" setup>
  import { type PropType, computed, defineAsyncComponent } from 'vue'
  import { type Color, type Size } from './types'
  import {
    useMazDialogPromise,
    type DialogData,
    type DialogState,
  } from './MazDialogPromise/use-maz-dialog-promise'

  export type DialogButton = {
    text: string
    type: 'resolve' | 'reject'
    block?: boolean
    color?: Color
    disabled?: boolean
    loading?: boolean
    outline?: boolean
    response?: string | boolean
    rounded?: boolean
    size?: Size
  }

  import MazDialog from './MazDialog.vue'
  const MazBtn = defineAsyncComponent(() => import('./MazBtn.vue'))

  const props = defineProps({
    /** Dialog Data - type DialogData */
    data: { type: Object as PropType<DialogData>, default: undefined },
    /** Uniq identifier */
    identifier: { type: String, required: true },
    /** Custom buttons - type DialogButton[] */
    buttons: { type: Array as PropType<DialogButton[]>, default: () => [] },
  })

  const { dialogState, rejectDialog, resolveDialog } = useMazDialogPromise()

  const currentModal = computed(
    () => dialogState.value.find(({ id }) => id === props.identifier) as DialogState,
  )
</script>
