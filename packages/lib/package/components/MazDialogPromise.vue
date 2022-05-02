<template>
  <MazDialog
    v-if="currentModal"
    v-bind="$attrs"
    :model-value="currentModal?.isActive"
    @update:model-value="rejectDialog(currentModal)"
  >
    <template #title>
      <slot name="title">{{ data?.title }}</slot>
    </template>
    <template #default>
      <slot>{{ data?.message }}</slot>
    </template>
    <template #footer>
      <div class="maz-space-x-2">
        <MazBtn color="danger" outline @click="rejectDialog(currentModal)">
          <slot name="confirm-text"> {{ data?.confirmText || 'Cancel' }} </slot>
        </MazBtn>
        <MazBtn color="success" @click="resolveDialog(currentModal)">
          <slot name="cancel-text"> {{ data?.cancelText || 'Confirm' }} </slot>
        </MazBtn>
      </div>
    </template>
  </MazDialog>
</template>

<script lang="ts">
  export { useMazDialogPromise } from './MazDialogPromise/use-maz-dialog-promise'
  export type {
    DialogState,
    DialogData,
  } from './MazDialogPromise/use-maz-dialog-promise'
</script>

<script lang="ts" setup>
  import { type PropType, computed } from 'vue'
  import MazDialog from './MazDialog.vue'
  import MazBtn from './MazBtn.vue'
  import {
    useMazDialogPromise,
    type DialogData,
    type DialogState,
  } from './MazDialogPromise/use-maz-dialog-promise'

  const props = defineProps({
    data: { type: Object as PropType<DialogData>, default: undefined },
    identifier: { type: String, required: true },
  })

  const { dialogState, rejectDialog, resolveDialog } = useMazDialogPromise()

  const currentModal = computed(() => {
    return dialogState.value.find(
      ({ id }) => id === props.identifier,
    ) as DialogState
  })
</script>
