import process from 'node:process'
import * as loggerModule from '../logger'
import { printBanner } from '../printBanner'

describe('printBanner', () => {
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

  it('should print a banner with default options', () => {
    printBanner({ name: 'Test' })
    expect(stdoutWriteSpy).toHaveBeenCalledWith('\x1B[2J')
    expect(breakSpy).toHaveBeenCalled()
    expect(brandSpy).toHaveBeenCalled()
  })

  it('should print the banner text using figlet', () => {
    printBanner({ name: 'Hello' })
    expect(brandSpy).toHaveBeenCalledWith(expect.any(String))
    const bannerText = brandSpy.mock.calls[0][0] as string
    expect(bannerText.length).toBeGreaterThan(0)
  })

  it('should display version when provided', () => {
    printBanner({ name: 'Test', version: '1.0.0' })
    expect(brandSpy).toHaveBeenCalledTimes(2)
    expect(brandSpy).toHaveBeenNthCalledWith(2, '1.0.0')
    expect(breakSpy).toHaveBeenCalled()
  })

  it('should not display version when not provided', () => {
    printBanner({ name: 'Test' })
    const brandCalls = brandSpy.mock.calls
    expect(brandCalls.length).toBe(1)
  })

  it('should clear screen by default', () => {
    printBanner({ name: 'Test' })
    expect(stdoutWriteSpy).toHaveBeenCalledWith('\x1B[2J')
  })

  it('should not clear screen when clear is false', () => {
    printBanner({ name: 'Test', options: { clear: false } })
    expect(stdoutWriteSpy).not.toHaveBeenCalledWith('\x1B[2J')
  })

  it('should add break before by default', () => {
    printBanner({ name: 'Test' })
    // break is called before and after by default
    expect(breakSpy).toHaveBeenCalled()
  })

  it('should not add break before when breakBefore is false', () => {
    printBanner({
      name: 'Test',
      options: { breakBefore: false, breakAfter: false },
    })
    // break should not be called at all if both are false and no version
    expect(breakSpy).not.toHaveBeenCalled()
  })

  it('should add break after by default', () => {
    printBanner({ name: 'Test' })
    expect(breakSpy).toHaveBeenCalled()
  })

  it('should not add break after when breakAfter is false', () => {
    printBanner({
      name: 'Test',
      options: { breakBefore: false, breakAfter: false },
    })
    expect(breakSpy).not.toHaveBeenCalled()
  })

  it('should show divider when divider option is true', () => {
    printBanner({ name: 'Test', options: { divider: true } })
    expect(dividerSpy).toHaveBeenCalled()
  })

  it('should not show divider by default', () => {
    printBanner({ name: 'Test' })
    expect(dividerSpy).not.toHaveBeenCalled()
  })

  it('should merge custom options with defaults', () => {
    printBanner({
      name: 'Test',
      options: { clear: false, divider: true, breakBefore: false, breakAfter: false },
    })
    expect(stdoutWriteSpy).not.toHaveBeenCalledWith('\x1B[2J')
    expect(dividerSpy).toHaveBeenCalled()
    expect(breakSpy).not.toHaveBeenCalled()
  })

  it('should use custom figlet options', () => {
    expect(() => {
      printBanner({
        name: 'Test',
        options: { font: 'Standard', horizontalLayout: 'fitted' },
      })
    }).not.toThrow()
    expect(brandSpy).toHaveBeenCalled()
  })
})
