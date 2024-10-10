import type { Ref } from 'vue'
import type { Props } from '../MazBtn.vue'
import type { Size } from './../types'
import { ref } from 'vue'

export interface DialogState {
  id: string
  isActive: boolean
  resolve: (value: unknown) => void
  reject?: (reason?: unknown) => void
}

export interface DialogButton extends Props {
  text?: string
  size?: Size
}

export interface ActionButton {
  text: string
  action: () => unknown
}

export interface PromiseButton {
  text: string
  type: 'resolve' | 'reject'
  response?: unknown
}

export type DialogCustomButton = Omit<DialogButton, 'type'> & (PromiseButton | ActionButton)

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
   * @default { text: 'Cancel', color: 'danger', outline: true }`
   */
  cancelButton?: false | DialogButton
  /**
   * Dialog confirm text
   * @default 'Confirm'
   */
  confirmText?: string
  /**
   * Dialog confirm button
   * @default { text: 'Confirm', color: 'success' }
   */
  confirmButton?: false | DialogButton
  /**
   * This is a list of custom buttons that will replace the default confirm and cancel buttons
   */
  buttons?: DialogCustomButton[]
}

export const defaultData = {
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  cancelButton: {
    text: 'Cancel',
    color: 'danger',
  },
  confirmButton: {
    text: 'Confirm',
    color: 'success',
  },
} satisfies DialogData

const data = ref(defaultData) as Ref<DialogData>

const dialogState = ref<DialogState[]>([]) as Ref<DialogState[]>

function showDialogAndWaitChoice(identifier: string, callback?: () => unknown) {
  return new Promise((resolve, reject) => {
    dialogState.value = [
      ...dialogState.value,
      {
        id: identifier,
        isActive: true,
        resolve: async (response: unknown) => {
          resolve(response)
          await callback?.()
        },
        reject: async (response: unknown) => {
          reject(response)
          await callback?.()
        },
      },
    ]
  })
}

function removeDialogFromState(identifier: string) {
  dialogState.value = dialogState.value.filter(({ id }) => id !== identifier)
  return dialogState.value
}

function responseDialog(type: 'resolve' | 'reject', currentDialog: DialogState, response: unknown) {
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
    rejectDialog: async (currentDialog: DialogState, response: unknown = new Error('cancel'), action?: () => unknown) => {
      await action?.()
      return responseDialog('reject', currentDialog, response)
    },
    resolveDialog: async (currentDialog: DialogState, response: unknown = 'accept', action?: () => unknown) => {
      await action?.()
      return responseDialog('resolve', currentDialog, response)
    },
  }
}
