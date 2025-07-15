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
      const resolver = MazModulesResolver({ devMode: true })

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
    it('then it should resolve capitalize utility', () => {
      const resolver = MazModulesResolver()
      const result = resolver('capitalize') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui')
      expect(result?.name).toBe('capitalize')
      expect(result?.as).toBe('Capitalize')
    })

    it('then it should resolve debounce utility', () => {
      const resolver = MazModulesResolver()
      const result = resolver('debounce') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui')
      expect(result?.name).toBe('debounce')
      expect(result?.as).toBe('Debounce')
    })

    it('then it should resolve sleep utility', () => {
      const resolver = MazModulesResolver()
      const result = resolver('sleep') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui')
      expect(result?.name).toBe('sleep')
      expect(result?.as).toBe('Sleep')
    })
  })

  describe('when resolving composables', () => {
    it('then it should resolve useBreakpoints', () => {
      const resolver = MazModulesResolver()
      const result = resolver('useBreakpoints') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/composables')
      expect(result?.name).toBe('useBreakpoints')
      expect(result?.as).toBe('useBreakpoints')
    })

    it('then it should resolve useTimer', () => {
      const resolver = MazModulesResolver()
      const result = resolver('useTimer') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/composables')
      expect(result?.name).toBe('useTimer')
      expect(result?.as).toBe('useTimer')
    })

    it('then it should resolve useToast', () => {
      const resolver = MazModulesResolver()
      const result = resolver('useToast') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/composables')
      expect(result?.name).toBe('useToast')
      expect(result?.as).toBe('useToast')
    })
  })

  describe('when resolving with devMode enabled', () => {
    it('then it should resolve utilities with src path', () => {
      const resolver = MazModulesResolver({ devMode: true })
      const result = resolver('capitalize') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/src/index.ts')
      expect(result?.name).toBe('capitalize')
      expect(result?.as).toBe('Capitalize')
    })

    it('then it should resolve composables with src path', () => {
      const resolver = MazModulesResolver({ devMode: true })
      const result = resolver('useBreakpoints') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/src/composables/index.ts')
      expect(result?.name).toBe('useBreakpoints')
      expect(result?.as).toBe('useBreakpoints')
    })
  })

  describe('when resolving with custom prefix', () => {
    it('then it should apply prefix to utility modules', () => {
      const resolver = MazModulesResolver({ prefix: 'my' })
      const result = resolver('capitalize') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui')
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
    it('then it should handle both devMode and prefix for utilities', () => {
      const resolver = MazModulesResolver({ devMode: true, prefix: 'custom' })
      const result = resolver('formatDate') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/src/index.ts')
      expect(result?.name).toBe('formatDate')
      expect(result?.as).toBe('customFormatDate')
    })

    it('then it should handle both devMode and prefix for composables', () => {
      const resolver = MazModulesResolver({ devMode: true, prefix: 'custom' })
      const result = resolver('useTimer') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/src/composables/index.ts')
      expect(result?.name).toBe('useTimer')
      expect(result?.as).toBe('useCustomTimer')
    })
  })

  describe('when resolving non-existent modules', () => {
    it('then it should return undefined for unknown utilities', () => {
      const resolver = MazModulesResolver()
      const result = resolver('unknownUtility')

      expect(result).toBeUndefined()
    })

    it('then it should return undefined for unknown composables', () => {
      const resolver = MazModulesResolver()
      const result = resolver('useUnknownComposable')

      expect(result).toBeUndefined()
    })

    it('then it should return undefined for empty string', () => {
      const resolver = MazModulesResolver()
      const result = resolver('')

      expect(result).toBeUndefined()
    })
  })

  describe('when resolving specific module types', () => {
    it('then it should resolve class modules', () => {
      const resolver = MazModulesResolver()
      const result = resolver('IdleTimeout') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui')
      expect(result?.name).toBe('IdleTimeout')
      expect(result?.as).toBe('IdleTimeout')
    })

    it('then it should resolve helper functions', () => {
      const resolver = MazModulesResolver()
      const result = resolver('isClient') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui')
      expect(result?.name).toBe('isClient')
      expect(result?.as).toBe('IsClient')
    })

    it('then it should resolve format functions', () => {
      const resolver = MazModulesResolver()
      const result = resolver('formatCurrency') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui')
      expect(result?.name).toBe('formatCurrency')
      expect(result?.as).toBe('FormatCurrency')
    })
  })

  describe('when resolving with undefined options', () => {
    it('then it should handle undefined options gracefully', () => {
      const resolver = MazModulesResolver(undefined)
      const result = resolver('capitalize') as ResolverResult

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui')
      expect(result?.name).toBe('capitalize')
      expect(result?.as).toBe('Capitalize')
    })
  })
})
