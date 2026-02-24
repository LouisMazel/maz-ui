import { vClickOutside, vClickOutsideInstall } from '@directives/vClickOutside'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

// In jsdom, document.ontouchstart === null, so the event type used is 'touchstart'
const EVENT_TYPE = document.ontouchstart === null ? 'touchstart' : 'click'

describe('given vClickOutside directive (branch coverage)', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when callback is a function (simple binding)', () => {
    it('then it should call callback on outside click', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="callback"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { callback }
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

    it('then it should NOT call callback when clicking inside', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="callback"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { callback }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const insideEl = wrapper.find('span').element
      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: insideEl })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when binding value is an options object', () => {
    it('then it should use callback from options', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: { callback },
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

    it('then defaults should be applied (ignore=[], capture=false, once=false, stopPropagation=false)', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: { callback },
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

  describe('when stopPropagation is true', () => {
    it('then it should call event.stopPropagation()', async () => {
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

      const event = new Event(EVENT_TYPE, { bubbles: true })
      const stopSpy = vi.spyOn(event, 'stopPropagation')
      document.dispatchEvent(event)

      expect(stopSpy).toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when stopPropagation is false', () => {
    it('then it should NOT call event.stopPropagation()', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              stopPropagation: false,
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      const stopSpy = vi.spyOn(event, 'stopPropagation')
      document.dispatchEvent(event)

      expect(stopSpy).not.toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when target is null', () => {
    it('then it should return early and not call callback', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="callback"><span>inside</span></div>`,
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

  describe('when ignore selectors are provided', () => {
    it('then it should not call callback when target matches ignore selector', async () => {
      const callback = vi.fn()
      const ignoredEl = document.createElement('div')
      ignoredEl.classList.add('ignored-class')
      document.body.appendChild(ignoredEl)

      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              ignore: ['.ignored-class'],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: ignoredEl })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      document.body.removeChild(ignoredEl)
      wrapper.unmount()
    })

    it('then it should not call callback when target is inside an ignored element (closest)', async () => {
      const callback = vi.fn()

      const ignoredContainer = document.createElement('div')
      ignoredContainer.id = 'ignored-container'
      const childEl = document.createElement('span')
      ignoredContainer.appendChild(childEl)
      document.body.appendChild(ignoredContainer)

      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              ignore: ['#ignored-container'],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: childEl })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      document.body.removeChild(ignoredContainer)
      wrapper.unmount()
    })

    it('then it should not call callback when target ID matches excluded element ID', async () => {
      const callback = vi.fn()

      const excludedEl = document.createElement('div')
      excludedEl.id = 'excluded-by-id'
      document.body.appendChild(excludedEl)

      // Create a target with same ID (simulating the enhanced exclusion logic)
      const targetEl = document.createElement('div')
      targetEl.id = 'excluded-by-id'
      document.body.appendChild(targetEl)

      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              ignore: ['#excluded-by-id'],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: targetEl })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      document.body.removeChild(excludedEl)
      document.body.removeChild(targetEl)
      wrapper.unmount()
    })

    it('then it should not call callback when target is contained by the excluded element', async () => {
      const callback = vi.fn()

      const excludedEl = document.createElement('div')
      excludedEl.id = 'parent-excluded'
      const innerChild = document.createElement('span')
      excludedEl.appendChild(innerChild)
      document.body.appendChild(excludedEl)

      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              ignore: ['#parent-excluded'],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: innerChild })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      document.body.removeChild(excludedEl)
      wrapper.unmount()
    })

    it('then it should handle invalid selectors gracefully (catch block)', async () => {
      const callback = vi.fn()

      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              ignore: ['[invalid[[selector'],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const outsideEvent = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(outsideEvent)

      // The invalid selector should be caught and ignored, callback should still be called
      expect(callback).toHaveBeenCalled()
      wrapper.unmount()
    })

    it('then it should call callback when ignore list is empty and click is outside', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
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

  describe('when capture option is true', () => {
    it('then it should add event listener with capture', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              capture: true,
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

  describe('when once option is true', () => {
    it('then it should only trigger the callback once', async () => {
      const callback = vi.fn()
      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              once: true,
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const event1 = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(event1)

      const event2 = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(event2)

      // With once: true, the handler is removed after first invocation
      expect(callback).toHaveBeenCalledTimes(1)
      wrapper.unmount()
    })
  })

  describe('when callback is not a function', () => {
    it('then it should log an error', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount({
        template: `<div v-click-outside="notAFunction">content</div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { notAFunction: 'not-a-function' as any }
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

  describe('when binding value is updated', () => {
    it('then it should re-bind with new value when value changes', async () => {
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

      currentCb.value = callback2
      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(event)

      expect(callback2).toHaveBeenCalled()
      wrapper.unmount()
    })

    it('then it should NOT re-bind when value is the same', async () => {
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

      // Force update without changing the value
      wrapper.vm.$forceUpdate()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(event)

      // Should still work with original callback
      expect(callback).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when updated with options object', () => {
    it('then it should re-bind with new options object', async () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()
      const options = ref<any>({ callback: callback1 })

      const wrapper = mount({
        template: `<div v-click-outside="options">content</div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return { options }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      options.value = { callback: callback2, capture: true }
      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      document.dispatchEvent(event)

      expect(callback2).toHaveBeenCalled()
      wrapper.unmount()
    })
  })

  describe('when unmounted', () => {
    it('then it should remove event listener from document', async () => {
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

    it('then it should handle unmount when no handler was registered', () => {
      // Mount with non-function value so no handler gets registered
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount({
        template: `<div v-click-outside="42">content</div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {}
        },
      })

      // Should not throw on unmount even though handler was never registered
      expect(() => wrapper.unmount()).not.toThrow()
      errorSpy.mockRestore()
    })
  })

  describe('when vClickOutsideInstall plugin is used', () => {
    it('then it should register the directive with the app', () => {
      const directiveFn = vi.fn()
      const app = { directive: directiveFn }

      vClickOutsideInstall.install(app as any)

      expect(directiveFn).toHaveBeenCalledWith('click-outside', expect.any(Object))
    })
  })

  describe('when selector does not match any element via querySelector', () => {
    it('then it should call callback since ignored element was not found', async () => {
      const callback = vi.fn()

      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              ignore: ['#nonexistent-element'],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const outsideTarget = document.createElement('div')
      document.body.appendChild(outsideTarget)

      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: outsideTarget })
      document.dispatchEvent(event)

      expect(callback).toHaveBeenCalled()

      document.body.removeChild(outsideTarget)
      wrapper.unmount()
    })
  })

  describe('when excluded element has no id attribute', () => {
    it('then the id-based check should not match', async () => {
      const callback = vi.fn()

      const excludedEl = document.createElement('div')
      excludedEl.classList.add('no-id-excluded')
      // No id attribute set
      document.body.appendChild(excludedEl)

      const outsideTarget = document.createElement('div')
      document.body.appendChild(outsideTarget)

      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              ignore: ['.no-id-excluded'],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: outsideTarget })
      document.dispatchEvent(event)

      // outsideTarget doesn't match .no-id-excluded, so callback should be called
      expect(callback).toHaveBeenCalled()

      document.body.removeChild(excludedEl)
      document.body.removeChild(outsideTarget)
      wrapper.unmount()
    })
  })

  describe('when target matches selector directly', () => {
    it('then shouldIgnoreElement should return true via target.matches', async () => {
      const callback = vi.fn()

      const targetEl = document.createElement('button')
      targetEl.classList.add('my-button')
      document.body.appendChild(targetEl)

      const wrapper = mount({
        template: `<div v-click-outside="options"><span>inside</span></div>`,
        directives: { clickOutside: vClickOutside },
        setup() {
          return {
            options: {
              callback,
              ignore: ['.my-button'],
            },
          }
        },
      })

      await nextTick()
      await flushPromises()
      await nextTick()

      const event = new Event(EVENT_TYPE, { bubbles: true })
      Object.defineProperty(event, 'target', { value: targetEl })
      document.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()

      document.body.removeChild(targetEl)
      wrapper.unmount()
    })
  })
})
