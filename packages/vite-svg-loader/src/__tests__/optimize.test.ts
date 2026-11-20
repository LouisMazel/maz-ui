import { getDefaultSvgoConfig, getFloatPrecision, getIdPrefix, optimizeSvg } from '../optimize.ts'

const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M6.12345 18.12345L18 6" stroke="currentColor"/></svg>'
const WITH_IDS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><clipPath id="clip"><rect width="24" height="24"/></clipPath></defs><g clip-path="url(#clip)"><path d="M0 0h24v24H0z"/></g></svg>'

describe('given getFloatPrecision', () => {
  describe('when the viewBox is smaller than 480', () => {
    it('then 3 decimals are kept', () => {
      expect(getFloatPrecision(ICON)).toBe(3)
      expect(getFloatPrecision('<svg viewBox="0 0 382 382"></svg>')).toBe(3)
      expect(getFloatPrecision('<svg viewBox="0 0 8 8"></svg>')).toBe(3)
    })
  })

  describe('when the viewBox is between 480 and 4800', () => {
    it('then 2 decimals are kept', () => {
      expect(getFloatPrecision('<svg viewBox="0 85.333 512 341.333"></svg>')).toBe(2)
      expect(getFloatPrecision('<svg viewBox="0,0,1200,800"></svg>')).toBe(2)
    })
  })

  describe('when the viewBox is 4800 or larger', () => {
    it('then 1 decimal is kept', () => {
      expect(getFloatPrecision('<svg viewBox="0 0 4800 100"></svg>')).toBe(1)
      expect(getFloatPrecision('<svg viewBox="0 0 90000 90000"></svg>')).toBe(1)
    })
  })

  describe('when the SVG has no viewBox but a width and a height', () => {
    it('then they give the size', () => {
      expect(getFloatPrecision('<svg width="1000px" height="20"></svg>')).toBe(2)
    })
  })

  describe('when the size of the SVG is unknown', () => {
    it('then 3 decimals are kept', () => {
      expect(getFloatPrecision('<svg width="1em"></svg>')).toBe(3)
      expect(getFloatPrecision('<svg viewBox="0 0 0 0"></svg>')).toBe(3)
      expect(getFloatPrecision('<path d="M0 0"/>')).toBe(3)
    })
  })
})

describe('given getIdPrefix', () => {
  describe('when the path of the file is known', () => {
    it('then the prefix is its path relative to the root', () => {
      expect(getIdPrefix(WITH_IDS, { path: '/app/src/icons/flags/fr.svg', root: '/app' })).toBe('src-icons-flags-fr')
    })
  })

  describe('when the relative path starts with a digit', () => {
    it('then the prefix starts with a letter', () => {
      expect(getIdPrefix(WITH_IDS, { path: '/app/1x1/fr.svg', root: '/app' })).toBe('svg-1x1-fr')
    })
  })

  describe('when the file is outside of the root', () => {
    it('then the leading dashes are removed', () => {
      expect(getIdPrefix(WITH_IDS, { path: '/lib/logo.svg', root: '/app' })).toBe('lib-logo')
    })
  })

  describe('when the path is unknown', () => {
    it('then the prefix is a hash of the content', () => {
      const prefix = getIdPrefix(WITH_IDS)

      expect(prefix).toBe(getIdPrefix(WITH_IDS))
      expect(prefix).not.toBe(getIdPrefix(ICON))
      expect(prefix).toMatch(/^[a-z][\w-]*$/i)
    })
  })
})

describe('given getDefaultSvgoConfig', () => {
  describe('when it is built for a large SVG', () => {
    it('then its precision follows the size and the transforms keep 3 decimals', () => {
      const config = getDefaultSvgoConfig('<svg viewBox="0 0 1000 1000"></svg>', { path: '/app/a.svg', root: '/app' })

      expect(config.multipass).toBe(true)
      expect(config.floatPrecision).toBe(2)
      expect(config.plugins).toContainEqual({
        name: 'preset-default',
        params: {
          overrides: {
            convertTransform: { floatPrecision: 3 },
            inlineStyles: { onlyMatchedOnce: false },
            mergePaths: false,
          },
        },
      })
      expect(config.plugins).toContainEqual({
        name: 'prefixIds',
        params: { prefix: 'a' },
      })
      expect(config.plugins).toContain('removeScripts')
    })
  })
})

describe('given optimizeSvg', () => {
  describe('when it runs with the default config', () => {
    it('then the SVG is optimized and keeps its size and viewBox', () => {
      const svg = optimizeSvg(ICON)

      expect(svg).toBe('<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path stroke="currentColor" d="M6.123 18.123 18 6"/></svg>')
    })

    it('then the ids are prefixed by the path of the file', () => {
      const svg = optimizeSvg(WITH_IDS, { path: '/app/icons/logo.svg', root: '/app' })

      expect(svg).toContain('id="icons-logo__a"')
      expect(svg).toContain('url(#icons-logo__a)')
    })

    it('then the scripts are removed', () => {
      expect(optimizeSvg('<svg viewBox="0 0 24 24"><script>alert(1)</script><path d="M0 0h24"/></svg>')).not.toContain('script')
    })
  })

  describe('when a config object is given', () => {
    it('then it replaces the default config', () => {
      const svg = optimizeSvg(ICON, {
        config: {
          plugins: ['removeDimensions'],
        },
      })

      expect(svg).toContain('d="M6.12345 18.12345L18 6"')
      expect(svg).not.toContain('width=')
    })
  })

  describe('when a config function is given', () => {
    it('then it receives the default config to extend it', () => {
      const config = vi.fn((defaults: object) => ({ ...defaults, floatPrecision: 1 }))
      const svg = optimizeSvg(ICON, { config })

      expect(config).toHaveBeenCalledWith(expect.objectContaining({ multipass: true, floatPrecision: 3 }))
      expect(svg).toContain('d="M6.1 18.1 18 6"')
    })
  })
})
