import MazReadingProgressBar from '@components/MazReadingProgressBar.vue'
import { mount } from '@vue/test-utils'

describe('mazReadingProgressBar.vue', () => {
  it('renders with default props', async () => {
    const wrapper = mount(MazReadingProgressBar)
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.props('height')).toBe('4px')
    expect(wrapper.props('color')).toBe('primary')
    expect(wrapper.props('teleportSelector')).toBe('body')
    expect(wrapper.props('contentSelector')).toBe('body')
    expect(wrapper.props('offset')).toBe(0)
    expect(wrapper.props('barClass')).toBeUndefined()
    expect(wrapper.props('distance')).toBeUndefined()
  })
})
