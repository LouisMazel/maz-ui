import { style } from '@directives/vZoomImg/style'

describe('given vZoomImg style', () => {
  describe('when importing style', () => {
    it('then it should export CSS string', () => {
      expect(style).toBeDefined()
      expect(typeof style).toBe('string')
      expect(style.length).toBeGreaterThan(0)
    })
  })

  describe('when style contains CSS rules', () => {
    it('then it should contain main zoom img class', () => {
      expect(style).toContain('.maz-zoom-img')
    })

    it('then it should contain wrapper class', () => {
      expect(style).toContain('.maz-zoom-img__wrapper')
    })

    it('then it should contain loader class', () => {
      expect(style).toContain('.maz-zoom-img__loader')
    })

    it('then it should contain button classes', () => {
      expect(style).toContain('.maz-zoom-btn')
      expect(style).toContain('.maz-zoom-btn--close')
      expect(style).toContain('.maz-zoom-btn--previous')
      expect(style).toContain('.maz-zoom-btn--next')
    })

    it('then it should contain animation keyframes', () => {
      expect(style).toContain('@keyframes spin')
      expect(style).toContain('@-webkit-keyframes spin')
    })
  })

  describe('when style contains positioning rules', () => {
    it('then it should have fixed positioning for main container', () => {
      expect(style).toContain('position: fixed')
      expect(style).toContain('top: 0')
      expect(style).toContain('bottom: 0')
      expect(style).toContain('left: 0')
      expect(style).toContain('right: 0')
    })

    it('then it should have z-index for layering', () => {
      expect(style).toContain('z-index: 1050')
    })
  })

  describe('when style contains flexbox rules', () => {
    it('then it should have flex display and centering', () => {
      expect(style).toContain('display: flex')
      expect(style).toContain('align-items: center')
      expect(style).toContain('justify-content: center')
    })
  })

  describe('when style contains transition rules', () => {
    it('then it should have transition animations', () => {
      expect(style).toContain('transition: all 300ms ease-in-out')
    })
  })

  describe('when style contains responsive rules', () => {
    it('then it should have max-width and max-height constraints', () => {
      expect(style).toContain('max-width: 100%')
      expect(style).toContain('max-height: 100%')
    })
  })

  describe('when style contains background styling', () => {
    it('then it should have background colors defined', () => {
      expect(style).toContain('background-color:')
    })
  })

  describe('when style contains border radius', () => {
    it('then it should have rounded corners', () => {
      expect(style).toContain('border-radius:')
    })
  })
})
