import type { UsePullToRefreshOptions, UsePullToRefreshReturn } from '@composables/usePullToRefresh'
import { usePullToRefresh } from '@composables/usePullToRefresh'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

function fireTouch(target: EventTarget, type: string, points: Array<{ x: number, y: number }>) {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'touches', { value: points.map(({ x, y }) => ({ clientX: x, clientY: y })) })
  target.dispatchEvent(event)
  return event
}

function pull(target: EventTarget, deltaY: number, deltaX = 0) {
  fireTouch(target, 'touchstart', [{ x: 0, y: 0 }])
  fireTouch(target, 'touchmove', [{ x: deltaX / 2, y: deltaY / 2 }])
  return fireTouch(target, 'touchmove', [{ x: deltaX, y: deltaY }])
}

function release(target: EventTarget) {
  fireTouch(target, 'touchend', [])
}

function mountPull(options: Omit<UsePullToRefreshOptions, 'target'> = {}, withTarget = true) {
  const api = {} as UsePullToRefreshReturn
  const component = defineComponent({
    setup() {
      const target = ref<HTMLElement>()
      Object.assign(api, usePullToRefresh({ ...options, target: withTarget ? target : undefined }))
      return () => h('div', { ref: target, class: 'scroller' })
    },
  })
  const wrapper = mount(component, { attachTo: document.body })
  return { wrapper, api, target: wrapper.find('.scroller').element as HTMLElement }
}

