import { type VueWrapper, shallowMount } from '@vue/test-utils'
import MazDialog from '@components/MazDialog.vue'

describe('mazDialog', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazDialog>>

  beforeEach(() => {
    wrapper = shallowMount(MazDialog)
  })

  it('should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
