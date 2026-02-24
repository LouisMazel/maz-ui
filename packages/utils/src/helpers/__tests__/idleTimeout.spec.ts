import { IdleTimeout } from '../idleTimeout'

describe('given IdleTimeout class', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when creating a new instance with default options', () => {
    it('then it should start and call callback with isIdle false', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback)

      expect(callback).toHaveBeenCalledWith({ isIdle: false, instance })
    })

    it('then it should become idle after default timeout (5 min)', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback)
      expect(instance).toBeDefined()

      vi.advanceTimersByTime(5 * 60 * 1000)

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({ isIdle: true }))
    })
  })

  describe('when creating with custom timeout', () => {
    it('then it should become idle after the specified timeout', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })
      expect(instance).toBeDefined()

      vi.advanceTimersByTime(1000)

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({ isIdle: true }))
    })
  })

  describe('when immediate is false', () => {
    it('then it should not call callback on start', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { immediate: false })
      expect(instance).toBeDefined()

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('when once option is true', () => {
    it('then it should destroy after first timeout', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000, once: true })

      vi.advanceTimersByTime(1000)

      expect(instance.destroyed).toBe(true)
    })
  })

  describe('when pause is called', () => {
    it('then it should stop the timeout', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })

      vi.advanceTimersByTime(500)
      instance.pause()

      vi.advanceTimersByTime(1000)

      const idleCalls = callback.mock.calls.filter(
        ([arg]) => arg.isIdle === true,
      )
      expect(idleCalls).toHaveLength(0)
    })
  })

  describe('when resume is called after pause', () => {
    it('then it should continue the timeout with remaining time', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })

      vi.advanceTimersByTime(500)
      instance.pause()
      instance.resume()

      vi.advanceTimersByTime(600)

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({ isIdle: true }))
    })
  })

  describe('when resume is called without prior pause', () => {
    it('then it should do nothing', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000, immediate: false })

      callback.mockClear()
      instance.resume()

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('when pause is called after timeout already expired', () => {
    it('then it should do nothing', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })

      vi.advanceTimersByTime(1500)
      instance.pause()

      expect(instance.idle).toBe(true)
    })
  })

  describe('when reset is called', () => {
    it('then it should reset idle state and restart timeout', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })

      vi.advanceTimersByTime(1000)
      expect(instance.idle).toBe(true)

      instance.reset()
      expect(instance.idle).toBe(false)

      vi.advanceTimersByTime(1000)
      expect(instance.idle).toBe(true)
    })
  })

  describe('when destroy is called', () => {
    it('then it should mark instance as destroyed', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })

      instance.destroy()
      expect(instance.destroyed).toBe(true)
    })
  })

  describe('when user events occur', () => {
    it('then it should reset the timeout on mouse events', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })
      expect(instance).toBeDefined()

      vi.advanceTimersByTime(900)

      document.body.dispatchEvent(new MouseEvent('mousedown'))

      vi.advanceTimersByTime(500)

      const idleCalls = callback.mock.calls.filter(
        ([arg]) => arg.isIdle === true,
      )
      expect(idleCalls).toHaveLength(0)
    })

    it('then it should handle mousemove with position tracking', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })
      expect(instance).toBeDefined()

      document.body.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }))

      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ isIdle: false, eventType: 'mousemove' }),
      )
    })

    it('then it should ignore mousemove with same coordinates', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })
      expect(instance).toBeDefined()

      callback.mockClear()

      document.body.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }))
      const callCountAfterFirst = callback.mock.calls.length

      document.body.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }))
      const callCountAfterSecond = callback.mock.calls.length

      expect(callCountAfterSecond).toBe(callCountAfterFirst)
    })
  })

  describe('when setting idle via setter', () => {
    it('then setting idle to true should trigger handleTimeout', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 10000 })

      instance.idle = true

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({ isIdle: true }))
    })

    it('then setting idle to false should trigger reset', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 10000 })

      instance.idle = true
      instance.idle = false

      expect(instance.idle).toBe(false)
    })
  })

  describe('when accessing timeout getter/setter', () => {
    it('then it should return and update the timeout value', () => {
      const callback = vi.fn()
      const instance = new IdleTimeout(callback, { timeout: 1000 })

      expect(instance.timeout).toBe(1000)

      instance.timeout = 2000
      expect(instance.timeout).toBe(2000)
    })
  })
})
