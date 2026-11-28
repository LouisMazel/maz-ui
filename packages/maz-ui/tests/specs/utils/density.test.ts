import { applyDensityClasses, DEFAULT_DENSITY, getDensityClasses } from '@/utils/density.ts'

describe('given getDensityClasses', () => {
  describe('when no density is given', () => {
    it('then the default density has no class', () => {
      expect(DEFAULT_DENSITY).toBe('default')
      expect(getDensityClasses(undefined)).toEqual([])
    })
  })

  describe('when the density is default', () => {
    it('then there is no class', () => {
      expect(getDensityClasses('default')).toEqual([])
    })
  })

  describe('when the density is compact', () => {
    it('then there is the compact class', () => {
      expect(getDensityClasses('compact')).toEqual(['m-density-compact'])
    })
  })
})

describe('given applyDensityClasses', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.documentElement.className = ''
  })

  describe('when the density is compact', () => {
    it('then the html element gets the compact class', () => {
      applyDensityClasses('compact')

      expect(document.documentElement.classList.contains('m-density-compact')).toBe(true)
    })
  })

  describe('when the density changes from compact to default', () => {
    it('then the compact class is removed and the other classes are kept', () => {
      document.documentElement.classList.add('dark')
      applyDensityClasses('compact')
      applyDensityClasses('default')

      expect(document.documentElement.classList.contains('m-density-compact')).toBe(false)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  describe('when there is no document', () => {
    it('then nothing happens', () => {
      vi.stubGlobal('document', undefined)

      expect(() => applyDensityClasses('compact')).not.toThrow()
    })
  })
})
