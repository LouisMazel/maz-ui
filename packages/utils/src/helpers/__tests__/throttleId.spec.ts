import { throttleId } from '../throttleId'

describe('given throttleId function', () => {
  describe('when calling a throttled function multiple times within the interval', () => {
    it('then it should only execute once immediately and queue the next call', async () => {
      vi.useFakeTimers()

      const mockFn = vi.fn().mockResolvedValue('result')
      const throttledFn = throttleId('test', mockFn, 1000)

      throttledFn(1)
      await vi.advanceTimersByTimeAsync(300)
      throttledFn(2)
      await vi.advanceTimersByTimeAsync(300)
      throttledFn(3)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith(1)

      await vi.advanceTimersByTimeAsync(1000)

      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenLastCalledWith(3)

      vi.useRealTimers()
    })
  })

  describe('when calling throttled functions with different identifiers', () => {
    it('then it should execute separately for each identifier', () => {
      vi.useFakeTimers()
      const mockFn = vi.fn().mockResolvedValue('result')
      const throttledFn = throttleId('id1', mockFn, 1000)
      const throttledFn2 = throttleId('id2', mockFn, 1000)

      throttledFn(1)
      throttledFn2(2)

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
      const throttledFn = throttleId('test', mockFn, 1000)

      await expect(throttledFn()).rejects.toThrow('Test error')

      vi.useRealTimers()
    })
  })
})
