import { formatOrigin, getOriginFromRects, getSideFromPlacement } from '@/utils/popoverOrigin'

const reference = { x: 100, y: 100, width: 40, height: 20 }

describe('given getOriginFromRects', () => {
  describe('when the panel is below the reference', () => {
    it('then the origin is on the top edge, under the reference center', () => {
      const floating = { x: 80, y: 130, width: 200, height: 100 }

      expect(getOriginFromRects(reference, floating, 'bottom')).toEqual({ x: 40, y: 0 })
    })
  })

  describe('when the panel is above the reference', () => {
    it('then the origin is on the bottom edge', () => {
      const floating = { x: 80, y: 0, width: 200, height: 90 }

      expect(getOriginFromRects(reference, floating, 'top')).toEqual({ x: 40, y: 90 })
    })
  })

  describe('when the panel is on the left or on the right', () => {
    it('then the origin is on the facing vertical edge', () => {
      const floating = { x: 150, y: 90, width: 120, height: 80 }

      expect(getOriginFromRects(reference, floating, 'right')).toEqual({ x: 0, y: 20 })
      expect(getOriginFromRects(reference, floating, 'left')).toEqual({ x: 120, y: 20 })
    })
  })

  describe('when the reference center is outside the panel', () => {
    it('then the origin is clamped inside the panel', () => {
      const floating = { x: 300, y: 130, width: 100, height: 50 }

      expect(getOriginFromRects(reference, floating, 'bottom')).toEqual({ x: 0, y: 0 })
      expect(getOriginFromRects({ ...reference, x: 900 }, floating, 'bottom')).toEqual({ x: 100, y: 0 })
    })
  })

  describe('when the reference is a point', () => {
    it('then the origin is the point projected on the panel', () => {
      const point = { x: 120, y: 100, width: 0, height: 0 }
      const floating = { x: 120, y: 100, width: 150, height: 90 }

      expect(getOriginFromRects(point, floating, 'bottom')).toEqual({ x: 0, y: 0 })
    })
  })
})

describe('given getSideFromPlacement', () => {
  describe('when the placement has an alignment', () => {
    it('then it returns the side', () => {
      expect(getSideFromPlacement('top-start')).toBe('top')
      expect(getSideFromPlacement('left-end')).toBe('left')
      expect(getSideFromPlacement('right')).toBe('right')
      expect(getSideFromPlacement('bottom-end')).toBe('bottom')
    })
  })
})

describe('given formatOrigin', () => {
  describe('when the origin has decimals', () => {
    it('then it returns px values rounded to 2 decimals', () => {
      expect(formatOrigin({ x: 10.456, y: 0 })).toBe('10.46px 0px')
    })
  })
})
