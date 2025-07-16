import { throttle } from '../throttle'

describe('given throttle function', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when calling the throttled function for the first time', () => {
    it('then it should call the original function immediately', () => {
      const func = vi.fn()
      const throttled = throttle(func, 1000)
      throttled()
      expect(func).toHaveBeenCalledTimes(1)
    })
  })

  describe('when calling the throttled function multiple times within the time limit', () => {
    it('then it should not call the original function more than once', () => {
      const func = vi.fn()
      const throttled = throttle(func, 1000)
      throttled()
      throttled()
      throttled()
      expect(func).toHaveBeenCalledTimes(1)
      vi.advanceTimersByTime(1001)
      expect(func).toHaveBeenCalledTimes(2)
    })
  })

  describe('when calling the throttled function after the time limit has elapsed', () => {
    it('then it should call the original function again', () => {
      const func = vi.fn()
      const throttled = throttle(func, 500)
      throttled()
      vi.advanceTimersByTime(2000)
      throttled()
      vi.advanceTimersByTime(500)
      expect(func).toHaveBeenCalledTimes(2)
    })
  })

  describe('when calling the throttled function with arguments', () => {
    it('then it should pass the arguments to the original function', () => {
      const func = vi.fn()
      const throttled = throttle(func, 1000)
      throttled(1, 'test')
      expect(func).toHaveBeenCalledWith(1, 'test')
    })
  })

  describe('when calling the throttled function with a specific context', () => {
    it('then it should preserve the context', () => {
      const obj = {
        value: 0,
        func: vi.fn(function (this: any) { this.value++ }),
      }
      const throttled = throttle(obj.func, 1000)
      throttled.call(obj)
      expect(obj.value).toBe(1)
    })
  })

  describe('when calling the throttled function repeatedly', () => {
    it('then it should cancel the previous timeout', () => {
      const func = vi.fn()
      const throttled = throttle(func, 1000)
      throttled()
      vi.advanceTimersByTime(200)
      throttled()
      vi.advanceTimersByTime(500)
      throttled()
      vi.advanceTimersByTime(1000)
      expect(func).toHaveBeenCalledTimes(2)
    })
  })
})
