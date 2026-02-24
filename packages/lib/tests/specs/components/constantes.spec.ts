import { colors, sizes } from '@components/constantes'

describe('given constantes', () => {
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
        'transparent',
      ])
    })

    it('then it should have 9 colors', () => {
      expect(colors).toHaveLength(9)
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
