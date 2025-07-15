import { useMazDialogConfirm } from '@/components/MazDialogConfirm.vue'

describe('useMazDialogConfirm', () => {
  it('should add a dialog to the state when showDialogAndWaitChoice is called', () => {
    const { dialogState, showDialogAndWaitChoice, accept } = useMazDialogConfirm()
    const identifier = 'test-dialog'

    expect(dialogState.value).toHaveLength(0)

    showDialogAndWaitChoice(identifier)
    expect(dialogState.value).toHaveLength(1)
    expect(dialogState.value[0].id).toBe(identifier)
    accept(dialogState.value[0])
  })

  it('should remove a dialog from the state when accept is called', async () => {
    vi.useFakeTimers()
    const { dialogState, accept } = useMazDialogConfirm()
    const identifier = 'test-dialog'

    // @ts-expect-error - test case
    dialogState.value = [{ id: identifier, isActive: true }]

    const response = await accept(dialogState.value[0])

    expect(response).toBe('accept')

    vi.advanceTimersByTime(500)

    // removeDialog(identifier)
    expect(dialogState.value).toHaveLength(0)

    vi.useRealTimers()
  })

  it('should resolve the dialog when resolveDialog is called', async () => {
    const { dialogState, accept } = useMazDialogConfirm()
    const identifier = 'test-dialog'
    let resolved = false

    const promise = new Promise((resolve) => {
      dialogState.value = [{ id: identifier, isActive: true, accept: resolve }]
    }).then(() => {
      resolved = true
    })

    accept(dialogState.value[0])
    await promise
    expect(resolved).toBe(true)
  })

  it('should reject the dialog when rejectDialog is called', async () => {
    const { dialogState, reject } = useMazDialogConfirm()
    const identifier = 'test-dialog'
    let rejected = false

    const promise = new Promise((_resolve, reject) => {
      // @ts-expect-error - test case
      dialogState.value = [{ id: identifier, isActive: true, reject }]
    }).catch(() => {
      rejected = true
    })

    reject(dialogState.value[0])
    await promise
    expect(rejected).toBe(true)
  })
})
