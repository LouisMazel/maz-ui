import { debounceCallback } from '../debounceCallback.ts'

describe('debounceCallback.ts', () => {
  it('delaying Callback Execution', () => {
    vi.useFakeTimers()

    const fakeCallback1 = vi.fn()

    debounceCallback(fakeCallback1, 1000)

    expect(fakeCallback1).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1000)

    expect(fakeCallback1).toHaveBeenCalledTimes(1)
  })

  it('cancel Previous Callbacks', () => {
    vi.useFakeTimers()

    const fakeCallback2 = vi.fn()

    debounceCallback(fakeCallback2, 1000)

    vi.advanceTimersByTime(750)

    debounceCallback(fakeCallback2, 1000)

    vi.advanceTimersByTime(750)

    expect(fakeCallback2).not.toHaveBeenCalled()
  })

  it('then it returns a function that cancels the pending callback', () => {
    vi.useFakeTimers()

    const callback = vi.fn()
    const cancel = debounceCallback(callback, 1000)

    cancel()
    vi.advanceTimersByTime(1000)

    expect(callback).not.toHaveBeenCalled()
  })

  it('then it keeps the latest callback when a stale cancel is called', () => {
    vi.useFakeTimers()

    const first = vi.fn()
    const second = vi.fn()
    const cancelFirst = debounceCallback(first, 1000)
    debounceCallback(second, 1000)

    cancelFirst()
    vi.advanceTimersByTime(1000)

    expect(second).toHaveBeenCalledTimes(1)
  })
})
