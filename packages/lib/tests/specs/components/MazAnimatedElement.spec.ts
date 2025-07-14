import MazAnimatedElement from '@components/MazAnimatedElement.vue'
import { shallowMount } from '@vue/test-utils'

const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})

globalThis.IntersectionObserver = mockIntersectionObserver

describe('mazAnimatedElement', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(MazAnimatedElement)
    expect(wrapper.exists()).toBe(true)
  })

  it('applies correct animation class based on direction prop', () => {
    const wrapper = shallowMount(MazAnimatedElement, {
      props: {
        direction: 'down',
      },
    })
    expect(wrapper.classes()).toContain('--invisible')
    expect(wrapper.attributes('style')).toContain('animation-duration: 2000ms')
    expect(wrapper.attributes('style')).toContain('animation-delay: 0ms')
  })

  it('applies custom duration and delay', () => {
    const wrapper = shallowMount(MazAnimatedElement, {
      props: {
        duration: 1000,
        delay: 500,
      },
    })
    expect(wrapper.attributes('style')).toContain('animation-duration: 1000ms')
    expect(wrapper.attributes('style')).toContain('animation-delay: 500ms')
  })

  it('adds animation class when intersecting', async () => {
    const wrapper = shallowMount(MazAnimatedElement)
    const element = wrapper.element
    const intersectionCallback = mockIntersectionObserver.mock.calls[0][0]

    intersectionCallback([{
      target: element,
      isIntersecting: true,
    }])

    await wrapper.vm.$nextTick()
    expect(wrapper.classes('animate-slide-up-blur')).toBe(true)
    expect(wrapper.classes('--invisible')).toBe(false)
  })
})
