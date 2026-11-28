import { useEventListener } from '@composables/useEventListener.ts'

vi.mock('@maz-ui/utils/helpers/isClient', () => ({
  isClient: () => false,
}))

describe('given the useEventListener composable on the server', () => {
  describe('when it is called', () => {
    it('then it returns a no-op stop function without touching the target', () => {
      const target = { addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as Window
      const stop = useEventListener(target, 'resize', vi.fn())

      stop()

      expect(target.addEventListener).not.toHaveBeenCalled()
      expect(target.removeEventListener).not.toHaveBeenCalled()
    })
  })
})
