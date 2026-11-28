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
    expect(wrapper.props('distance')).toBeUndefined()
  })
})

describe('given MazReadingProgressBar with the neutral color', () => {
  it('then the bar uses the neutral foreground', async () => {
    const wrapper = mount(MazReadingProgressBar, {
      props: { color: 'neutral' },
      global: { stubs: { Teleport: true } },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('background-color: var(--maz-neutral-foreground)')
  })
})
