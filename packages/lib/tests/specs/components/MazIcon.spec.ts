import MazIcon from '@components/MazIcon.vue'
import { shallowMount } from '@vue/test-utils'

describe('mazIcon', () => {
  it('renders correctly with custom name prop', async () => {
    const wrapper = shallowMount(MazIcon, {
      props: {
        name: 'test-icon',
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.fullSrc).toBe('/test-icon.svg')
  })
})
