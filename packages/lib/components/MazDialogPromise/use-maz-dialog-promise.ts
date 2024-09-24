import type { Color, Size } from './../types'
import { ref } from 'vue'

export interface DialogState {
  id: string
  isActive: boolean
  resolve: (value: unknown) => void
  reject?: (reason?: unknown) => void
}

export interface DialogButton {
  text?: string
  block?: boolean
  color?: Color
  disabled?: boolean
  loading?: boolean
  outline?: boolean
  rounded?: boolean
  size?: Size
}

export type DialogCustomButton = DialogButton & {
  text: string
  type: 'resolve' | 'reject'
  response?: unknown
}

export interface DialogData {
  /**
   * Dialog title
   */
  title?: string
  /**
   * Dialog message
   */
  message?: string
  /**
   * Dialog cancel text
   * @default 'Cancel'
   */
  cancelText?: string
  /**
   * Dialog cancel button
   */
  cancelButton?: false | DialogButton
  /**
   * Dialog confirm text
   * @default 'Confirm'
   */
  confirmText?: string
  /**
   * Dialog confirm button
   */
  confirmButton?: false | DialogButton
  /**
   * Dialog custom buttons
   */
  buttons?: DialogCustomButton[]
}

export const defaultData = {
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  cancelButton: {
    text: 'Cancel',
    color: 'danger',
    outline: true,
  },
  confirmButton: {
    text: 'Confirm',
    color: 'success',
  },
} satisfies DialogData

const data = ref<DialogData>(defaultData)

const dialogState = ref<DialogState[]>([])

function showDialogAndWaitChoice(identifier: string, callback?: () => unknown) {
  return new Promise((resolve, reject) => {
    dialogState.value = [
      ...dialogState.value,
      {
        id: identifier,
        isActive: true,
        resolve: async (response: unknown) => {
          await callback?.()
          resolve(response)
        },
        reject,
      },
    ]
  })
}

function removeDialogFromState(identifier: string) {
  dialogState.value = dialogState.value.filter(({ id }) => id !== identifier)
  return dialogState.value
}

function responseDialog(type: 'resolve' | 'reject', currentDialog: DialogState, response: unknown = false) {
  if (!currentDialog) {
    return
  }

  currentDialog[type]?.(response)
  currentDialog.isActive = false

  setTimeout(() => {
    removeDialogFromState(currentDialog.id)
  }, 500)
}

export function useMazDialogPromise() {
  return {
    data,
    dialogState,
    showDialogAndWaitChoice,
    removeDialogFromState,
    rejectDialog: (currentDialog: DialogState, response: unknown = new Error('cancel')) =>
      responseDialog('reject', currentDialog, response),
    resolveDialog: (currentDialog: DialogState, response: unknown = 'accept') =>
      responseDialog('resolve', currentDialog, response),
  }
}
