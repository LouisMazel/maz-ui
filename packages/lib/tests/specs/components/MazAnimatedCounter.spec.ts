import MazAnimatedCounter from '@components/MazAnimatedCounter.vue'
import { shallowMount } from '@vue/test-utils'

describe('mazAnimatedCounter', () => {
  it('renders initial count with prefix and suffix', async () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, prefix: '$' },
    })

    expect(wrapper.find('.maz-sr-only').text()).toBe('$10')
    expect(wrapper.text()).toBe('$10$0')

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.text()).toBe('$10$0')
  })

  it('updates count and triggers animation', async () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, suffix: '%' },
    })

    expect(wrapper.find('.maz-sr-only').text()).toBe('10%')
    expect(wrapper.text()).toBe('10%0%')

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.text()).toBe('10%0%')

    await wrapper.setProps({ count: 20, suffix: '%' })
    expect(wrapper.find('.maz-sr-only').text()).toBe('20%')
    expect(wrapper.text()).toBe('20%10%')

    // await new Promise(resolve => setTimeout(resolve, 100))
    // expect(wrapper.text()).toBe('20%-52100%')
  })

  it('respects delay prop', async () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, delay: 200 },
    })

    expect(wrapper.text()).toBe('100')

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.text()).toBe('100')

    // await new Promise(resolve => setTimeout(resolve, 200))
    // expect(wrapper.html()).toBe('10')
  })
})