describe('given the usePullToRefresh composable', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when the user pulls past the threshold and releases', () => {
    it('then it runs onRefresh and keeps the refreshing state for the minimum duration', async () => {
      const onRefresh = vi.fn().mockResolvedValue('done')
      const { wrapper, api, target } = mountPull({ onRefresh })

      pull(target, 200)
      expect(api.isReady.value).toBe(true)
      expect(api.isPulling.value).toBe(true)
      release(target)
      await nextTick()

      expect(onRefresh).toHaveBeenCalledOnce()
      expect(api.isRefreshing.value).toBe(true)
      expect(api.distance.value).toBe(80)

      await vi.advanceTimersByTimeAsync(400)

      expect(api.isRefreshing.value).toBe(false)
      expect(api.distance.value).toBe(0)
      wrapper.unmount()
    })
  })

  describe('when the user releases before the threshold', () => {
    it('then nothing is refreshed and the indicator goes back', async () => {
      const onRefresh = vi.fn()
      const { wrapper, api, target } = mountPull({ onRefresh })

      pull(target, 100)
      expect(api.distance.value).toBe(50)
      expect(api.progress.value).toBeCloseTo(0.625)
      release(target)
      await nextTick()

      expect(onRefresh).not.toHaveBeenCalled()
      expect(api.distance.value).toBe(0)
      wrapper.unmount()
    })
  })

  describe('when the pull goes beyond the threshold', () => {
    it('then the distance follows a rubber band below the max distance', () => {
      const { wrapper, api, target } = mountPull({ threshold: 80, maxDistance: 120 })

      pull(target, 1000)

      expect(api.distance.value).toBeGreaterThan(80)
      expect(api.distance.value).toBeLessThan(120)
      wrapper.unmount()
    })
  })

  describe('when the scroll container is not at the top', () => {
    it('then the gesture is a normal scroll', () => {
      const { wrapper, api, target } = mountPull({ onRefresh: vi.fn() })
      target.scrollTop = 50

      const event = pull(target, 200)

      expect(api.distance.value).toBe(0)
      expect(event.defaultPrevented).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when the user swipes horizontally', () => {
    it('then the pull is cancelled', () => {
      const { wrapper, api, target } = mountPull({ onRefresh: vi.fn() })

      pull(target, 40, 200)

      expect(api.distance.value).toBe(0)
      expect(api.isPulling.value).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when the user pulls down at the top', () => {
    it('then the native scroll and bounce are prevented', () => {
      const { wrapper, target } = mountPull({ onRefresh: vi.fn() })

      const event = pull(target, 100)

      expect(event.defaultPrevented).toBe(true)
      wrapper.unmount()
    })
  })

  describe('when the gesture uses two fingers', () => {
    it('then it is ignored', () => {
      const { wrapper, api, target } = mountPull({ onRefresh: vi.fn() })

      fireTouch(target, 'touchstart', [{ x: 0, y: 0 }, { x: 50, y: 0 }])
      fireTouch(target, 'touchmove', [{ x: 0, y: 200 }, { x: 50, y: 200 }])

      expect(api.distance.value).toBe(0)
      wrapper.unmount()
    })
  })

  describe('when it is disabled', () => {
    it('then the gesture is ignored', () => {
      const onRefresh = vi.fn()
      const { wrapper, api, target } = mountPull({ onRefresh, disabled: true })

      pull(target, 200)
      release(target)

      expect(api.distance.value).toBe(0)
      expect(onRefresh).not.toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when onRefresh rejects', () => {
    it('then the error is exposed and onError is called', async () => {
      const failure = new Error('network')
      const onError = vi.fn()
      const { wrapper, api } = mountPull({ onRefresh: vi.fn().mockRejectedValue(failure), onError })

      const done = api.refresh()
      await vi.advanceTimersByTimeAsync(400)
      await done

      expect(onError).toHaveBeenCalledWith(failure)
      expect(api.error.value).toBe(failure)
      expect(api.isRefreshing.value).toBe(false)
      wrapper.unmount()
    })
  })

  describe('when refresh is called while refreshing', () => {
    it('then onRefresh runs only once', async () => {
      const onRefresh = vi.fn().mockResolvedValue(undefined)
      const { wrapper, api } = mountPull({ onRefresh })

      const first = api.refresh()
      const second = api.refresh()
      await vi.advanceTimersByTimeAsync(400)
      await Promise.all([first, second])

      expect(onRefresh).toHaveBeenCalledOnce()
      wrapper.unmount()
    })
  })

  describe('when the threshold is reached on a device that vibrates', () => {
    it('then it vibrates once per crossing', () => {
      const vibrate = vi.fn()
      Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true })
      const { wrapper, target } = mountPull({ onRefresh: vi.fn() })

      pull(target, 200)
      fireTouch(target, 'touchmove', [{ x: 0, y: 220 }])

      expect(vibrate).toHaveBeenCalledOnce()
      wrapper.unmount()
      Reflect.deleteProperty(navigator, 'vibrate')
    })
  })

  describe('when haptic feedback is disabled', () => {
    it('then it does not vibrate', () => {
      const vibrate = vi.fn()
      Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true })
      const { wrapper, target } = mountPull({ onRefresh: vi.fn(), haptic: false })

      pull(target, 200)

      expect(vibrate).not.toHaveBeenCalled()
      wrapper.unmount()
      Reflect.deleteProperty(navigator, 'vibrate')
    })
  })

  describe('when no target is given', () => {
    it('then it listens on the window and reads its scroll position', async () => {
      const onRefresh = vi.fn()
      const { wrapper, api } = mountPull({ onRefresh }, false)

      pull(globalThis, 200)
      release(globalThis)
      await nextTick()

      expect(api.isRefreshing.value).toBe(true)
      expect(onRefresh).toHaveBeenCalledOnce()
      await vi.advanceTimersByTimeAsync(400)
      wrapper.unmount()
    })
  })

  describe('when stop is called', () => {
    it('then the gesture is no longer tracked', () => {
      const { wrapper, api, target } = mountPull({ onRefresh: vi.fn() })

      api.stop()
      pull(target, 200)

      expect(api.distance.value).toBe(0)
      wrapper.unmount()
    })
  })

  describe('when it is used outside of a component', () => {
    it('then it starts listening right away', () => {
      const target = document.createElement('div')
      const api = usePullToRefresh({ target })

      pull(target, 100)

      expect(api.distance.value).toBe(50)
      api.stop()
    })
  })
})
