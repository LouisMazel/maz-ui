import { isProduction } from '../isProduction.ts'

describe('given isProduction', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  describe('when NODE_ENV is production', () => {
    it('then it returns true', () => {
      vi.stubEnv('NODE_ENV', 'production')

      expect(isProduction()).toBe(true)
    })
  })

  describe('when NODE_ENV is development', () => {
    it('then it returns false', () => {
      vi.stubEnv('NODE_ENV', 'development')

      expect(isProduction()).toBe(false)
    })
  })

  describe('when process does not exist', () => {
    it('then it returns false', () => {
      vi.stubGlobal('process', undefined)

      expect(isProduction()).toBe(false)
    })
  })
})
