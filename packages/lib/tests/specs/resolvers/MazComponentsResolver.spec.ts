import { MazComponentsResolver } from '@resolvers/MazComponentsResolver'

describe('given MazComponentsResolver', () => {
  describe('when resolver is created without options', () => {
    it('then it should return a component resolver', () => {
      const resolver = MazComponentsResolver()

      expect(resolver).toBeDefined()
      expect(resolver.type).toBe('component')
      expect(resolver.resolve).toBeDefined()
      expect(typeof resolver.resolve).toBe('function')
    })
  })

  describe('when resolver is created with devMode option', () => {
    it('then it should return a component resolver with devMode settings', () => {
      const resolver = MazComponentsResolver({ devMode: true })

      expect(resolver).toBeDefined()
      expect(resolver.type).toBe('component')
      expect(resolver.resolve).toBeDefined()
    })
  })

  describe('when resolving component with Maz prefix', () => {
    it('then it should resolve MazBtn component', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('MazBtn')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/components/MazBtn')
    })

    it('then it should resolve MazInput component', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('MazInput')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/components/MazInput')
    })

    it('then it should resolve MazSelect component', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('MazSelect')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/components/MazSelect')
    })
  })

  describe('when resolving component with kebab-case name', () => {
    it('then it should resolve maz-btn to MazBtn', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('maz-btn')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/components/MazBtn')
    })

    it('then it should resolve maz-input to MazInput', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('maz-input')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/components/MazInput')
    })
  })

  describe('when resolving with devMode enabled', () => {
    it('then it should resolve with src path and .vue extension', () => {
      const resolver = MazComponentsResolver({ devMode: true })
      const result = resolver.resolve('MazBtn')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/src/components/MazBtn.vue')
    })
  })

  describe('when resolving icon names', () => {
    it('then it should not resolve icon names', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('MazCheck')

      // Icons should not be resolved by component resolver
      expect(result).toBeUndefined()
    })
  })

  describe('when resolving non-Maz components', () => {
    it('then it should not resolve non-Maz components', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('Button')

      expect(result).toBeUndefined()
    })

    it('then it should not resolve random strings', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('RandomComponent')

      expect(result).toBeUndefined()
    })
  })

  describe('when resolving with different casing', () => {
    it('then it should resolve PascalCase component names', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('MazDialog')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/components/MazDialog')
    })

    it('then it should resolve kebab-case component names', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('maz-dialog')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/components/MazDialog')
    })
  })

  describe('when resolving complex component names', () => {
    it('then it should resolve multi-word components', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('MazInputNumber')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/components/MazInputNumber')
    })

    it('then it should resolve kebab-case multi-word components', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('maz-input-number')

      expect(result).toBeDefined()
      expect(result?.from).toBe('maz-ui/components/MazInputNumber')
    })
  })

  describe('when resolving with edge cases', () => {
    it('then it should handle empty string', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('')

      expect(result).toBeUndefined()
    })

    it('then it should handle invalid patterns', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('maz')

      expect(result).toBeUndefined()
    })

    it('then it should handle lowercase maz prefix', () => {
      const resolver = MazComponentsResolver()
      const result = resolver.resolve('mazBtn')

      expect(result).toBeUndefined()
    })
  })
})
