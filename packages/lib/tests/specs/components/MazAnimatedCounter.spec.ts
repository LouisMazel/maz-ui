import MazAnimatedCounter from '@components/MazAnimatedCounter.vue'
import { IntersectionObserverMock } from '@tests/vitest-global.setup'
import { shallowMount } from '@vue/test-utils'

function getLastIntersectionCallback(): IntersectionObserverCallback {
  const calls = vi.mocked(IntersectionObserver).mock.calls
  return calls.at(-1)![0]
}

describe('mazAnimatedCounter', () => {
  beforeEach(() => {
    vi.mocked(IntersectionObserver).mockClear()
    vi.mocked(IntersectionObserverMock.observe).mockClear()
    vi.mocked(IntersectionObserverMock.unobserve).mockClear()
    vi.mocked(IntersectionObserverMock.disconnect).mockClear()
  })

  it('renders initial count with prefix and suffix', () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, prefix: '$' },
    })

    expect(wrapper.find('.maz\\:sr-only').text()).toBe('$10')
  })

  it('updates count and triggers animation', () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, suffix: '%' },
    })

    expect(wrapper.find('.maz\\:sr-only').text()).toBe('10%')
  })

  it('respects delay prop', () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, delay: 200 },
    })

    expect(wrapper.text()).toBe('100')
  })

  it('animates the counter towards the target value over time', async () => {
    vi.useFakeTimers()
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 100, duration: 200, delay: 0 },
    })

    expect(wrapper.find('.m-animated-counter').text()).toContain('0')

    // Run the setTimeout(delay) callback then drive the rAF loop
    await vi.advanceTimersByTimeAsync(0)
    for (let i = 0; i < 30; i++)
      await vi.advanceTimersByTimeAsync(20)

    expect(wrapper.find('.m-animated-counter').text()).toContain('100')
    vi.useRealTimers()
  })

  it('animates from the previous value when count changes', async () => {
    vi.useFakeTimers()
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 10, duration: 100, delay: 0 },
    })
    await vi.advanceTimersByTimeAsync(0)
    for (let i = 0; i < 20; i++)
      await vi.advanceTimersByTimeAsync(20)
    expect(wrapper.find('.m-animated-counter').text()).toContain('10')

    await wrapper.setProps({ count: 20 })
    await vi.advanceTimersByTimeAsync(0)
    for (let i = 0; i < 20; i++)
      await vi.advanceTimersByTimeAsync(20)
    expect(wrapper.find('.m-animated-counter').text()).toContain('20')

    vi.useRealTimers()
  })

  it('does nothing when the count is set to the same value', async () => {
    vi.useFakeTimers()
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 5, delay: 0 },
    })
    await vi.advanceTimersByTimeAsync(0)
    for (let i = 0; i < 10; i++)
      await vi.advanceTimersByTimeAsync(20)
    const before = wrapper.find('.m-animated-counter').text()

    // Setting the same count value goes through the early return
    await wrapper.setProps({ count: 5 })
    expect(wrapper.find('.m-animated-counter').text()).toBe(before)
    vi.useRealTimers()
  })

  it('observes the element when once is false', () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 5, once: false },
    })
    expect(IntersectionObserver).toHaveBeenCalled()
    expect(IntersectionObserverMock.observe).toHaveBeenCalledWith(wrapper.find('.m-animated-counter').element)
  })

  it('does not register an observer when once is true', () => {
    shallowMount(MazAnimatedCounter, {
      props: { count: 5, once: true },
    })
    expect(IntersectionObserver).not.toHaveBeenCalled()
  })

  it('triggers the animation when the element scrolls into view (once=false)', async () => {
    vi.useFakeTimers()
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 50, once: false, duration: 100, delay: 0 },
    })
    const intersectionCallback = getLastIntersectionCallback()

    intersectionCallback(
      [{ target: wrapper.element, isIntersecting: true } as IntersectionObserverEntry],
      IntersectionObserverMock as unknown as IntersectionObserver,
    )
    await vi.advanceTimersByTimeAsync(0)
    for (let i = 0; i < 20; i++)
      await vi.advanceTimersByTimeAsync(20)

    expect(wrapper.find('.m-animated-counter').text()).toContain('50')
    vi.useRealTimers()
  })

  it('disconnects the observer on unmount', () => {
    const wrapper = shallowMount(MazAnimatedCounter, {
      props: { count: 5, once: false },
    })
    wrapper.unmount()
    expect(IntersectionObserverMock.disconnect).toHaveBeenCalled()
  })
})
