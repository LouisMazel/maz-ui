import { mount } from '@vue/test-utils'
import MazCard from '@components/MazCard.vue'

test('components/MazCard.vue', () => {
  expect(MazCard).toBeTruthy()

  const wrapper = mount(MazCard, {
    props: {},
  })

  expect(wrapper.html()).toMatchSnapshot()
})
