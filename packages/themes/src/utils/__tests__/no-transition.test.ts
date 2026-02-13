import { noTransition } from '../no-transition'

vi.mock('@maz-ui/utils', () => ({
  isServer: vi.fn(() => false),
}))

describe('no-transition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    document.documentElement.classList.remove('no-transitions')
    document.head.querySelectorAll('style').forEach(el => el.remove())
  })

  describe('given noTransition function', () => {
    describe('when running on the server', () => {
      it('then it calls the callback without DOM manipulation', async () => {
        const { isServer } = await import('@maz-ui/utils')
        vi.mocked(isServer).mockReturnValue(true)

        const fn = vi.fn()

        noTransition(fn)

        expect(fn).toHaveBeenCalledOnce()
        expect(document.documentElement.classList.contains('no-transitions')).toBe(false)
        expect(document.head.querySelectorAll('style').length).toBe(0)
      })
    })

    describe('when running on the client', () => {
      it('then it appends a style element to the head', async () => {
        const { isServer } = await import('@maz-ui/utils')
        vi.mocked(isServer).mockReturnValue(false)

        noTransition(() => {})

        const styles = document.head.querySelectorAll('style')
        expect(styles.length).toBe(1)
        expect(styles[0].textContent).toContain('no-transitions')
        expect(styles[0].textContent).toContain('transition-property')
      })

      it('then it adds the no-transitions class to documentElement', async () => {
        const { isServer } = await import('@maz-ui/utils')
        vi.mocked(isServer).mockReturnValue(false)

        noTransition(() => {})

        expect(document.documentElement.classList.contains('no-transitions')).toBe(true)
      })

      it('then it calls the callback', async () => {
        const { isServer } = await import('@maz-ui/utils')
        vi.mocked(isServer).mockReturnValue(false)

        const fn = vi.fn()

        noTransition(fn)

        expect(fn).toHaveBeenCalledOnce()
      })

      it('then it removes the class and style after 500ms', async () => {
        const { isServer } = await import('@maz-ui/utils')
        vi.mocked(isServer).mockReturnValue(false)

        noTransition(() => {})

        expect(document.documentElement.classList.contains('no-transitions')).toBe(true)
        expect(document.head.querySelectorAll('style').length).toBe(1)

        vi.advanceTimersByTime(499)
        expect(document.documentElement.classList.contains('no-transitions')).toBe(true)

        vi.advanceTimersByTime(1)
        expect(document.documentElement.classList.contains('no-transitions')).toBe(false)
        expect(document.head.querySelectorAll('style').length).toBe(0)
      })

      it('then the class is still present before 500ms elapses', async () => {
        const { isServer } = await import('@maz-ui/utils')
        vi.mocked(isServer).mockReturnValue(false)

        noTransition(() => {})

        vi.advanceTimersByTime(250)
        expect(document.documentElement.classList.contains('no-transitions')).toBe(true)
      })
    })
  })
})
