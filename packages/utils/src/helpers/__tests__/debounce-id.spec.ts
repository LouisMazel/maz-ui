import { debounceId } from '../debounceId'

describe('given debounceId function', () => {
  describe('when calling a debounced function multiple times', () => {
    it('then it should only execute once after the delay', async () => {
      vi.useFakeTimers()
      const mockFn = vi.fn().mockResolvedValue('result')
      const debouncedFn = debounceId('test', mockFn, 100)

      debouncedFn(1, 2, 3)
      debouncedFn(4, 5, 6)
      debouncedFn(7, 8, 9)

      expect(mockFn).not.toHaveBeenCalled()

      await vi.runAllTimersAsync()

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith(7, 8, 9)

      vi.useRealTimers()
    })
  })

  describe('when calling debounced functions with different identifiers', () => {
    it('then it should execute separately for each identifier', async () => {
      vi.useFakeTimers()
      const mockFn = vi.fn().mockResolvedValue('result')
      const debouncedFn = debounceId('id1', mockFn, 100)
      const debouncedFn2 = debounceId('id2', mockFn, 100)

      debouncedFn(1, 2, 3)
      debouncedFn2(4, 5, 6)

      await vi.runAllTimersAsync()

      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenNthCalledWith(1, 1, 2, 3)
      expect(mockFn).toHaveBeenNthCalledWith(2, 4, 5, 6)

      vi.useRealTimers()
    })
  })
})
