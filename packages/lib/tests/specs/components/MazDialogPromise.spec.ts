import type { VueWrapper } from '@vue/test-utils'
import { MazDialogConfirm, useMazDialogConfirm } from '@components/index'
import { mount } from '@vue/test-utils'

describe('given MazDialogConfirm component', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazDialogConfirm>>
  let teleportTarget: HTMLDivElement

  const { showDialogAndWaitChoice, dialogState } = useMazDialogConfirm()

  beforeEach(() => {
    teleportTarget = document.createElement('div')
    teleportTarget.id = 'teleport-target'
    document.body.appendChild(teleportTarget)

    wrapper = mount(MazDialogConfirm, {
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
      global: {
        stubs: {
          Teleport: {
            template: '<div><slot /></div>',
          },
        },
      },
    })
  })

  afterEach(() => {
    dialogState.value = []

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
    expect(wrapper.vm.currentModal.id).toBe('test')
  })

  it('renders the correct message', () => {
    expect(wrapper.text()).toContain('Test Message')
    expect(wrapper.text()).toContain('Test Title')

    // @ts-expect-error - private value
    expect(wrapper.vm.currentData).toStrictEqual({
      buttons: [
        { text: 'Confirm', color: 'success', type: 'accept', response: 'accept' },
        { text: 'Cancel', color: 'destructive', type: 'reject', response: 'reject' },
      ],
    })
  })
})
