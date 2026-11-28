import { isApple } from '../isApple.ts'
import { isClient } from '../isClient.ts'

vi.mock('../isClient.ts', () => ({
  isClient: vi.fn(),
}))

describe('given the isApple function', () => {
  beforeEach(() => {
    vi.mocked(isClient).mockReturnValue(true)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('when it runs outside a client environment', () => {
    it('then it returns false', () => {
      vi.mocked(isClient).mockReturnValue(false)

      expect(isApple()).toBe(false)
    })
  })

  describe.each([
    ['MacIntel', true],
    ['iPhone', true],
    ['iPad', true],
    ['Win32', false],
    ['Linux x86_64', false],
  ])('when the platform is %s', (platform, expected) => {
    it(`then it returns ${expected}`, () => {
      vi.stubGlobal('navigator', { platform, userAgent: '' })

      expect(isApple()).toBe(expected)
    })
  })

  describe('when userAgentData exposes the platform', () => {
    it('then it takes precedence over navigator.platform', () => {
      vi.stubGlobal('navigator', { platform: 'Win32', userAgent: '', userAgentData: { platform: 'macOS' } })

      expect(isApple()).toBe(true)
    })
  })
})
