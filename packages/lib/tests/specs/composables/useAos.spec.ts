import { useAos } from '@composables/useAos'
import { withSetup } from '@tests/helpers/withSetup'

describe('given useAos composable', () => {
  describe('when AOS plugin is installed', () => {
    it('then it should return the AOS handler', () => {
      const mockAosHandler = {
        init: vi.fn(),
        refresh: vi.fn(),
        refreshHard: vi.fn(),
      }

      const [result] = withSetup(() => useAos(), {
        mazAos: mockAosHandler,
      })

      expect(result).toBe(mockAosHandler)
    })
  })

  describe('when AOS plugin is not installed', () => {
    it('then it should throw an error with specific message', () => {
      expect(() => {
        withSetup(() => useAos())
      }).toThrow('[maz-ui](useAos) AosPlugin is not installed')
    })
  })
})
