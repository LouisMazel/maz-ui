import { debounce } from '../debounce.ts'

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

  describe('when cancel is called before the delay', () => {
    it('then the pending call is dropped', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('a')
      debouncedFn.cancel()
      vi.advanceTimersByTime(100)

      expect(mockFn).not.toHaveBeenCalled()
    })

    it('then a later call still runs', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('a')
      debouncedFn.cancel()
      debouncedFn('b')
      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledExactlyOnceWith('b')
    })
  })

  describe('when flush is called with a pending call', () => {
    it('then the last call runs immediately and only once', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn(1)
      debouncedFn(2)
      debouncedFn.flush()
      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledExactlyOnceWith(2)
    })
  })

  describe('when flush is called without a pending call', () => {
    it('then nothing runs', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn.flush()

      expect(mockFn).not.toHaveBeenCalled()
    })
  })

  describe('when the debounced function is a method', () => {
    it('then this is kept', () => {
      const target = {
        value: 3,
        read: debounce(function (this: { value: number }, spy: (value: number) => void) {
          spy(this.value)
        }, 10),
      }
      const spy = vi.fn()

      target.read(spy)
      vi.advanceTimersByTime(10)

      expect(spy).toHaveBeenCalledWith(3)
    })
  })
})
