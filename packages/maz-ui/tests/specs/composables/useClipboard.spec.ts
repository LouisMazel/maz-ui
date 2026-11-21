import { useClipboard } from '@composables/useClipboard.ts'
import { withSetup } from '@tests/helpers/withSetup.ts'

describe('given useClipboard', () => {
  let writeText: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
  })

  describe('when a text is copied', () => {
    it('then it writes it to the clipboard and sets copied until the delay ends', async () => {
      const { copy, copied, isSupported } = useClipboard({ copiedDuring: 1000 })

      expect(isSupported).toBe(true)
      expect(await copy('hello')).toBe(true)
      expect(writeText).toHaveBeenCalledWith('hello')
      expect(copied.value).toBe(true)

      vi.advanceTimersByTime(999)

      expect(copied.value).toBe(true)

      vi.advanceTimersByTime(1)

      expect(copied.value).toBe(false)
    })
  })

  describe('when a second copy happens before the end of the delay', () => {
    it('then the delay starts again', async () => {
      const { copy, copied } = useClipboard()

      await copy('a')
      vi.advanceTimersByTime(1000)
      await copy('b')
      vi.advanceTimersByTime(1000)

      expect(copied.value).toBe(true)

      vi.advanceTimersByTime(500)

      expect(copied.value).toBe(false)
    })
  })

  describe('when the clipboard refuses the text', () => {
    it('then it returns false and exposes the error', async () => {
      const failure = new Error('denied')
      writeText.mockRejectedValue(failure)
      const { copy, copied, error } = useClipboard()

      expect(await copy('hello')).toBe(false)
      expect(copied.value).toBe(false)
      expect(error.value).toBe(failure)
    })
  })

  describe('when the Clipboard API is not available', () => {
    it('then it returns false with an error', async () => {
      Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
      const { copy, error, isSupported } = useClipboard()

      expect(isSupported).toBe(false)
      expect(await copy('hello')).toBe(false)
      expect(String(error.value)).toContain('secure context')
    })
  })

  describe('when reset is called', () => {
    it('then copied goes back to false at once', async () => {
      const { copy, copied, reset } = useClipboard()

      await copy('hello')
      reset()

      expect(copied.value).toBe(false)
    })
  })

  describe('when the component is unmounted during the delay', () => {
    it('then the timer is cleared', async () => {
      const [{ copy }, app] = withSetup(() => useClipboard())

      await copy('hello')
      app.unmount()

      expect(vi.getTimerCount()).toBe(0)
    })
  })
})
