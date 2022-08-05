import { mount } from '@vue/test-utils'
import MazToast from '@package/plugins/toaster/MazToast.vue'

test('plugins/toaster/MazToast.vue', () => {
  expect(MazToast).toBeTruthy()

  const wrapper = mount(MazToast, {
    props: {
      message: 'Text message',
    },
  })

  expect(wrapper.html()).toMatchSnapshot()
})
