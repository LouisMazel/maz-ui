import type { VueWrapper } from '@vue/test-utils'
import MazPullToRefresh from '@components/MazPullToRefresh.vue'
import { mount } from '@vue/test-utils'

function createTouchEvent(type: string, pageY: number): TouchEvent {
  const touch = { pageY, identifier: 0, target: document.body } as unknown as Touch

  return new TouchEvent(type, {
    touches: type === 'touchend' ? [] as unknown as Touch[] : [touch],
    bubbles: true,
    cancelable: true,
  })
}

function createTouchEventWithItemSupport(type: string, pageY: number): TouchEvent {
  const event = createTouchEvent(type, pageY)
  const touch = { pageY, identifier: 0, target: document.body } as unknown as Touch
  Object.defineProperty(event, 'touches', {
    value: {
      length: type === 'touchend' ? 0 : 1,
      item: (index: number) => (index === 0 && type !== 'touchend' ? touch : null),
      0: type === 'touchend' ? undefined : touch,
    },
  })
  return event
}

function dispatchTouch(type: string, pageY = 0) {
  const event = createTouchEventWithItemSupport(type, pageY)
  document.body.dispatchEvent(event)
}

describe('mazPullToRefresh', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'scrollY', { value: 0, writable: true, configurable: true })
    document.body.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 0,
      height: 800,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
    })
    Object.defineProperty(globalThis, 'innerHeight', { value: 800, writable: true, configurable: true })
  })

  it('renders with default props', async () => {
    const wrapper = mount(MazPullToRefresh, {
      props: {
        onClick: vi.fn(),
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

  describe('Given the component is rendered with an onClick handler', () => {
    let wrapper: VueWrapper
    let actionMock: ReturnType<typeof vi.fn>

    beforeEach(async () => {
      actionMock = vi.fn().mockResolvedValue('response-data')
      wrapper = mount(MazPullToRefresh, {
        props: {
          onClick: actionMock as unknown as () => Promise<void>,
          distance: 100,
        },
        slots: {
          default: 'Content Slot',
        },
      })
      await wrapper.vm.$nextTick()
    })

    afterEach(() => {
      wrapper.unmount()
    })

    describe('When a full pull-to-refresh gesture is performed', () => {
      it('calls the onClick handler and emits start, loaded, response, finish events', async () => {
        dispatchTouch('touchstart', 50)
        dispatchTouch('touchmove', 200)
        dispatchTouch('touchend')

        await vi.waitFor(() => {
          expect(actionMock).toHaveBeenCalledOnce()
        })

        expect(wrapper.emitted('start')).toHaveLength(1)
        expect(wrapper.emitted('loaded')).toHaveLength(1)
        expect(wrapper.emitted('response')?.[0]).toEqual(['response-data'])
        expect(wrapper.emitted('finish')).toHaveLength(1)
      })
    })

    describe('When the pull distance is not reached', () => {
      it('does not call onClick', async () => {
        dispatchTouch('touchstart', 50)
        dispatchTouch('touchmove', 80)
        dispatchTouch('touchend')

        await wrapper.vm.$nextTick()

        expect(actionMock).not.toHaveBeenCalled()
      })
    })

    describe('When scrollY is greater than 0 during touchmove', () => {
      it('does not trigger the action', async () => {
        dispatchTouch('touchstart', 50)
        Object.defineProperty(globalThis, 'scrollY', { value: 10, writable: true, configurable: true })
        dispatchTouch('touchmove', 200)
        dispatchTouch('touchend')

        await wrapper.vm.$nextTick()

        expect(actionMock).not.toHaveBeenCalled()
      })
    })

    describe('When the touch moves upward (negative distance)', () => {
      it('does not trigger the action', async () => {
        dispatchTouch('touchstart', 200)
        dispatchTouch('touchmove', 50)
        dispatchTouch('touchend')

        await wrapper.vm.$nextTick()

        expect(actionMock).not.toHaveBeenCalled()
      })
    })

    describe('When scrollY is greater than 0 during touchend', () => {
      it('does not run the action', async () => {
        dispatchTouch('touchstart', 50)
        dispatchTouch('touchmove', 200)
        Object.defineProperty(globalThis, 'scrollY', { value: 10, writable: true, configurable: true })
        dispatchTouch('touchend')

        await wrapper.vm.$nextTick()

        expect(actionMock).not.toHaveBeenCalled()
      })
    })
  })

  describe('Given the component is disabled', () => {
    describe('When rendered with disabled prop set to true', () => {
      it('does not render the loading header', async () => {
        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: vi.fn(),
            disabled: true,
          },
          slots: {
            default: 'Content Slot',
          },
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.loading-header').exists()).toBe(false)
        wrapper.unmount()
      })
    })

    describe('When rendered without onClick', () => {
      it('does not render the loading header', async () => {
        const wrapper = mount(MazPullToRefresh, {
          slots: {
            default: 'Content Slot',
          },
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.loading-header').exists()).toBe(false)
        wrapper.unmount()
      })
    })
  })

  describe('Given the component is rendered and then disabled', () => {
    describe('When the disabled prop changes from false to true', () => {
      it('hides the loading header', async () => {
        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: vi.fn(),
            disabled: false,
          },
          slots: {
            default: 'Content Slot',
          },
        })

        await wrapper.vm.$nextTick()
        expect(wrapper.find('.loading-header').exists()).toBe(true)

        await wrapper.setProps({ disabled: true })
        await wrapper.vm.$nextTick()

        expect(wrapper.find('.loading-header').exists()).toBe(false)

        wrapper.unmount()
      })
    })
  })

  describe('Given the component uses a containerSelector', () => {
    describe('When the container element exists', () => {
      it('attaches events to that container', async () => {
        const container = document.createElement('div')
        container.id = 'test-container'
        container.getBoundingClientRect = vi.fn().mockReturnValue({
          top: 0,
          height: 800,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
        })
        document.body.appendChild(container)

        const addSpy = vi.spyOn(container, 'addEventListener')

        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: vi.fn(),
            containerSelector: '#test-container',
          },
          slots: {
            default: 'Content',
          },
        })

        await wrapper.vm.$nextTick()

        expect(addSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))
        expect(addSpy).toHaveBeenCalledWith('touchmove', expect.any(Function))
        expect(addSpy).toHaveBeenCalledWith('touchend', expect.any(Function))

        addSpy.mockRestore()
        wrapper.unmount()
        document.body.removeChild(container)
      })
    })
  })

  describe('Given a pull gesture exceeds the distance threshold', () => {
    describe('When pullHeight is computed', () => {
      it('caps the pull height at the distance value', async () => {
        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: vi.fn().mockResolvedValue(undefined),
            distance: 50,
          },
          slots: {
            default: 'Content',
          },
        })

        await wrapper.vm.$nextTick()

        dispatchTouch('touchstart', 10)
        dispatchTouch('touchmove', 200)

        await wrapper.vm.$nextTick()

        const header = wrapper.find('.loading-header')
        expect(header.attributes('style')).toContain('height: 50px')

        dispatchTouch('touchend')
        await vi.waitFor(() => {
          expect(wrapper.emitted('finish')).toHaveLength(1)
        })

        wrapper.unmount()
      })
    })
  })

  describe('Given the component is unmounted', () => {
    describe('When unmount occurs', () => {
      it('removes event listeners from the container', async () => {
        const removeSpy = vi.spyOn(document.body, 'removeEventListener')

        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: vi.fn(),
          },
          slots: {
            default: 'Content',
          },
        })

        await wrapper.vm.$nextTick()
        wrapper.unmount()

        expect(removeSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))
        expect(removeSpy).toHaveBeenCalledWith('touchmove', expect.any(Function))
        expect(removeSpy).toHaveBeenCalledWith('touchend', expect.any(Function))

        removeSpy.mockRestore()
      })
    })
  })

  describe('Given the component has custom slots', () => {
    describe('When pull-before slot is provided', () => {
      it('renders the custom pull-before content', async () => {
        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: vi.fn(),
          },
          slots: {
            'default': 'Content',
            'pull-before': '<span class="custom-before">Custom pull text</span>',
          },
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.custom-before').text()).toBe('Custom pull text')

        wrapper.unmount()
      })
    })
  })

  describe('Given headerClass prop is provided', () => {
    describe('When the component renders', () => {
      it('applies the headerClass to the loading-header element', async () => {
        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: vi.fn(),
            headerClass: 'my-custom-header',
          },
          slots: {
            default: 'Content',
          },
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.loading-header').classes()).toContain('my-custom-header')

        wrapper.unmount()
      })
    })
  })

  describe('Given loading is in progress', () => {
    describe('When a new touch gesture starts', () => {
      it('ignores the touch events', async () => {
        const actionMock = vi.fn().mockReturnValue(new Promise(() => {}))

        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: actionMock,
            distance: 100,
          },
          slots: {
            default: 'Content',
          },
        })

        await wrapper.vm.$nextTick()

        dispatchTouch('touchstart', 50)
        dispatchTouch('touchmove', 200)
        dispatchTouch('touchend')

        await wrapper.vm.$nextTick()

        expect(actionMock).toHaveBeenCalledOnce()

        dispatchTouch('touchstart', 50)
        dispatchTouch('touchmove', 200)
        dispatchTouch('touchend')

        await wrapper.vm.$nextTick()

        expect(actionMock).toHaveBeenCalledOnce()

        wrapper.unmount()
      })
    })
  })

  describe('Given the component becomes enabled after being disabled', () => {
    describe('When disabled prop changes from true to false', () => {
      it('attaches event listeners to the container', async () => {
        const addSpy = vi.spyOn(document.body, 'addEventListener')

        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: vi.fn(),
            disabled: true,
          },
          slots: {
            default: 'Content',
          },
        })

        await wrapper.vm.$nextTick()

        addSpy.mockClear()

        await wrapper.setProps({ disabled: false })
        await wrapper.vm.$nextTick()

        expect(addSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))
        expect(addSpy).toHaveBeenCalledWith('touchmove', expect.any(Function))
        expect(addSpy).toHaveBeenCalledWith('touchend', expect.any(Function))

        addSpy.mockRestore()
        wrapper.unmount()
      })
    })
  })

  describe('Given the offset prop is provided', () => {
    describe('When the component initializes', () => {
      it('renders without errors', async () => {
        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: vi.fn(),
            offset: 50,
          },
          slots: {
            default: 'Content',
          },
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.exists()).toBe(true)

        wrapper.unmount()
      })
    })
  })

  describe('Given a touchstart occurs with negative margins', () => {
    describe('When both top and bottom margins are negative', () => {
      it('ignores the touch event', async () => {
        document.body.getBoundingClientRect = vi.fn().mockReturnValue({
          top: -200,
          height: 1000,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
        })
        Object.defineProperty(globalThis, 'innerHeight', { value: 50, writable: true, configurable: true })

        const actionMock = vi.fn().mockResolvedValue(undefined)

        const wrapper = mount(MazPullToRefresh, {
          props: {
            onClick: actionMock,
            distance: 100,
          },
          slots: {
            default: 'Content',
          },
        })

        await wrapper.vm.$nextTick()

        dispatchTouch('touchstart', 50)
        dispatchTouch('touchmove', 200)
        dispatchTouch('touchend')

        await wrapper.vm.$nextTick()

        expect(actionMock).not.toHaveBeenCalled()

        wrapper.unmount()
      })
    })
  })
})
