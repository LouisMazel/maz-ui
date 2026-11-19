import { getRegisteredIcon, registerIcon, registerIcons } from '../registry.ts'

const STAR = '<svg viewBox="0 0 24 24"><path d="M0 0"/></svg>'

describe('given the icon registry', () => {
  describe('when an icon is registered by name', () => {
    it('then it is read by its name', () => {
      registerIcon('test-star', STAR)

      expect(getRegisteredIcon('test-star')).toBe(STAR)
    })
  })

  describe('when several icons are registered at once', () => {
    it('then each one is read by its name', () => {
      registerIcons({ 'test-a': '<svg>a</svg>', 'test-b': '<svg>b</svg>' })

      expect([
        getRegisteredIcon('test-a'),
        getRegisteredIcon('test-b'),
      ]).toEqual(['<svg>a</svg>', '<svg>b</svg>'])
    })
  })

  describe('when a name is not registered', () => {
    it('then it reads undefined', () => {
      expect(getRegisteredIcon('test-unknown')).toBeUndefined()
    })
  })

  describe('when another copy of the module reads it', () => {
    it('then the icons are shared through globalThis', async () => {
      registerIcon('test-shared', STAR)
      vi.resetModules()
      const copy = await import('../registry.ts')

      expect(copy.getRegisteredIcon('test-shared')).toBe(STAR)
    })
  })
})
