import { shallowMount, type VueWrapper } from '@vue/test-utils'
import MazDialog from '@components/MazDialog.vue'

describe('MazDialog', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazDialog>>

  beforeEach(() => {
    wrapper = shallowMount(MazDialog)
  })

  test('Should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
