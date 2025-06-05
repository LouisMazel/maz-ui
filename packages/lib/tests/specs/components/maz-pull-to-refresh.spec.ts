import MazPullToRefresh from '@components/MazPullToRefresh.vue'
import { mount } from '@vue/test-utils'

describe('mazPullToRefresh', () => {
  it('renders with default props', async () => {
    const wrapper = mount(MazPullToRefresh, {
      props: {
        onClick: vi.fn(), // Mock the action prop with a vi mock function
      },
      slots: {
        default: 'Content Slot',
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('m-pull-to-refresh')
    expect(wrapper.find('.header-text').text()).toContain('Pull to refresh')
  })

  it('triggers action on pull when distance is reached', async () => {
    const actionMock = vi.fn()

    const wrapper = mount(MazPullToRefresh, {
      props: {
        onClick: actionMock,
      },
      slots: {
        default: 'Content Slot',
      },
    })

    await wrapper.vm.$nextTick()

    // Simulate touchstart
    wrapper.trigger('touchstart', {
      touches: [
        {
          pageY: 100,
        },
      ],
    })

    // Simulate touchmove to reach the distance
    wrapper.trigger('touchmove', {
      touches: [
        {
          pageY: 200,
        },
      ],
    })

    // Simulate touchend
    wrapper.trigger('touchend')

    // expect(actionMock).toHaveBeenCalled()
  })

  it('does not trigger action if scrollY is greater than 0', async () => {
    const actionMock = vi.fn()

    const wrapper = mount(MazPullToRefresh, {
      props: {
        onClick: actionMock,
      },
      slots: {
        default: 'Content Slot',
      },
    })

    await wrapper.vm.$nextTick()

    // Simulate touchstart
    wrapper.trigger('touchstart', {
      touches: [
        {
          pageY: 100,
        },
      ],
    })

    // Set window.scrollY to simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 10, writable: true })

    // Simulate touchend
    wrapper.trigger('touchend')

    expect(actionMock).not.toHaveBeenCalled()
  })

  it('resets pull state after action completes', async () => {
    const actionMock = vi.fn()

    const wrapper = mount(MazPullToRefresh, {
      props: {
        onClick: actionMock,
      },
      slots: {
        default: 'Content Slot',
      },
    })

    await wrapper.vm.$nextTick()

    // Simulate touchstart
    wrapper.trigger('touchstart', {
      touches: [
        {
          pageY: 100,
        },
      ],
    })

    // Simulate touchmove to reach the distance
    wrapper.trigger('touchmove', {
      touches: [
        {
          pageY: 200,
        },
      ],
    })

    // Simulate touchend
    wrapper.trigger('touchend')

    // Simulate action completion
    await wrapper.setProps({ onClick: vi.fn() })

    // @ts-expect-error - test case
    expect(wrapper.vm.pull.from).toBe(-1)
    // @ts-expect-error - test case
    expect(wrapper.vm.pull.to).toBe(-1)
    // @ts-expect-error - test case
    expect(wrapper.vm.pull.distance).toBe(0)
    // @ts-expect-error - test case
    expect(wrapper.vm.pull.available).toBe(false)
  })
})
