import {
  canScrollFurther,
  getEdgeAxis,
  getEdgeSign,
  getReleaseVelocity,
  isScrollClaimed,
  readTranslate,
  rubberBand,
} from '@/utils/sheetDrag.ts'

function createScrollable(style: Partial<CSSStyleDeclaration>, metrics: { scrollHeight?: number, clientHeight?: number, scrollTop?: number, scrollWidth?: number, clientWidth?: number, scrollLeft?: number }) {
  const element = document.createElement('div')

  Object.assign(element.style, style)
  document.body.append(element)

  for (const [key, value] of Object.entries(metrics))
    Object.defineProperty(element, key, { value, configurable: true })

  return element
}

describe('given the helpers of the drag of a sheet', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('when reading an edge', () => {
    it.each([
      ['bottom', 'y', 1],
      ['top', 'y', -1],
      ['right', 'x', 1],
      ['left', 'x', -1],
    ] as const)('then the %s edge is on the %s axis with the sign %s', (edge, axis, sign) => {
      expect(getEdgeAxis(edge)).toBe(axis)
      expect(getEdgeSign(edge)).toBe(sign)
    })
  })

  describe('when resisting beyond the limit', () => {
    it('then the stretch grows slower than the pointer and never reaches the limit', () => {
      expect(rubberBand(0)).toBe(0)
      expect(rubberBand(-10)).toBe(0)
      expect(rubberBand(50)).toBeLessThan(50)
      expect(rubberBand(50)).toBeGreaterThan(0)
      expect(rubberBand(100000, 60)).toBeLessThan(60)
      expect(rubberBand(200)).toBeGreaterThan(rubberBand(100))
    })
  })

  describe('when computing the velocity of a release', () => {
    it('then it is the speed of the last moments', () => {
      const samples = [{ time: 0, position: 0 }, { time: 50, position: 10 }, { time: 100, position: 80 }]

      expect(getReleaseVelocity(samples, 110)).toBeCloseTo(0.8)
    })

    it('then it is negative when the sheet goes back', () => {
      expect(getReleaseVelocity([{ time: 0, position: 100 }, { time: 40, position: 40 }], 45)).toBeCloseTo(-1.5)
    })

    it('then it ignores the moves older than the window', () => {
      const samples = [{ time: 0, position: 0 }, { time: 300, position: 100 }, { time: 340, position: 104 }]

      expect(getReleaseVelocity(samples, 345)).toBeCloseTo(0.1)
    })

    it('then it is zero when the pointer stopped before the release', () => {
      expect(getReleaseVelocity([{ time: 0, position: 0 }, { time: 50, position: 100 }], 400)).toBe(0)
    })

    it('then it is zero when the samples are too close in time', () => {
      expect(getReleaseVelocity([{ time: 0, position: 0 }, { time: 2, position: 100 }], 3)).toBe(0)
    })

    it('then it is zero without samples', () => {
      expect(getReleaseVelocity([], 10)).toBe(0)
    })
  })

  describe('when checking if a content can still scroll', () => {
    it('then a content scrolled to the top scrolls down only when the finger goes up', () => {
      const content = createScrollable({ overflowY: 'auto' }, { scrollHeight: 500, clientHeight: 200, scrollTop: 0 })

      expect(canScrollFurther(content, 'y', 1)).toBe(false)
      expect(canScrollFurther(content, 'y', -1)).toBe(true)
    })

    it('then a content scrolled in the middle scrolls both ways', () => {
      const content = createScrollable({ overflowY: 'scroll' }, { scrollHeight: 500, clientHeight: 200, scrollTop: 100 })

      expect(canScrollFurther(content, 'y', 1)).toBe(true)
      expect(canScrollFurther(content, 'y', -1)).toBe(true)
    })

    it('then a content scrolled to the bottom scrolls up only when the finger goes down', () => {
      const content = createScrollable({ overflowY: 'auto' }, { scrollHeight: 500, clientHeight: 200, scrollTop: 300 })

      expect(canScrollFurther(content, 'y', 1)).toBe(true)
      expect(canScrollFurther(content, 'y', -1)).toBe(false)
    })

    it('then an element that does not overflow or does not scroll never claims the gesture', () => {
      expect(canScrollFurther(createScrollable({ overflowY: 'auto' }, { scrollHeight: 200, clientHeight: 200 }), 'y', -1)).toBe(false)
      expect(canScrollFurther(createScrollable({ overflowY: 'hidden' }, { scrollHeight: 500, clientHeight: 200 }), 'y', -1)).toBe(false)
    })

    it('then the horizontal axis follows the direction of the content', () => {
      const ltr = createScrollable({ overflowX: 'auto', direction: 'ltr' }, { scrollWidth: 500, clientWidth: 200, scrollLeft: 0 })
      const rtl = createScrollable({ overflowX: 'auto', direction: 'rtl' }, { scrollWidth: 500, clientWidth: 200, scrollLeft: 0 })

      expect(canScrollFurther(ltr, 'x', 1)).toBe(false)
      expect(canScrollFurther(ltr, 'x', -1)).toBe(true)
      expect(canScrollFurther(rtl, 'x', 1)).toBe(true)
      expect(canScrollFurther(rtl, 'x', -1)).toBe(false)
    })

    it('then a scrollable ancestor between the target and the boundary claims the gesture', () => {
      const boundary = document.createElement('div')

      document.body.append(boundary)

      const content = createScrollable({ overflowY: 'auto' }, { scrollHeight: 500, clientHeight: 200, scrollTop: 100 })
      const target = document.createElement('span')

      boundary.append(content)
      content.append(target)

      expect(isScrollClaimed(target, boundary, 'y', 1)).toBe(true)
      expect(isScrollClaimed(boundary, boundary, 'y', 1)).toBe(false)
      expect(isScrollClaimed(null, boundary, 'y', 1)).toBe(false)
    })
  })

  describe('when reading the translation of an element', () => {
    it('then it reads a matrix', () => {
      const element = document.createElement('div')
      const spy = vi.spyOn(globalThis, 'getComputedStyle')

      spy.mockReturnValue({ transform: 'matrix(1, 0, 0, 1, 12, 34)', translate: '' } as CSSStyleDeclaration)
      expect(readTranslate(element, 'transform')).toEqual({ x: 12, y: 34 })

      spy.mockReturnValue({ transform: 'none', translate: 'none' } as CSSStyleDeclaration)
      expect(readTranslate(element, 'transform')).toEqual({ x: 0, y: 0 })

      spy.mockReturnValue({ transform: 'translateY(5px)', translate: '12px 7px' } as CSSStyleDeclaration)
      expect(readTranslate(element, 'transform')).toBeNull()
      expect(readTranslate(element, 'translate')).toEqual({ x: 12, y: 7 })

      spy.mockReturnValue({ transform: '', translate: '40px' } as CSSStyleDeclaration)
      expect(readTranslate(element, 'transform')).toBeNull()
      expect(readTranslate(element, 'translate')).toEqual({ x: 40, y: 0 })

      spy.mockRestore()
    })
  })
})

describe('given the edge cases of the velocity and the translation', () => {
  describe('when no sample is close enough to the last one', () => {
    it('then the velocity is zero', () => {
      const samples = { find: () => undefined, at: () => ({ time: 10, position: 0 }) } as unknown as { time: number, position: number }[]

      expect(getReleaseVelocity(samples, 12)).toBe(0)
    })
  })

  describe('when the translation has no number', () => {
    it('then it falls back to zero', () => {
      const element = document.createElement('div')
      const spy = vi.spyOn(globalThis, 'getComputedStyle')

      spy.mockReturnValue({ transform: 'matrix(1, 0, 0, 1, x, y)', translate: 'a b' } as CSSStyleDeclaration)

      expect(readTranslate(element, 'transform')).toEqual({ x: 0, y: 0 })
      expect(readTranslate(element, 'translate')).toEqual({ x: 0, y: 0 })

      spy.mockRestore()
    })
  })
})
