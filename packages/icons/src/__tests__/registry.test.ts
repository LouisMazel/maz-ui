import { getRegisteredIcon, hasIconLoader, loadIcon, registerIcon, registerIconLoader, registerIconLoaders, registerIcons } from '../registry.ts'

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

describe('given icon loaders', () => {
  describe('when a lazy icon is loaded twice at once', () => {
    it('then its loader runs once, and the icon is registered', async () => {
      const loader = vi.fn(() => Promise.resolve({ default: STAR }))
      registerIconLoader('test-lazy-star', loader)

      expect(hasIconLoader('test-lazy-star')).toBe(true)
      expect(getRegisteredIcon('test-lazy-star')).toBeUndefined()
      expect(await Promise.all([loadIcon('test-lazy-star'), loadIcon('test-lazy-star')])).toEqual([STAR, STAR])
      expect(loader).toHaveBeenCalledOnce()
      expect(getRegisteredIcon('test-lazy-star')).toBe(STAR)
    })
  })

  describe('when a loader returns the SVG string', () => {
    it('then it is registered', async () => {
      registerIconLoaders({ 'test-lazy-string': () => Promise.resolve('<svg>s</svg>') })

      expect(await loadIcon('test-lazy-string')).toBe('<svg>s</svg>')
    })
  })

  describe('when a registered icon is loaded', () => {
    it('then it is read without a loader', async () => {
      registerIcon('test-eager', STAR)

      expect(await loadIcon('test-eager')).toBe(STAR)
    })
  })

  describe('when an unknown icon is loaded', () => {
    it('then there is no SVG', async () => {
      expect(hasIconLoader('test-none')).toBe(false)
      expect(await loadIcon('test-none')).toBeUndefined()
    })
  })

  describe('when a loader fails', () => {
    it('then the load rejects, and it can be retried', async () => {
      const loader = vi.fn()
        .mockRejectedValueOnce(new Error('offline'))
        .mockResolvedValueOnce({ default: STAR })
      registerIconLoader('test-lazy-retry', loader)

      await expect(loadIcon('test-lazy-retry')).rejects.toThrow('offline')
      expect(await loadIcon('test-lazy-retry')).toBe(STAR)
    })
  })
})
