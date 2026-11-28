import { getSparklineAreaPath, getSparklinePath, getSparklinePoints, getSparklineTrend } from '@/utils/sparkline'

describe('given the sparkline helpers', () => {
  describe('when computing the points', () => {
    it('then the lowest value is at the bottom and the highest at the top', () => {
      const points = getSparklinePoints([1, 5, 3], 100, 20, 2)

      expect(points[0]).toEqual({ x: 2, y: 18, value: 1 })
      expect(points[1]).toEqual({ x: 50, y: 2, value: 5 })
      expect(points[2]!.x).toBe(98)
    })

    it('then a flat series is centered', () => {
      expect(getSparklinePoints([4, 4], 100, 20).every(point => point.y === 10)).toBe(true)
    })

    it('then a single value is centered horizontally', () => {
      expect(getSparklinePoints([4], 100, 20)[0]!.x).toBe(50)
    })

    it('then an empty series gives no point and the invalid numbers are skipped', () => {
      expect(getSparklinePoints([], 100, 20)).toEqual([])
      expect(getSparklinePoints([1, Number.NaN, 2], 100, 20)).toHaveLength(2)
    })
  })

  describe('when computing the path', () => {
    it('then straight segments use L commands', () => {
      const path = getSparklinePath(getSparklinePoints([1, 2, 3], 100, 20), false)

      expect(path.startsWith('M')).toBe(true)
      expect(path.match(/L/g)).toHaveLength(2)
    })

    it('then the smooth path uses cubic curves that stay inside the data range', () => {
      const points = getSparklinePoints([1, 9, 2, 8, 8, 3], 100, 20, 2)
      const path = getSparklinePath(points, true)
      const ys = [...path.matchAll(/C([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)/g)].flatMap(match => [Number(match[2]), Number(match[4])])

      expect(path.match(/C/g)).toHaveLength(5)
      expect(Math.min(...ys)).toBeGreaterThanOrEqual(2)
      expect(Math.max(...ys)).toBeLessThanOrEqual(18)
    })

    it('then two points use a straight line and one point only a move', () => {
      expect(getSparklinePath(getSparklinePoints([1, 2], 100, 20), true)).toContain('L')
      expect(getSparklinePath(getSparklinePoints([1], 100, 20), true)).toMatch(/^M[\d.]+ [\d.]+$/)
      expect(getSparklinePath([], true)).toBe('')
    })

    it('then the area closes on the bottom edge', () => {
      const points = getSparklinePoints([1, 2, 3], 100, 20)
      const area = getSparklineAreaPath(getSparklinePath(points), points, 20)

      expect(area.endsWith('Z')).toBe(true)
      expect(area).toContain('L97 20')
      expect(getSparklineAreaPath('', [], 20)).toBe('')
    })
  })

  describe('when reading the trend', () => {
    it('then it compares the last value to the first', () => {
      expect(getSparklineTrend([1, 5])).toBe('up')
      expect(getSparklineTrend([5, 1])).toBe('down')
      expect(getSparklineTrend([3, 9, 3])).toBe('flat')
      expect(getSparklineTrend([3])).toBe('flat')
    })
  })
})
