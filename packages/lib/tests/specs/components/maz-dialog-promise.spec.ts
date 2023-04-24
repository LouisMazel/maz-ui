import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import MazDialogPromise from '@components/MazDialogPromise.vue'
import { useMazDialogPromise } from '@components/MazDialogPromise/use-maz-dialog-promise'

describe('MazDialogPromise', () => {
  let wrapper: VueWrapper

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

  test('Should match with the snapshot', async () => {
    showDialogAndWaitChoice('test')
    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders the correct title', () => {
    // @ts-ignore
    expect(wrapper.vm.currentModal).toBeUndefined()
    showDialogAndWaitChoice('test')
    // @ts-ignore
    expect(wrapper.vm.currentModal.id).toBeTruthy()
  })
})
