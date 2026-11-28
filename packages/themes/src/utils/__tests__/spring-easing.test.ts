import { DEFAULT_MOTION } from '../../presets/_defaults.ts'
import { springEasing } from '../spring-easing.ts'

describe('given springEasing', () => {
  describe('when it is called without options', () => {
    it('then it settles from 0 to 1 without bouncing', () => {
      const values = springEasing().slice('linear('.length, -1).split(', ').map(Number)

      expect(values[0]).toBe(0)
      expect(values.at(-1)).toBe(1)
      expect(Math.max(...values)).toBeLessThanOrEqual(1)
      expect(values).toHaveLength(33)
    })
  })

  describe('when the damping is low', () => {
    it('then the curve goes beyond 1 before settling', () => {
      const values = springEasing({ stiffness: 260, damping: 20 }).slice('linear('.length, -1).split(', ').map(Number)

      expect(Math.max(...values)).toBeGreaterThan(1)
      expect(values.at(-1)).toBe(1)
    })
  })

  describe('when the number of points is set', () => {
    it('then the curve has one more value than points', () => {
      expect(springEasing({ points: 10 }).split(',')).toHaveLength(11)
    })
  })
})

describe('given the default motion tokens', () => {
  describe('when their springs are compared to springEasing', () => {
    it('then they are its written out curves', () => {
      expect(DEFAULT_MOTION['easing-spring']).toBe(springEasing())
      expect(DEFAULT_MOTION['easing-bounce']).toBe(springEasing({ stiffness: 260, damping: 20 }))
    })
  })
})
