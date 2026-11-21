import { warnDeprecated } from '@/utils/warnDeprecated.ts'

describe('given warnDeprecated', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  describe('when it is called twice with the same id', () => {
    it('then it warns only once', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      warnDeprecated('test-once', 'Old API')
      warnDeprecated('test-once', 'Old API')

      expect(warn).toHaveBeenCalledOnce()
      expect(warn).toHaveBeenCalledWith('[maz-ui] Old API')
    })
  })

  describe('when it is called in production', () => {
    it('then it does not warn', () => {
      vi.stubEnv('NODE_ENV', 'production')
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      warnDeprecated('test-production', 'Old API')

      expect(warn).not.toHaveBeenCalled()
    })
  })
})
