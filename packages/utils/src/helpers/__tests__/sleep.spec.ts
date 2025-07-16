import { sleep } from '../sleep'

describe('given sleep function', () => {
  describe('when called with a duration', () => {
    it('then it should resolve after the specified duration', async () => {
      vi.useFakeTimers()
      const duration = 1000
      const promise = sleep(duration)

      expect(vi.getTimerCount()).toBe(1)

      vi.advanceTimersByTime(duration)
      await promise

      expect(vi.getTimerCount()).toBe(0)
      vi.useRealTimers()
    })
  })

  describe('when called with zero duration', () => {
    it('then it should resolve immediately', async () => {
      vi.useFakeTimers()
      const promise = sleep(0)

      expect(vi.getTimerCount()).toBe(1)

      vi.advanceTimersByTime(0)
      await promise

      expect(vi.getTimerCount()).toBe(0)
      vi.useRealTimers()
    })
  })
})
