import { shallowMount, type VueWrapper } from '@vue/test-utils'
import MazDropdown from '@components/MazDropdown.vue'

describe('MazDropdown', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = shallowMount(MazDropdown)
  })

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
