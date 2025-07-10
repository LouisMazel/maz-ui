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
      const start = Date.now()
      await sleep(0)
      const end = Date.now()

      expect(end - start).toBeLessThan(5) // Allow for small timing discrepancies
    })
  })
})
