import { type VueWrapper, shallowMount } from '@vue/test-utils'
import MazDialogPromise, { useMazDialogPromise } from '@components/MazDialogPromise.vue'

describe('MazDialogPromise', () => {
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

  test('renders the correct title', () => {
    // @ts-ignore
    expect(wrapper.vm.currentModal).toBeUndefined()
    showDialogAndWaitChoice('test')
    // @ts-ignore
    expect(wrapper.vm.currentModal.id).toBeTruthy()
  })
})
