import { shallowMount } from '@vue/test-utils'
import MazToast from '@modules/plugins/toaster/MazToast.vue'

test('plugins/toaster/MazToast.vue', () => {
  expect(MazToast).toBeTruthy()

  const wrapper = shallowMount(MazToast, {
    props: {
      message: 'Text message',
    },
  })

  expect(wrapper.html()).toMatchSnapshot()
})
