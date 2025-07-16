import type { VueWrapper } from '@vue/test-utils'
import MazDialog from '@components/MazDialog.vue'
import { shallowMount } from '@vue/test-utils'

describe('mazDialog', () => {
  let wrapper: VueWrapper<InstanceType<typeof MazDialog>>

  beforeEach(() => {
    wrapper = shallowMount(MazDialog)
  })

  it('should match with the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
