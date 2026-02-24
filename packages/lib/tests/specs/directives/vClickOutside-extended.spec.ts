import { vClickOutside, vClickOutsideInstall } from '@directives/vClickOutside'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// In jsdom, document.ontouchstart === null, so the event type used is 'touchstart'
const EVENT_TYPE = document.ontouchstart === null ? 'touchstart' : 'click'

describe('given vClickOutside directive - extended', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when mounted with a function value', () => {
    it('then it should call the callback on outside click', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="callback"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { callback }
        },
      })

      // Wait for async onMounted which has await nextTick() inside
      await nextTick()
      await flushPromises()
      await nextTick()

      const outsideEvent = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(outsideEvent)

      expect(callback).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when mounted with an options object', () => {
    it('then it should register with callback from options', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              capture: true,
              once: false,
              stopPropagation: false,
              ignore: [],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const outsideEvent = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(outsideEvent)

      expect(callback).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when mounted with stopPropagation option', () => {
    it('then it should call the callback with the event', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              stopPropagation: true,
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const outsideEvent = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(outsideEvent)

      expect(callback).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when mounted with ignore selectors', () => {
    it('then it should not call callback for ignored elements', async () => {
      const callback = vi.fn()
      const ignoredEl = document.createElement('div')
      ignoredEl.id = 'ignored-element'
      document.body.appendChild(ignoredEl)

      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              ignore: ['#ignored-element'],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      // Click the ignored element
      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: ignoredEl })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      document.body.removeChild(ignoredEl)
      wrapper.unmount()
    })
  })

  describe('when the binding value is updated', () => {
    it('then it should re-bind the handler with new value', async () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()
      const currentCb = ref(callback1)
      const wrapper = mount({
        template: `<div v-click-outside="currentCb">content</div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { currentCb }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      // Update the binding
      currentCb.value = callback2
      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(event)

      expect(callback2).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when the binding value is the same on update', () => {
    it('then it should not re-bind', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="callback">content</div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { callback }
        },
      })

      await nextTick()

      wrapper.vm.$forceUpdate()
      await nextTick()

      wrapper.unmount()
    })
  })

  describe('when unmounted', () => {
    it('then it should remove the event handler', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="callback">content</div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { callback }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      wrapper.unmount()

      callback.mockClear()
      const event = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('when the callback is not a function', () => {
    it('then it should log an error', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount({
        template: `<div v-click-outside="notAFunction">content</div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { notAFunction: 'not a function' }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      expect(errorSpy).toHaveBeenCalled()
      errorSpy.mockRestore()
      wrapper.unmount()
    })
  })

  describe('when using vClickOutsideInstall plugin', () => {
    it('then it should register the directive', () => {
      const app = {
        directive: vi.fn(),
      }
      vClickOutsideInstall.install(app as any)
      expect(app.directive).toHaveBeenCalledWith('click-outside', expect.any(Object))
    })
  })

  describe('when click target is null', () => {
    it('then it should not call callback', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="callback">content</div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { callback }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: null })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
      wrapper.unmount()
    })
  })
})
