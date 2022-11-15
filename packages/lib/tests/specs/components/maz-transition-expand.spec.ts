import { mount, VueWrapper } from '@vue/test-utils'
import MazTransitionExpand from '@components/MazTransitionExpand.vue'
import { ComponentPublicInstance } from 'vue'

describe('components/MazTransitionExpand.vue', () => {
  expect(MazTransitionExpand).toBeTruthy()

  const wrapper: VueWrapper<ComponentPublicInstance & { [key: string]: any }> =
    mount(MazTransitionExpand)

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
