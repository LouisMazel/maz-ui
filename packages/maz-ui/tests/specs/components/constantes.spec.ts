import { colors, sizes } from '@components/constants.ts'

describe('given constants', () => {
  describe('when accessing colors', () => {
    it('then it should contain all expected color values', () => {
      expect(colors).toEqual([
        'primary',
        'secondary',
        'accent',
        'info',
        'success',
        'warning',
        'destructive',
        'contrast',
        'neutral',
        'transparent',
      ])
    })

    it('then it should have 10 colors', () => {
      expect(colors).toHaveLength(10)
    })
  })

  describe('when accessing sizes', () => {
    it('then it should contain all expected size values', () => {
      expect(sizes).toEqual(['mini', 'xs', 'sm', 'md', 'lg', 'xl'])
    })

    it('then it should have 6 sizes', () => {
      expect(sizes).toHaveLength(6)
    })
  })
})
