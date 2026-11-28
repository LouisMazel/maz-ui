import { resolveSnapPoints, resolveSnapSize, resolveSnapTarget, shouldDismiss } from '@/utils/sheetSnap.ts'

describe('given the snap points of a sheet', () => {
  describe('when resolving the size of a point', () => {
    it.each([
      [0.5, 800, 400],
      [1, 800, 800],
      [320, 800, 320],
      ['50%', 800, 400],
      ['60vh', 800, 480],
      ['25dvh', 800, 200],
      ['20rem', 800, 320],
      ['300px', 800, 300],
      ['300', 800, 300],
    ])('then %s of a %spx viewport is %spx', (point, viewport, expected) => {
      expect(resolveSnapSize(point, viewport)).toBe(expected)
    })

    it('then it uses the root font size', () => {
      expect(resolveSnapSize('10rem', 800, 20)).toBe(200)
    })

    it('then an invalid value is NaN', () => {
      expect(resolveSnapSize('half', 800)).toBeNaN()
    })
  })

  describe('when resolving a list of points', () => {
    it('then it sorts them, drops the invalid and duplicated ones and caps them to the viewport', () => {
      const points = resolveSnapPoints([1, 'bad', 0.5, '50%', 5000, -4], 800)

      expect(points.map(point => point.size)).toEqual([400, 800])
      expect(points[0]?.value).toBe(0.5)
    })

    it('then it returns nothing without points or viewport', () => {
      expect(resolveSnapPoints(undefined, 800)).toEqual([])
      expect(resolveSnapPoints([0.5], 0)).toEqual([])
    })
  })

  describe('when a sheet without snap points is released', () => {
    it.each([
      [130, 0, true],
      [119, 0, false],
      [30, 0.8, true],
      [30, 0.2, false],
      [0, 2, false],
    ])('then a position of %spx at %s px/ms dismisses: %s', (position, velocity, expected) => {
      expect(shouldDismiss({ position, velocity })).toBe(expected)
    })
  })

  describe('when a sheet with snap points is released', () => {
    const sizes = [300, 600]

    it('then a slow release goes to the nearest point', () => {
      expect(resolveSnapTarget({ visible: 520, velocity: 0.1, sizes, dismissible: true })).toBe(1)
      expect(resolveSnapTarget({ visible: 400, velocity: 0.1, sizes, dismissible: true })).toBe(0)
    })

    it('then a slow release under half of the lowest point closes', () => {
      expect(resolveSnapTarget({ visible: 100, velocity: 0, sizes, dismissible: true })).toBe('close')
    })

    it('then a persistent sheet never closes', () => {
      expect(resolveSnapTarget({ visible: 100, velocity: 0, sizes, dismissible: false })).toBe(0)
      expect(resolveSnapTarget({ visible: 500, velocity: 2, sizes: [600], dismissible: false })).toBe(0)
    })

    it('then a flick down goes to the next lower point', () => {
      expect(resolveSnapTarget({ visible: 590, velocity: 1, sizes, dismissible: true })).toBe(0)
    })

    it('then a flick down from the lowest point closes', () => {
      expect(resolveSnapTarget({ visible: 290, velocity: 1, sizes, dismissible: true })).toBe('close')
    })

    it('then a flick up goes to the next higher point', () => {
      expect(resolveSnapTarget({ visible: 310, velocity: -1, sizes, dismissible: true })).toBe(1)
    })

    it('then a flick up from the highest point stays there', () => {
      expect(resolveSnapTarget({ visible: 600, velocity: -1, sizes, dismissible: true })).toBe(1)
    })

    it('then it closes or stays without points', () => {
      expect(resolveSnapTarget({ visible: 100, velocity: 0, sizes: [], dismissible: true })).toBe('close')
      expect(resolveSnapTarget({ visible: 100, velocity: 0, sizes: [], dismissible: false })).toBe(0)
    })
  })
})
