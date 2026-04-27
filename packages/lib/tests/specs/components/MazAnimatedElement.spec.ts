import MazAnimatedElement from '@components/MazAnimatedElement.vue'
import { shallowMount } from '@vue/test-utils'

const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

// eslint-disable-next-line prefer-arrow-callback
const mockIntersectionObserver = vi.fn(function () {
  return {
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }
})

globalThis.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver

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

    expect(element.classList.contains('maz:invisible')).toBe(true)

    intersectionCallback([{
      target: element,
      isIntersecting: true,
    }])

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(element.classList.contains('animate-slide-down-blur')).toBe(true)
    expect(element.classList.contains('maz:invisible')).toBe(false)
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

    expect(element.classList.contains('maz:invisible')).toBe(true)

    intersectionCallback([{
      target: element,
      isIntersecting: true,
    }])

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(element.classList.contains('animate-slide-up-blur')).toBe(true)
    expect(element.classList.contains('maz:invisible')).toBe(false)
  })

  it('unobserves the element after the first intersection when once is true', async () => {
    const wrapper = shallowMount(MazAnimatedElement, { props: { once: true } })
    const element = wrapper.element
    const intersectionCallback = mockIntersectionObserver.mock.calls[0][0]

    intersectionCallback([{ target: element, isIntersecting: true }])
    await wrapper.vm.$nextTick()

    expect(mockUnobserve).toHaveBeenCalledWith(element)
  })

  it('resets the animation when leaving the viewport with once=false', async () => {
    const wrapper = shallowMount(MazAnimatedElement, { props: { once: false } })
    const element = wrapper.element
    const intersectionCallback = mockIntersectionObserver.mock.calls[0][0]

    // First, animate it in
    intersectionCallback([{ target: element, isIntersecting: true }])
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(element.classList.contains('animate-slide-up-blur')).toBe(true)
    expect(element.classList.contains('maz:invisible')).toBe(false)

    // Then, intersect out
    intersectionCallback([{ target: element, isIntersecting: false }])
    await wrapper.vm.$nextTick()

    expect(element.classList.contains('animate-slide-up-blur')).toBe(false)
    expect(element.classList.contains('maz:invisible')).toBe(true)
    expect(mockUnobserve).not.toHaveBeenCalled()
  })

  it('disconnects the observer on unmount', () => {
    const wrapper = shallowMount(MazAnimatedElement)
    wrapper.unmount()
    expect(mockDisconnect).toHaveBeenCalledOnce()
  })

  it('does nothing when intersecting and already animated', async () => {
    const wrapper = shallowMount(MazAnimatedElement)
    const element = wrapper.element
    const intersectionCallback = mockIntersectionObserver.mock.calls[0][0]

    intersectionCallback([{ target: element, isIntersecting: true }])
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))
    mockUnobserve.mockClear()

    // Re-trigger — branch where isAnimated is already true
    intersectionCallback([{ target: element, isIntersecting: true }])
    await wrapper.vm.$nextTick()

    expect(mockUnobserve).not.toHaveBeenCalled()
  })
})
