import { useMazDialogPromise } from '@modules/index'

describe('useMazDialogPromise', () => {
  it('should add a dialog to the state when showDialogAndWaitChoice is called', async () => {
    const { dialogState, showDialogAndWaitChoice, resolveDialog } = useMazDialogPromise()
    const identifier = 'test-dialog'

    expect(dialogState.value).toHaveLength(0)

    showDialogAndWaitChoice(identifier)
    expect(dialogState.value).toHaveLength(1)
    expect(dialogState.value[0].id).toBe(identifier)
    resolveDialog(dialogState.value[0])
  })

  it('should remove a dialog from the state when removeDialogFromState is called', async () => {
    const { dialogState, removeDialogFromState } = useMazDialogPromise()
    const identifier = 'test-dialog'

    // @ts-ignore
    dialogState.value = [{ id: identifier, isActive: true }]
    expect(dialogState.value).toHaveLength(1)

    removeDialogFromState(identifier)
    expect(dialogState.value).toHaveLength(0)
  })

  it('should resolve the dialog when resolveDialog is called', async () => {
    const { dialogState, resolveDialog } = useMazDialogPromise()
    const identifier = 'test-dialog'
    let resolved = false

    const promise = new Promise((resolve) => {
      dialogState.value = [{ id: identifier, isActive: true, resolve }]
    }).then(() => {
      resolved = true
    })

    resolveDialog(dialogState.value[0])
    await promise
    expect(resolved).toBe(true)
  })

  it('should reject the dialog when rejectDialog is called', async () => {
    const { dialogState, rejectDialog } = useMazDialogPromise()
    const identifier = 'test-dialog'
    let rejected = false

    const promise = new Promise((_resolve, reject) => {
      // @ts-ignore
      dialogState.value = [{ id: identifier, isActive: true, reject }]
    }).catch(() => {
      rejected = true
    })

    rejectDialog(dialogState.value[0])
    await promise
    expect(rejected).toBe(true)
  })
})
