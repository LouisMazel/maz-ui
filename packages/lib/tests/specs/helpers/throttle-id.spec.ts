import { throttleId } from '@modules/helpers/throttle-id'

describe('given throttleId function', () => {
  describe('when calling a throttled function multiple times within the interval', () => {
    it('then it should only execute once immediately and queue the next call', async () => {
      vi.useFakeTimers()

      const mockFn = vi.fn().mockResolvedValue('result')
      const throttledFn = throttleId(mockFn, 1000)

      throttledFn('test', 1)
      await vi.advanceTimersByTimeAsync(300)
      throttledFn('test', 2)
      await vi.advanceTimersByTimeAsync(300)
      throttledFn('test', 3)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith(1)

      await vi.advanceTimersByTimeAsync(1000)

      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenLastCalledWith(3)

      vi.useRealTimers()
    })
  })

  describe('when calling throttled functions with different identifiers', () => {
    it('then it should execute separately for each identifier', async () => {
      vi.useFakeTimers()
      const mockFn = vi.fn().mockResolvedValue('result')
      const throttledFn = throttleId(mockFn, 1000)

      throttledFn('id1', 1)
      throttledFn('id2', 2)

      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenNthCalledWith(1, 1)
      expect(mockFn).toHaveBeenNthCalledWith(2, 2)

      vi.useRealTimers()
    })
  })

  describe('when the throttled function throws an error', () => {
    it('then it should reject with the error', async () => {
      vi.useFakeTimers()
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))
      const throttledFn = throttleId(mockFn, 1000)

      await expect(throttledFn('test')).rejects.toThrow('Test error')

      vi.useRealTimers()
    })
  })
})
