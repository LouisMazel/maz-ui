import type { Ref } from 'vue'
import type { MazBtnProps } from '../MazBtn.vue'
import { ref } from 'vue'

export interface MazDialogPromiseState {
  id: string
  isActive: boolean
  accept: (value: unknown) => void
  reject?: (reason?: unknown) => void
}

export interface MazDialogPromiseButtonAction extends Omit<MazBtnProps, 'type'> {
  text: string
  onClick: () => unknown
}

export interface MazDialogButtonPromise extends Omit<MazBtnProps, 'type'> {
  text: string
  type: 'accept' | 'reject'
  response?: unknown
}

export type MazDialogPromiseButton = MazDialogButtonPromise | MazDialogPromiseButtonAction

export interface MazDialogPromiseData {
  /**
   * Dialog title
   */
  title?: string
  /**
   * Dialog message
   */
  message?: string
  /**
   * This is a list of custom buttons that will replace the default confirm and cancel buttons
   */
  buttons?: MazDialogPromiseButton[]
}

export const defaultData = {
  buttons: [{
    text: 'Confirm',
    color: 'success',
    type: 'accept',
    response: 'accept',
  }, {
    text: 'Cancel',
    color: 'destructive',
    type: 'reject',
    response: 'reject',
  }],
} satisfies MazDialogPromiseData

const data = ref(defaultData) as Ref<MazDialogPromiseData>

const dialogState = ref<MazDialogPromiseState[]>([]) as Ref<MazDialogPromiseState[]>

function showDialogAndWaitChoice(identifier: string, callback?: () => unknown) {
  return new Promise((resolve, reject) => {
    dialogState.value = [
      ...dialogState.value,
      {
        id: identifier,
        isActive: true,
        accept: async (response: unknown) => {
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

function responseDialog(type: 'accept' | 'reject', currentDialog: MazDialogPromiseState, response: unknown) {
  if (!currentDialog) {
    return
  }

  currentDialog[type]?.(response)
  currentDialog.isActive = false

  setTimeout(() => {
    removeDialogFromState(currentDialog.id)
  }, 500)

  return response
}

export function useMazDialogPromise() {
  return {
    data,
    dialogState,
    showDialogAndWaitChoice,
    reject: async (currentDialog: MazDialogPromiseState, response: unknown = 'reject', onClick?: () => unknown) => {
      await onClick?.()
      return responseDialog('reject', currentDialog, response)
    },
    accept: async (currentDialog: MazDialogPromiseState, response: unknown = 'accept', onClick?: () => unknown) => {
      await onClick?.()
      return responseDialog('accept', currentDialog, response)
    },
  }
}
