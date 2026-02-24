import { debounce } from '../debounce'

describe('given debounce function', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('when calling a debounced function multiple times', () => {
    it('then it should only execute once after the delay', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('when calling with arguments', () => {
    it('then it should pass the last call arguments', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 50)

      debouncedFn(1)
      debouncedFn(2)
      debouncedFn(3)

      vi.advanceTimersByTime(50)

      expect(mockFn).toHaveBeenCalledWith(3)
    })
  })

  describe('when enough time passes between calls', () => {
    it('then it should execute each call separately', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 50)

      debouncedFn(1)
      vi.advanceTimersByTime(50)

      debouncedFn(2)
      vi.advanceTimersByTime(50)

      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenNthCalledWith(1, 1)
      expect(mockFn).toHaveBeenNthCalledWith(2, 2)
    })
  })
})
