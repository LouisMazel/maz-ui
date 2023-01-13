import { shallowMount } from '@vue/test-utils'
import MazIcon from '@components/MazIcon.vue'

describe('MazIcon', () => {
  it('renders correctly with custom name prop', async () => {
    const wrapper = shallowMount(MazIcon, {
      props: {
        name: 'test-icon',
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.vm.fullSrc).toBe('/test-icon.svg')
  })
})
