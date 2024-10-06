import MazTransitionExpand from '@components/MazTransitionExpand.vue'
import { shallowMount } from '@vue/test-utils'

describe('components/MazTransitionExpand.vue', () => {
  expect(MazTransitionExpand).toBeTruthy()

  const wrapper = shallowMount(MazTransitionExpand)

  it('should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
