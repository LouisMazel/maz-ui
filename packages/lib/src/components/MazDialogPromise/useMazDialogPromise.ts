import type { Ref } from 'vue'
import type { MazBtnProps } from '../MazBtn.vue'
import { ref } from 'vue'

export interface State {
  id: string
  isActive: boolean
  resolve: (value: unknown) => void
  reject?: (reason?: unknown) => void
}

export interface ActionButton extends Omit<MazBtnProps, 'type'> {
  text: string
  onClick: () => unknown
}

export interface PromiseButton extends Omit<MazBtnProps, 'type'> {
  text: string
  type: 'resolve' | 'reject'
  response?: unknown
}

export type MazDialogPromiseButton = PromiseButton | ActionButton

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
    type: 'resolve',
  }, {
    text: 'Cancel',
    color: 'destructive',
    type: 'reject',
  }],
} satisfies MazDialogPromiseData

const data = ref(defaultData) as Ref<MazDialogPromiseData>

const dialogState = ref<State[]>([]) as Ref<State[]>

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

function responseDialog(type: 'resolve' | 'reject', currentDialog: State, response: unknown) {
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
    rejectDialog: async (currentDialog: State, response: unknown = new Error('cancel'), onClick?: () => unknown) => {
      await onClick?.()
      return responseDialog('reject', currentDialog, response)
    },
    resolveDialog: async (currentDialog: State, response: unknown = 'accept', onClick?: () => unknown) => {
      await onClick?.()
      return responseDialog('resolve', currentDialog, response)
    },
  }
}
