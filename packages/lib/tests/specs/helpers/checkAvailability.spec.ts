import { checkAvailability } from '@helpers/checkAvailability'

describe('given checkAvailability helper', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should call the callback immediately when ref is available', () => {
    const mockRef = { value: 'test' }
    const mockGetRef = vi.fn(() => mockRef)
    const mockCallback = vi.fn()

    checkAvailability(mockGetRef, mockCallback)

    expect(mockGetRef).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith(mockRef)
  })

  it('should retry until ref is available', () => {
    const mockRef = { value: 'test' }
    const mockGetRef = vi.fn().mockReturnValueOnce(null).mockReturnValueOnce(null).mockReturnValue(mockRef)
    const mockCallback = vi.fn()

    checkAvailability(mockGetRef, mockCallback)

    expect(mockGetRef).toHaveBeenCalledTimes(1)
    expect(mockCallback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(mockGetRef).toHaveBeenCalledTimes(2)
    expect(mockCallback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(mockGetRef).toHaveBeenCalledTimes(3)
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith(mockRef)
  })

  it('should stop retrying after max attempts', () => {
    const mockGetRef = vi.fn(() => null)
    const mockCallback = vi.fn()
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    checkAvailability(mockGetRef, mockCallback, { maxAttempts: 5, interval: 50 })

    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(50)
    }

    expect(mockGetRef).toHaveBeenCalledTimes(6) // Initial + 5 retries
    expect(mockCallback).not.toHaveBeenCalled()
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('5 attempts'))
  })

  it('should use custom error message when provided', () => {
    const mockGetRef = vi.fn(() => null)
    const mockCallback = vi.fn()
    const customErrorMessage = 'Custom error message'
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    checkAvailability(mockGetRef, mockCallback, { maxAttempts: 3, errorMessage: customErrorMessage })

    for (let i = 0; i < 3; i++) {
      vi.advanceTimersByTime(100)
    }

    expect(consoleWarnSpy).toHaveBeenCalledWith(customErrorMessage)
  })

  it('should use default values when options are not provided', () => {
    const mockGetRef = vi.fn(() => null)
    const mockCallback = vi.fn()
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    checkAvailability(mockGetRef, mockCallback)

    for (let i = 0; i < 20; i++) {
      vi.advanceTimersByTime(100)
    }

    expect(mockGetRef).toHaveBeenCalledTimes(21) // Initial + 20 retries
    expect(mockCallback).not.toHaveBeenCalled()
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('20 attempts'))
  })

  it('should stop retrying if expectedValue is not met', () => {
    const mockGetRef = vi.fn(() => 'unexpectedValue')
    const mockCallback = vi.fn()
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    checkAvailability(mockGetRef, mockCallback, { maxAttempts: 5, interval: 50, expectedValue: 'expectedValue' })

    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(50)
    }

    expect(mockGetRef).toHaveBeenCalledTimes(6) // Initial + 5 retries
    expect(mockCallback).not.toHaveBeenCalled()
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('5 attempts'))
  })

  it('should call callback if expectedValue is met', () => {
    const mockGetRef = vi.fn(() => 'expectedValue')
    const mockCallback = vi.fn()

    checkAvailability(mockGetRef, mockCallback, { expectedValue: 'expectedValue' })

    expect(mockGetRef).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith('expectedValue')
  })

  it('should continue retrying until expectedValue is met', () => {
    let callCount = 0
    const mockGetRef = vi.fn(() => {
      callCount++
      return callCount === 3 ? 'expectedValue' : 'unexpectedValue'
    })
    const mockCallback = vi.fn()

    checkAvailability(mockGetRef, mockCallback, { maxAttempts: 5, interval: 50, expectedValue: 'expectedValue' })

    for (let i = 0; i < 3; i++) {
      vi.advanceTimersByTime(50)
    }

    expect(mockGetRef).toHaveBeenCalledTimes(3)
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith('expectedValue')
  })
})
