import { svgs } from '@directives/vZoomImg/svgs'

describe('given vZoomImg svgs', () => {
  describe('when importing svgs', () => {
    it('then it should export object with SVG strings', () => {
      expect(svgs).toBeDefined()
      expect(typeof svgs).toBe('object')
      expect(Object.keys(svgs).length).toBeGreaterThan(0)
    })
  })

  describe('when svgs contain required icons', () => {
    it('then it should have close icon', () => {
      expect(svgs.close).toBeDefined()
      expect(typeof svgs.close).toBe('string')
      expect(svgs.close).toContain('<svg')
      expect(svgs.close).toContain('</svg>')
    })

    it('then it should have next icon', () => {
      expect(svgs.next).toBeDefined()
      expect(typeof svgs.next).toBe('string')
      expect(svgs.next).toContain('<svg')
      expect(svgs.next).toContain('</svg>')
    })

    it('then it should have previous icon', () => {
      expect(svgs.previous).toBeDefined()
      expect(typeof svgs.previous).toBe('string')
      expect(svgs.previous).toContain('<svg')
      expect(svgs.previous).toContain('</svg>')
    })

    it('then it should have spinner icon', () => {
      expect(svgs.spinner).toBeDefined()
      expect(typeof svgs.spinner).toBe('string')
      expect(svgs.spinner).toContain('<svg')
      expect(svgs.spinner).toContain('</svg>')
    })
  })

  describe('when SVG icons have proper attributes', () => {
    it('then close icon should have proper SVG attributes', () => {
      expect(svgs.close).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(svgs.close).toContain('height="24"')
      expect(svgs.close).toContain('width="24"')
      expect(svgs.close).toContain('viewBox="0 0 24 24"')
    })

    it('then next icon should have proper SVG attributes', () => {
      expect(svgs.next).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(svgs.next).toContain('height="24"')
      expect(svgs.next).toContain('width="24"')
      expect(svgs.next).toContain('viewBox="0 0 24 24"')
    })

    it('then previous icon should have proper SVG attributes', () => {
      expect(svgs.previous).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(svgs.previous).toContain('height="24"')
      expect(svgs.previous).toContain('width="24"')
      expect(svgs.previous).toContain('viewBox="0 0 24 24"')
    })

    it('then spinner icon should have proper SVG attributes', () => {
      expect(svgs.spinner).toContain('xmlns="http://www.w3.org/2000/svg"')
      expect(svgs.spinner).toContain('viewBox="0 0 50 50"')
      expect(svgs.spinner).toContain('class="maz-zoom-img__loader__svg"')
    })
  })

  describe('when SVG icons have paths', () => {
    it('then each icon should have path elements', () => {
      expect(svgs.close).toContain('<path')
      expect(svgs.next).toContain('<path')
      expect(svgs.previous).toContain('<path')
      expect(svgs.spinner).toContain('<path')
    })
  })

  describe('when accessing SVG icons by key', () => {
    it('then it should be accessible as object properties', () => {
      const keys = Object.keys(svgs)
      expect(keys).toContain('close')
      expect(keys).toContain('next')
      expect(keys).toContain('previous')
      expect(keys).toContain('spinner')
    })
  })

  describe('when SVG icons are used as HTML', () => {
    it('then they should be valid HTML strings', () => {
      Object.values(svgs).forEach((svg) => {
        expect(svg).toMatch(/^<svg.*<\/svg>$/)
      })
    })
  })
})
