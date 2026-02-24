import { useTimer } from '@composables/useTimer'
import { withSetup } from '@tests/helpers/withSetup'

describe('given useTimer composable - extended', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when start is called with a custom timeout', () => {
    it('then it should override the default timeout', () => {
      const callback = vi.fn()
      const [{ start, remainingTime }, app] = withSetup(() =>
        useTimer({ timeout: 1000, callback, remainingTimeUpdate: 100 }),
      )

      start(500)
      expect(remainingTime.value).toBe(500)

      // Timer fires when remainingTime hits 0, then callback is in setTimeout(0)
      vi.advanceTimersByTime(600)
      expect(callback).toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('when reset is called', () => {
    it('then it should reset remaining time to the initial timeout', () => {
      const [{ start, reset, remainingTime }, app] = withSetup(() =>
        useTimer({ timeout: 1000, remainingTimeUpdate: 100 }),
      )

      start()
      vi.advanceTimersByTime(300)
      expect(remainingTime.value).toBeLessThan(1000)

      reset()
      expect(remainingTime.value).toBe(1000)

      app.unmount()
    })
  })

  describe('when resume is called while already running', () => {
    it('then it should not create a duplicate interval', () => {
      const callback = vi.fn()
      const [{ start, resume }, app] = withSetup(() =>
        useTimer({ timeout: 1000, callback, remainingTimeUpdate: 100 }),
      )

      start()
      vi.advanceTimersByTime(200)

      // Resume while already running should be a no-op (timerId is already set)
      resume()
      vi.advanceTimersByTime(900)

      // Callback should be called exactly once (extra time for setTimeout wrapper)
      expect(callback).toHaveBeenCalledTimes(1)

      app.unmount()
    })
  })

  describe('when resume is called after pause', () => {
    it('then it should continue from where it left off', () => {
      const callback = vi.fn()
      const [{ start, pause, resume, remainingTime }, app] = withSetup(() =>
        useTimer({ timeout: 1000, callback, remainingTimeUpdate: 100 }),
      )

      start()
      vi.advanceTimersByTime(300)
      const remainingAfterPause = remainingTime.value

      pause()
      vi.advanceTimersByTime(500) // should not affect remaining time

      expect(remainingTime.value).toBe(remainingAfterPause)

      resume()
      vi.advanceTimersByTime(800) // extra time for setTimeout wrapper

      expect(callback).toHaveBeenCalled()

      app.unmount()
    })
  })

  describe('when stop is called', () => {
    it('then it should reset remainingTime after callbackOffsetTime', () => {
      const [{ start, stop, remainingTime }, app] = withSetup(() =>
        useTimer({ timeout: 1000, remainingTimeUpdate: 100 }),
      )

      start()
      vi.advanceTimersByTime(300)
      expect(remainingTime.value).toBeLessThan(1000)

      stop()
      // stop() resets remainingTime after callbackOffsetTime * 2 = 0
      vi.advanceTimersByTime(1)
      expect(remainingTime.value).toBe(1000)

      app.unmount()
    })
  })

  describe('when pause is called without active timer', () => {
    it('then it should be a no-op', () => {
      const [{ pause }, app] = withSetup(() =>
        useTimer({ timeout: 1000 }),
      )

      expect(() => pause()).not.toThrow()
      app.unmount()
    })
  })

  describe('when callback is not provided', () => {
    it('then it should complete without error', () => {
      const [{ start }, app] = withSetup(() =>
        useTimer({ timeout: 500, remainingTimeUpdate: 100 }),
      )

      start()
      vi.advanceTimersByTime(600)

      // Should not throw
      app.unmount()
    })
  })

  describe('when using callbackOffsetTime', () => {
    it('then it should delay the callback', () => {
      const callback = vi.fn()
      const [{ start }, app] = withSetup(() =>
        useTimer({ timeout: 500, callback, remainingTimeUpdate: 100, callbackOffsetTime: 200 }),
      )

      start()
      vi.advanceTimersByTime(500)
      expect(callback).not.toHaveBeenCalled()

      vi.advanceTimersByTime(200)
      expect(callback).toHaveBeenCalled()

      app.unmount()
    })
  })
})
