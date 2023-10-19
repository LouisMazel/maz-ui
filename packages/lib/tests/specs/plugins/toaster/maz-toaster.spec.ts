import { mount } from '@vue/test-utils'
import MazToast from '@modules/plugins/toaster/MazToast.vue'

describe('plugins/toaster/MazToast.vue', () => {
  // expect(MazToast).toBeTruthy()

  test('should match with the snapshot', () => {
    const wrapper = mount(MazToast, {
      props: {
        message: 'Text message',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  test('renders the component with default props', () => {
    const wrapper = mount(MazToast, {
      props: {
        position: 'bottom-right',
        maxToasts: false,
        timeout: 10_000,
        queue: false,
        type: 'info',
        message: 'This is a test message',
        persistent: false,
      },
    })

    expect(wrapper.exists()).toBe(true)
  })
})
