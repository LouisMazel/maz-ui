import MazDialogPromise, { useMazDialogPromise } from '@components/MazDialogPromise.vue'
import { mount, type VueWrapper } from '@vue/test-utils'

describe('given MazDialogPromise component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazDialogPromise>>
  let teleportTarget: HTMLDivElement

  const { showDialogAndWaitChoice, removeDialogFromState } = useMazDialogPromise()

  beforeEach(() => {
    teleportTarget = document.createElement('div')
    teleportTarget.id = 'teleport-target'
    document.body.appendChild(teleportTarget)

    wrapper = mount(MazDialogPromise, {
      props: {
        title: 'Test Title',
        message: 'Test Message',
        data: {
          confirmText: 'Yes',
          cancelText: 'No',
        },
        modelValue: true,
        identifier: 'test',
        teleportSelector: '#teleport-target',
      },
    })
  })

  afterEach(() => {
    removeDialogFromState('test')

    const teleportTarget = document.getElementById('teleport-target')
    if (teleportTarget) {
      document.body.removeChild(teleportTarget)
    }
  })

  it('renders the correct title', () => {
    // @ts-expect-error - test case
    expect(wrapper.vm.currentModal).toBeUndefined()
    showDialogAndWaitChoice('test')
    // @ts-expect-error - test case
    expect(wrapper.vm.currentModal.id).toBeTruthy()
  })

  it('renders the correct message', () => {
    const message = teleportTarget.querySelector<HTMLDivElement>('.m-dialog-content')
    const header = teleportTarget.querySelector<HTMLDivElement>('.m-dialog-header')

    expect(message?.textContent).toBe('Test Message')
    expect(header?.textContent).toBe('Test Title')

    // @ts-expect-error - private value
    expect(wrapper.vm.confirmButtonData).toStrictEqual({ text: 'Yes', color: 'success' })
    // @ts-expect-error - private value
    expect(wrapper.vm.cancelButtonData).toStrictEqual({ text: 'No', color: 'danger' })
    // @ts-expect-error - private value
    expect(wrapper.vm.currentData).toStrictEqual({
      cancelButton: { text: 'Cancel', color: 'danger' },
      confirmButton: { text: 'Confirm', color: 'success' },
      cancelText: 'No',
      confirmText: 'Yes',
    })
  })
})
