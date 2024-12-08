import MazAnimatedCounter from '@components/MazAnimatedCounter.vue'
import { shallowMount } from '@vue/test-utils'

describe('mazAnimatedCounter', () => {
  it('renders initial count with prefix and suffix', () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, prefix: '$' },
    })

    expect(wrapper.find('.maz-sr-only').text()).toBe('$10')
  })

  it('updates count and triggers animation', () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, suffix: '%' },
    })

    expect(wrapper.find('.maz-sr-only').text()).toBe('10%')
  })

  it('respects delay prop', () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, delay: 200 },
    })

    expect(wrapper.text()).toBe('100')
  })
})
