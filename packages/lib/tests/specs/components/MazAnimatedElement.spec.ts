import MazAnimatedElement from '@components/MazAnimatedElement.vue'
import { shallowMount } from '@vue/test-utils'

const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
})

globalThis.IntersectionObserver = mockIntersectionObserver

describe('mazAnimatedElement', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear()
    mockObserve.mockClear()
    mockUnobserve.mockClear()
    mockDisconnect.mockClear()
  })

  it('renders the component', () => {
    const wrapper = shallowMount(MazAnimatedElement)
    expect(wrapper.exists()).toBe(true)
  })

  it('applies correct animation class based on direction prop', async () => {
    const wrapper = shallowMount(MazAnimatedElement, {
      props: {
        direction: 'down',
      },
    })
    const element = wrapper.element
    const intersectionCallback = mockIntersectionObserver.mock.calls[0][0]

    expect(element.classList.contains('--invisible')).toBe(true)

    intersectionCallback([{
      target: element,
      isIntersecting: true,
    }])

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(element.classList.contains('animate-slide-down-blur')).toBe(true)
    expect(element.classList.contains('--invisible')).toBe(false)
  })

  it('applies custom duration and delay', () => {
    const wrapper = shallowMount(MazAnimatedElement, {
      props: {
        duration: 1000,
        delay: 500,
      },
    })
    expect(wrapper.attributes('style')).toContain('animation-duration: 1000ms')
  })

  it('adds animation class when intersecting', async () => {
    const wrapper = shallowMount(MazAnimatedElement)
    const element = wrapper.element
    const intersectionCallback = mockIntersectionObserver.mock.calls[0][0]

    expect(element.classList.contains('--invisible')).toBe(true)

    intersectionCallback([{
      target: element,
      isIntersecting: true,
    }])

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(element.classList.contains('animate-slide-up-blur')).toBe(true)
    expect(element.classList.contains('--invisible')).toBe(false)
  })
})
