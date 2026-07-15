import MazAnimatedElement from '@components/MazAnimatedElement.vue'
import { IntersectionObserverMock } from '@tests/vitest-global.setup'
import { shallowMount } from '@vue/test-utils'

function getLastIntersectionCallback(): IntersectionObserverCallback {
  const calls = vi.mocked(IntersectionObserver).mock.calls
  return calls.at(-1)![0]
}

describe('mazAnimatedElement', () => {
  beforeEach(() => {
    vi.mocked(IntersectionObserver).mockClear()
    vi.mocked(IntersectionObserverMock.observe).mockClear()
    vi.mocked(IntersectionObserverMock.unobserve).mockClear()
    vi.mocked(IntersectionObserverMock.disconnect).mockClear()
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
    const intersectionCallback = getLastIntersectionCallback()

    expect(element.classList.contains('maz:invisible')).toBe(true)

    intersectionCallback(
      [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
      IntersectionObserverMock as unknown as IntersectionObserver,
    )

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
    const intersectionCallback = getLastIntersectionCallback()

    expect(element.classList.contains('maz:invisible')).toBe(true)

    intersectionCallback(
      [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
      IntersectionObserverMock as unknown as IntersectionObserver,
    )

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(element.classList.contains('animate-slide-up-blur')).toBe(true)
    expect(element.classList.contains('maz:invisible')).toBe(false)
  })

  it('unobserves the element after the first intersection when once is true', async () => {
    const wrapper = shallowMount(MazAnimatedElement, { props: { once: true } })
    const element = wrapper.element
    const intersectionCallback = getLastIntersectionCallback()

    intersectionCallback(
      [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
      IntersectionObserverMock as unknown as IntersectionObserver,
    )
    await wrapper.vm.$nextTick()

    expect(IntersectionObserverMock.unobserve).toHaveBeenCalledWith(element)
  })

  it('resets the animation when leaving the viewport with once=false', async () => {
    const wrapper = shallowMount(MazAnimatedElement, { props: { once: false } })
    const element = wrapper.element
    const intersectionCallback = getLastIntersectionCallback()

    // First, animate it in
    intersectionCallback(
      [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
      IntersectionObserverMock as unknown as IntersectionObserver,
    )
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(element.classList.contains('animate-slide-up-blur')).toBe(true)
    expect(element.classList.contains('maz:invisible')).toBe(false)

    // Then, intersect out
    intersectionCallback(
      [{ target: element, isIntersecting: false } as IntersectionObserverEntry],
      IntersectionObserverMock as unknown as IntersectionObserver,
    )
    await wrapper.vm.$nextTick()

    expect(element.classList.contains('animate-slide-up-blur')).toBe(false)
    expect(element.classList.contains('maz:invisible')).toBe(true)
    expect(IntersectionObserverMock.unobserve).not.toHaveBeenCalled()
  })

  it('disconnects the observer on unmount', () => {
    const wrapper = shallowMount(MazAnimatedElement)
    wrapper.unmount()
    expect(IntersectionObserverMock.disconnect).toHaveBeenCalledOnce()
  })

  it('does nothing when intersecting and already animated', async () => {
    const wrapper = shallowMount(MazAnimatedElement)
    const element = wrapper.element
    const intersectionCallback = getLastIntersectionCallback()

    intersectionCallback(
      [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
      IntersectionObserverMock as unknown as IntersectionObserver,
    )
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))
    vi.mocked(IntersectionObserverMock.unobserve).mockClear()

    // Re-trigger — branch where isAnimated is already true
    intersectionCallback(
      [{ target: element, isIntersecting: true } as IntersectionObserverEntry],
      IntersectionObserverMock as unknown as IntersectionObserver,
    )
    await wrapper.vm.$nextTick()

    expect(IntersectionObserverMock.unobserve).not.toHaveBeenCalled()
  })
})
