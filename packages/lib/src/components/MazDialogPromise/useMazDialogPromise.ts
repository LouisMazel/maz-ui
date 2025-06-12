import type { Ref } from 'vue'
import type { MazBtnProps } from '../MazBtn.vue'
import type { MazSize } from '../types'
import { ref } from 'vue'

export interface MazDialogState {
  id: string
  isActive: boolean
  resolve: (value: unknown) => void
  reject?: (reason?: unknown) => void
}

export interface MazDialogButton extends MazBtnProps {
  text?: string
  size?: MazSize
}

export interface MazDialogActionButton {
  text: string
  onClick: () => unknown
}

export interface MazDialogPromiseButton {
  text: string
  type: 'resolve' | 'reject'
  response?: unknown
}

export type MazDialogCustomButton = Omit<MazDialogButton, 'type'> & (MazDialogPromiseButton | MazDialogActionButton)

export interface MazDialogData {
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
   * @default { text: 'Cancel', color: 'destructive', outlined: true }`
   */
  cancelButton?: false | MazDialogButton
  /**
   * Dialog confirm text
   * @default 'Confirm'
   */
  confirmText?: string
  /**
   * Dialog confirm button
   * @default { text: 'Confirm', color: 'success' }
   */
  confirmButton?: false | MazDialogButton
  /**
   * This is a list of custom buttons that will replace the default confirm and cancel buttons
   */
  buttons?: MazDialogCustomButton[]
}

export const defaultData = {
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  cancelButton: {
    text: 'Cancel',
    color: 'destructive',
  },
  confirmButton: {
    text: 'Confirm',
    color: 'success',
  },
} satisfies MazDialogData

const data = ref(defaultData) as Ref<MazDialogData>

const dialogState = ref<MazDialogState[]>([]) as Ref<MazDialogState[]>

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

function responseDialog(type: 'resolve' | 'reject', currentDialog: MazDialogState, response: unknown) {
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
    rejectDialog: async (currentDialog: MazDialogState, response: unknown = new Error('cancel'), onClick?: () => unknown) => {
      await onClick?.()
      return responseDialog('reject', currentDialog, response)
    },
    resolveDialog: async (currentDialog: MazDialogState, response: unknown = 'accept', onClick?: () => unknown) => {
      await onClick?.()
      return responseDialog('resolve', currentDialog, response)
    },
  }
}
