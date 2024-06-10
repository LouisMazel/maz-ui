import { type VueWrapper, shallowMount } from '@vue/test-utils'
import MazDialogPromise, { useMazDialogPromise } from '@components/MazDialogPromise.vue'

describe('mazDialogPromise', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazDialogPromise>>

  const { showDialogAndWaitChoice, removeDialogFromState } = useMazDialogPromise()

  beforeEach(() => {
    wrapper = shallowMount(MazDialogPromise, {
      props: {
        data: {
          title: 'Test Title',
          message: 'Test Message',
          confirmText: 'Confirm',
          cancelText: 'Cancel',
        },
        identifier: 'test',
      },
    })
  })

  afterEach(() => {
    removeDialogFromState('test')
  })

  it('renders the correct title', () => {
    // @ts-expect-error - test case
    expect(wrapper.vm.currentModal).toBeUndefined()
    showDialogAndWaitChoice('test')
    // @ts-expect-error - test case
    expect(wrapper.vm.currentModal.id).toBeTruthy()
  })
})
