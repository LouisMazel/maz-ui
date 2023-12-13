import { ref } from 'vue'

export interface DialogState {
  id: string
  isActive: boolean
  resolve: (value: unknown) => void
  reject?: (reason?: unknown) => void
}

export interface DialogData {
  title: string
  message: string
  cancelText?: string
  confirmText?: string
}

const confirmDialogData = ref<DialogData>()

const dialogState = ref<DialogState[]>([])

const showDialogAndWaitChoice = (identifier: string, callback?: () => unknown) => {
  return new Promise((resolve, reject) => {
    dialogState.value = [
      ...dialogState.value,
      {
        id: identifier,
        isActive: true,
        resolve: async () => {
          await callback?.()
          resolve(true)
        },
        reject,
      },
    ]
  })
}

const removeDialogFromState = (identifier: string) => {
  dialogState.value = dialogState.value.filter(({ id }) => id !== identifier)
  return dialogState.value
}

const responseDialog = (
  type: 'resolve' | 'reject',
  currentDialog: DialogState,
  response: string | boolean = false,
) => {
  if (currentDialog) {
    currentDialog[type]?.(response)
    currentDialog.isActive = false

    setTimeout(() => {
      removeDialogFromState(currentDialog.id)
    }, 500)
  }
}

export const useMazDialogPromise = () => ({
  confirmDialogData,
  dialogState,
  showDialogAndWaitChoice,
  removeDialogFromState,
  rejectDialog: (currentDialog: DialogState, response: string | boolean = 'cancel') =>
    responseDialog('reject', currentDialog, response),
  resolveDialog: (currentDialog: DialogState, response: string | boolean = 'accept') =>
    responseDialog('resolve', currentDialog, response),
})
