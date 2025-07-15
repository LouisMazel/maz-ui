import type { Ref } from 'vue'
import type { MazBtnProps } from '../MazBtn.vue'
import type { MazDialogConfirmInternalProps } from '../MazDialogConfirm.vue'
import { ref } from 'vue'

export interface MazDialogConfirmState {
  id: string
  isActive: boolean
  accept: (value: unknown) => void
  reject?: (reason?: unknown) => void
}

export interface MazDialogConfirmButtonAction extends Omit<MazBtnProps, 'type'> {
  type: never
  text?: string
  onClick: () => unknown
}

export interface MazDialogConfirmButtonPromised extends Omit<MazBtnProps, 'type'> {
  text?: string
  type: 'accept' | 'reject'
  response?: unknown
}

export type MazDialogConfirmButton = MazDialogConfirmButtonPromised | MazDialogConfirmButtonAction

export type MazDialogConfirmData = Omit<MazDialogConfirmInternalProps, 'identifier'>

export const defaultData = {
  buttons: undefined,
  rejectText: 'Cancel',
  acceptText: 'Confirm',
  rejectProps: {
    color: 'destructive',
    type: 'reject',
    response: 'reject',
  } satisfies MazDialogConfirmButtonPromised,
  acceptProps: {
    color: 'success',
    type: 'accept',
    response: 'accept',
  } satisfies MazDialogConfirmButtonPromised,
} satisfies MazDialogConfirmData

const data = ref(defaultData) as Ref<MazDialogConfirmData>

const dialogState = ref<MazDialogConfirmState[]>([]) as Ref<MazDialogConfirmState[]>

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

function responseDialog(type: 'accept' | 'reject', currentDialog: MazDialogConfirmState, response: unknown) {
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

export function useMazDialogConfirm() {
  return {
    data,
    dialogState,
    showDialogAndWaitChoice,
    reject: async (currentDialog: MazDialogConfirmState, response: unknown = 'reject', onClick?: () => unknown) => {
      await onClick?.()
      return responseDialog('reject', currentDialog, response)
    },
    accept: async (currentDialog: MazDialogConfirmState, response: unknown = 'accept', onClick?: () => unknown) => {
      await onClick?.()
      return responseDialog('accept', currentDialog, response)
    },
  }
}
