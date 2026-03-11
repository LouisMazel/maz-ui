import process from 'node:process'
import * as loggerModule from '../logger'
import { printBanner } from '../printBanner'

describe('given printBanner function', () => {
  let brandSpy: ReturnType<typeof vi.spyOn>
  let breakSpy: ReturnType<typeof vi.spyOn>
  let dividerSpy: ReturnType<typeof vi.spyOn>
  let stdoutWriteSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    brandSpy = vi.spyOn(loggerModule.logger, 'brand').mockImplementation(() => {})
    breakSpy = vi.spyOn(loggerModule.logger, 'break').mockImplementation(() => {})
    dividerSpy = vi.spyOn(loggerModule.logger, 'divider').mockImplementation(() => {})
    stdoutWriteSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called with default options', () => {
    it('then clears screen, adds breaks, and prints the banner', () => {
      printBanner({ name: 'Test' })
      expect(stdoutWriteSpy).toHaveBeenCalledWith('\x1B[2J')
      expect(breakSpy).toHaveBeenCalled()
      expect(brandSpy).toHaveBeenCalled()
    })
  })

  describe('when called with a name', () => {
    it('then prints the banner text using figlet', () => {
      printBanner({ name: 'Hello' })
      expect(brandSpy).toHaveBeenCalledWith(expect.any(String))
      const bannerText = brandSpy.mock.calls[0][0] as string
      expect(bannerText.length).toBeGreaterThan(0)
    })
  })

  describe('when version is provided', () => {
    it('then displays the version after the banner', () => {
      printBanner({ name: 'Test', version: '1.0.0' })
      expect(brandSpy).toHaveBeenCalledTimes(2)
      expect(brandSpy).toHaveBeenNthCalledWith(2, '1.0.0')
      expect(breakSpy).toHaveBeenCalled()
    })
  })

  describe('when version is not provided', () => {
    it('then only calls brand once for the banner text', () => {
      printBanner({ name: 'Test' })
      const brandCalls = brandSpy.mock.calls
      expect(brandCalls.length).toBe(1)
    })
  })

  describe('when clear option is false', () => {
    it('then does not clear the screen', () => {
      printBanner({ name: 'Test', options: { clear: false } })
      expect(stdoutWriteSpy).not.toHaveBeenCalledWith('\x1B[2J')
    })
  })

  describe('when breakBefore and breakAfter are false', () => {
    it('then does not add any breaks', () => {
      printBanner({
        name: 'Test',
        options: { breakBefore: false, breakAfter: false },
      })
      expect(breakSpy).not.toHaveBeenCalled()
    })
  })

  describe('when divider option is true', () => {
    it('then displays a divider', () => {
      printBanner({ name: 'Test', options: { divider: true } })
      expect(dividerSpy).toHaveBeenCalled()
    })
  })

  describe('when divider option is not set', () => {
    it('then does not display a divider', () => {
      printBanner({ name: 'Test' })
      expect(dividerSpy).not.toHaveBeenCalled()
    })
  })

  describe('when multiple custom options are provided', () => {
    it('then merges them with defaults', () => {
      printBanner({
        name: 'Test',
        options: { clear: false, divider: true, breakBefore: false, breakAfter: false },
      })
      expect(stdoutWriteSpy).not.toHaveBeenCalledWith('\x1B[2J')
      expect(dividerSpy).toHaveBeenCalled()
      expect(breakSpy).not.toHaveBeenCalled()
    })
  })

  describe('when custom figlet options are provided', () => {
    it('then does not throw and prints the banner', () => {
      expect(() => {
        printBanner({
          name: 'Test',
          options: { font: 'Standard', horizontalLayout: 'fitted' },
        })
      }).not.toThrow()
      expect(brandSpy).toHaveBeenCalled()
    })
  })
})
