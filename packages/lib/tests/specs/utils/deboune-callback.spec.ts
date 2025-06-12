import { debounceCallback } from '@utils/debounceCallback'

describe('@utils/debounceCallback', () => {
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
})
