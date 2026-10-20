import { isClient } from '../isClient'
import { isIos } from '../isIos'

vi.mock('../isClient', () => ({
  isClient: vi.fn(),
}))

function stubNavigator(userAgent: string, maxTouchPoints = 0) {
  vi.stubGlobal('navigator', { userAgent, maxTouchPoints })
}

describe('given the isIos function', () => {
  beforeEach(() => {
    vi.mocked(isClient).mockReturnValue(true)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('when it runs outside a client environment', () => {
    it('then it returns false', () => {
      vi.mocked(isClient).mockReturnValue(false)

      expect(isIos()).toBe(false)
    })
  })

  describe.each([
    ['an iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 5],
    ['an iPad with a mobile user agent', 'Mozilla/5.0 (iPad; CPU OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 5],
    ['an iPod', 'Mozilla/5.0 (iPod touch; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 5],
    ['an iPad with a desktop user agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', 5],
  ])('when the device is %s', (_, userAgent, maxTouchPoints) => {
    it('then it returns true', () => {
      stubNavigator(userAgent, maxTouchPoints)

      expect(isIos()).toBe(true)
    })
  })

  describe.each([
    ['a Mac without touch support', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15', 0],
    ['an Android phone', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36', 5],
    ['a Windows computer', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', 0],
  ])('when the device is %s', (_, userAgent, maxTouchPoints) => {
    it('then it returns false', () => {
      stubNavigator(userAgent, maxTouchPoints)

      expect(isIos()).toBe(false)
    })
  })
})
