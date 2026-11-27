import { useWindow } from '@composables/useWindow.ts'

vi.mock('@maz-ui/utils/helpers/isClient', () => ({
  isClient: () => false,
}))

describe('given the useWindow composable on the server', () => {
  describe('when it is called', () => {
    it('then the window is undefined and listening does nothing', () => {
      const { window: win, isSupported, on } = useWindow()

      expect(win).toBeUndefined()
      expect(isSupported).toBe(false)
      expect(() => on('resize', vi.fn())()).not.toThrow()
    })
  })
})
