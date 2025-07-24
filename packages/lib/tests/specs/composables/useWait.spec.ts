import { useWait } from '@composables/useWait'
import { withSetup } from '@tests/helpers/withSetup'

describe('given useWait composable', () => {
  describe('when wait plugin is installed', () => {
    it('then it should return the wait handler', () => {
      const mockWaitHandler = {
        start: vi.fn(),
        stop: vi.fn(),
        isWaiting: vi.fn().mockReturnValue(false),
      }

      const [result] = withSetup(() => useWait(), {
        mazWait: mockWaitHandler,
      })

      expect(result).toBe(mockWaitHandler)
    })
  })

  describe('when wait plugin is not installed', () => {
    it('then it should throw an error with specific message', () => {
      expect(() => {
        withSetup(() => useWait())
      }).toThrow('[maz-ui](useWait) WaitPlugin is not installed')
    })
  })
})
