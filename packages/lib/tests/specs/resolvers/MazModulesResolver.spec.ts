import type { ResolverResult } from 'unplugin-auto-import/types'
import { MazModulesResolver } from '@resolvers/MazModulesResolver'

describe('given MazModulesResolver', () => {
  describe('when resolver is created without options', () => {
    it('then it should return a resolver function', () => {
      const resolver = MazModulesResolver()

      expect(resolver).toBeDefined()
      expect(typeof resolver).toBe('function')
    })
  })

  describe('when resolver is created with devMode option', () => {
    it('then it should return a resolver function with devMode settings', () => {
      const resolver = MazModulesResolver()

      expect(resolver).toBeDefined()
      expect(typeof resolver).toBe('function')
    })
  })

  describe('when resolver is created with prefix option', () => {
    it('then it should return a resolver function with prefix settings', () => {
      const resolver = MazModulesResolver({ prefix: 'my' })

      expect(resolver).toBeDefined()
      expect(typeof resolver).toBe('function')
    })
  })

  describe('when resolving utility modules', () => {
    it.each([
      { moduleName: 'capitalize', expectedAs: 'Capitalize' },
      { moduleName: 'debounce', expectedAs: 'Debounce' },
      { moduleName: 'sleep', expectedAs: 'Sleep' },
    ])('then it should resolve $moduleName utility', ({ moduleName, expectedAs }) => {
      const resolver = MazModulesResolver()
      const result = resolver(moduleName) as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('@maz-ui/utils')
      expect(result?.name).toBe(moduleName)
      expect(result?.as).toBe(expectedAs)
    })
  })

  describe('when resolving composables', () => {
    it.each([
      { composable: 'useBreakpoints' },
      { composable: 'useTimer' },
      { composable: 'useToast' },
    ])('then it should resolve $composable', ({ composable }) => {
      const resolver = MazModulesResolver()
      const result = resolver(composable) as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/composables')
      expect(result?.name).toBe(composable)
      expect(result?.as).toBe(composable)
    })
  })

  describe('when resolving with devMode enabled', () => {
    it('then it should resolve utilities with src path', () => {
      const resolver = MazModulesResolver()
      const result = resolver('capitalize') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('@maz-ui/utils')
      expect(result?.name).toBe('capitalize')
      expect(result?.as).toBe('Capitalize')
    })

    it('then it should resolve composables with src path', () => {
      const resolver = MazModulesResolver()
      const result = resolver('useBreakpoints') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/composables')
      expect(result?.name).toBe('useBreakpoints')
      expect(result?.as).toBe('useBreakpoints')
    })
  })

  describe('when resolving with custom prefix', () => {
    it('then it should apply prefix to utility modules', () => {
      const resolver = MazModulesResolver({ prefix: 'my' })
      const result = resolver('capitalize') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('@maz-ui/utils')
      expect(result?.name).toBe('capitalize')
      expect(result?.as).toBe('myCapitalize')
    })

    it('then it should apply prefix to composables', () => {
      const resolver = MazModulesResolver({ prefix: 'app' })
      const result = resolver('useBreakpoints') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/composables')
      expect(result?.name).toBe('useBreakpoints')
      expect(result?.as).toBe('useAppBreakpoints')
    })
  })

  describe('when resolving with combined options', () => {
    it('then it should handle prefix for composables', () => {
      const resolver = MazModulesResolver({ prefix: 'custom' })
      const result = resolver('useTimer') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/composables')
      expect(result?.name).toBe('useTimer')
      expect(result?.as).toBe('useCustomTimer')
    })
  })

  describe('when resolving non-existent modules', () => {
    it.each([
      { label: 'unknown utilities', input: 'unknownUtility' },
      { label: 'unknown composables', input: 'useUnknownComposable' },
      { label: 'empty string', input: '' },
    ])('then it should return undefined for $label', ({ input }) => {
      const resolver = MazModulesResolver()
      const result = resolver(input)

      expect(result).toBeUndefined()
    })
  })

  describe('when resolving specific module types', () => {
    it.each([
      { label: 'class modules', moduleName: 'IdleTimeout', expectedAs: 'IdleTimeout' },
      { label: 'helper functions', moduleName: 'isClient', expectedAs: 'IsClient' },
      { label: 'format functions', moduleName: 'formatCurrency', expectedAs: 'FormatCurrency' },
    ])('then it should resolve $label', ({ moduleName, expectedAs }) => {
      const resolver = MazModulesResolver()
      const result = resolver(moduleName) as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('@maz-ui/utils')
      expect(result?.name).toBe(moduleName)
      expect(result?.as).toBe(expectedAs)
    })
  })

  describe('when resolving with undefined options', () => {
    it('then it should handle undefined options gracefully', () => {
      const resolver = MazModulesResolver(undefined)
      const result = resolver('capitalize') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('@maz-ui/utils')
      expect(result?.name).toBe('capitalize')
      expect(result?.as).toBe('Capitalize')
    })
  })
})
