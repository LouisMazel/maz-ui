import { mount } from '@vue/test-utils'
import MazTable from '@components/MazTable.vue'

describe('MazTable', () => {
  // let wrapper: VueWrapper
  // beforeEach(() => {
  //   wrapper = shallowMount(MazTable)
  // })

  test('should render the component', () => {
    const wrapper = mount(MazTable)

    expect(wrapper.html()).toMatchSnapshot()
  })
})
