import { MazDirectivesResolver } from '@resolvers/MazDirectivesResolver'

describe('given MazDirectivesResolver', () => {
  describe('when resolver is created without options', () => {
    it('then it should return a directive resolver', () => {
      const resolver = MazDirectivesResolver()

      expect(resolver).toBeDefined()
      expect(resolver.type).toBe('directive')
      expect(resolver.resolve).toBeDefined()
      expect(typeof resolver.resolve).toBe('function')
    })
  })

  describe('when resolver is created with devMode option', () => {
    it('then it should return a directive resolver with devMode settings', () => {
      const resolver = MazDirectivesResolver({ devMode: true })

      expect(resolver).toBeDefined()
      expect(resolver.type).toBe('directive')
      expect(resolver.resolve).toBeDefined()
    })
  })

  describe('when resolver is created with prefix option', () => {
    it('then it should return a directive resolver with prefix settings', () => {
      const resolver = MazDirectivesResolver({ prefix: 'my' })

      expect(resolver).toBeDefined()
      expect(resolver.type).toBe('directive')
      expect(resolver.resolve).toBeDefined()
    })
  })

  describe('when resolving directive without prefix', () => {
    it('then it should resolve basic directive', () => {
      const resolver = MazDirectivesResolver()
      const result = resolver.resolve('clickOutside')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('vClickOutside')
      expect(result?.name).toBe('vclickOutside')
    })

    it('then it should resolve tooltip directive', () => {
      const resolver = MazDirectivesResolver()
      const result = resolver.resolve('tooltip')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('vTooltip')
      expect(result?.name).toBe('vtooltip')
    })
  })

  describe('when resolving directive with v prefix', () => {
    it('then it should handle v-prefixed directive names', () => {
      const resolver = MazDirectivesResolver()
      const result = resolver.resolve('vClickOutside')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('vClickOutside')
      expect(result?.name).toBe('vvClickOutside')
    })
  })

  describe('when resolving with devMode enabled', () => {
    it('then it should resolve with src path', () => {
      const resolver = MazDirectivesResolver({ devMode: true })
      const result = resolver.resolve('clickOutside')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/src/directives/index.ts')
      expect(result?.as).toBe('vClickOutside')
      expect(result?.name).toBe('vclickOutside')
    })
  })

  describe('when resolving with custom prefix', () => {
    it('then it should apply custom prefix to directive name', () => {
      const resolver = MazDirectivesResolver({ prefix: 'my' })
      const result = resolver.resolve('clickOutside')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('vMyClickOutside')
      expect(result?.name).toBe('vclickOutside')
    })

    it('then it should apply custom prefix with capital letter', () => {
      const resolver = MazDirectivesResolver({ prefix: 'custom' })
      const result = resolver.resolve('tooltip')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('vCustomTooltip')
      expect(result?.name).toBe('vtooltip')
    })
  })

  describe('when resolving with combined options', () => {
    it('then it should handle both devMode and prefix', () => {
      const resolver = MazDirectivesResolver({ devMode: true, prefix: 'app' })
      const result = resolver.resolve('lazyImg')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/src/directives/index.ts')
      expect(result?.as).toBe('vAppLazyImg')
      expect(result?.name).toBe('vlazyImg')
    })
  })

  describe('when resolving various directive patterns', () => {
    it('then it should handle camelCase directive names', () => {
      const resolver = MazDirectivesResolver()
      const result = resolver.resolve('lazyImg')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('vLazyImg')
      expect(result?.name).toBe('vlazyImg')
    })

    it('then it should handle kebab-case directive names', () => {
      const resolver = MazDirectivesResolver()
      const result = resolver.resolve('zoom-img')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('vZoom-img')
      expect(result?.name).toBe('vzoom-img')
    })

    it('then it should handle single word directive names', () => {
      const resolver = MazDirectivesResolver()
      const result = resolver.resolve('focus')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('vFocus')
      expect(result?.name).toBe('vfocus')
    })
  })

  describe('when resolving with empty or invalid inputs', () => {
    it('then it should handle empty string', () => {
      const resolver = MazDirectivesResolver()
      const result = resolver.resolve('')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('v')
      expect(result?.name).toBe('v')
    })

    it('then it should handle undefined options', () => {
      const resolver = MazDirectivesResolver(undefined)
      const result = resolver.resolve('test')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/directives')
      expect(result?.as).toBe('vTest')
      expect(result?.name).toBe('vtest')
    })
  })
})
